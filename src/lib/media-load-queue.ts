// One shared image queue: visible assets first; speculative work is serial and idle-only.
type Priority = 'visible' | 'idle';
type Listener = { priority: Priority; ready: () => void };
type Job = { src: string; listeners: Set<Listener>; image?: HTMLImageElement; priority?: Priority; timer?: number };
const jobs = new Map<string, Job>();
const loaded = new Set<string>();
let running = 0;
let idleTimer = 0;
let videoWaits = 0;

function priority(job: Job): Priority {
  return [...job.listeners].some(listener => listener.priority === 'visible') ? 'visible' : 'idle';
}
function allowIdle() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return !document.hidden && document.readyState === 'complete' && !videoWaits
    && !connection?.saveData && !['slow-2g', '2g', '3g'].includes(connection?.effectiveType || '');
}
function stop(job: Job) {
  if (!job.image) return;
  job.image.onload = null;
  job.image.onerror = null;
  job.image.removeAttribute('src');
  window.clearTimeout(job.timer);
  job.image = undefined;
  running--;
}
function start(job: Job) {
  job.priority = priority(job);
  const image = new Image();
  job.image = image;
  running++;
  const finish = (success: boolean) => {
    if (job.image !== image) return;
    if (success) loaded.add(job.src);
    const listeners = [...job.listeners];
    stop(job);
    jobs.delete(job.src);
    // On error, expose the real URL so native alt/error handling remains available.
    listeners.forEach(listener => listener.ready());
    pump();
  };
  image.onload = () => finish(true);
  image.onerror = () => finish(false);
  image.decoding = 'async';
  image.fetchPriority = job.priority === 'visible' ? 'high' : 'low';
  job.timer = window.setTimeout(() => finish(false), 20000);
  image.src = job.src;
}
function pump() {
  window.clearTimeout(idleTimer);
  const foreground = [...jobs.values()].filter(job => !job.image && priority(job) === 'visible');
  // A newly visible image takes bandwidth back from speculative work.
  if (foreground.length || videoWaits) {
    for (const job of jobs.values()) if (job.image && priority(job) === 'idle') stop(job);
  }
  while (running < 2 && foreground.length) start(foreground.shift()!);
  if ([...jobs.values()].some(job => !job.image && priority(job) === 'idle')) {
    idleTimer = window.setTimeout(() => {
      const run = () => {
        if (running || !allowIdle()) { pump(); return; }
        const next = [...jobs.values()].find(job => !job.image && priority(job) === 'idle');
        if (next) start(next);
      };
      if (window.requestIdleCallback) window.requestIdleCallback(run);
      else run();
    }, 1200);
  }
}
export function requestImage(src: string, loadPriority: Priority, ready: () => void) {
  if (loaded.has(src)) { ready(); return () => {}; }
  const listener = { priority: loadPriority, ready };
  let job = jobs.get(src);
  if (!job) { job = { src, listeners: new Set() }; jobs.set(src, job); }
  job.listeners.add(listener);
  pump();
  return () => {
    job.listeners.delete(listener);
    if (!job.listeners.size) { stop(job); jobs.delete(src); }
    pump();
  };
}
export function holdIdleImages() {
  videoWaits++;
  pump();
  let released = false;
  return () => { if (!released) { released = true; videoWaits--; pump(); } };
}
