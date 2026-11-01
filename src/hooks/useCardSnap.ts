import { useEffect, type RefObject } from 'react';
import { animate } from 'framer-motion';
import { VerticalWheelIntent } from './verticalWheelIntent';

// Use layout coordinates, not animated bounding boxes, to keep snap targets stable.
function documentTop(element: HTMLElement) {
  let top = 0;
  let node: HTMLElement | null = element;
  while (node) { top += node.offsetTop; node = node.offsetParent as HTMLElement | null; }
  return top;
}

export default function useCardSnap(
  mainRef: RefObject<HTMLElement | null>, selector: string, pageKey: string,
) {
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const cards = Array.from(main.querySelectorAll<HTMLElement>(selector));
    const snapCards = cards.filter(card => card.dataset.snapNative !== 'true');
    if (!snapCards.length) return;
    const original = { top: main.style.paddingTop, bottom: main.style.paddingBottom, minHeight: main.style.minHeight };
    const computed = getComputedStyle(main);
    const baseTop = parseFloat(computed.paddingTop) || 0;
    const baseBottom = parseFloat(computed.paddingBottom) || 0;
    let active = 0, frame = 0, settleTimer = 0, resizing = 0, animationTimer = 0, generation = 0;
    let running = false, disposed = false;
    let queued: -1 | 0 | 1 = 0;
    let movingDirection = 0;
    const wheelIntent = new VerticalWheelIntent();
    let animation: ReturnType<typeof animate> | undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const announce = () => window.dispatchEvent(new CustomEvent('portfolio:snap-active', { detail: { pageKey, index: active } }));
    const markActive = (index: number) => {
      active = index;
      cards.forEach(card => { card.dataset.snapActive = 'false'; });
      snapCards.forEach((card, i) => { card.dataset.snapActive = String(i === index); });
      announce();
    };
    const fits = (card: HTMLElement) => card.offsetHeight <= window.innerHeight - 24;
    const target = (card: HTMLElement) => Math.max(0,
      documentTop(card) - (fits(card) ? (window.innerHeight - card.offsetHeight) / 2 : 16),
    );
    const nativeCard = cards.find(item => item.dataset.snapNative === 'true');
    const nativeFlowStart = () => target(snapCards[snapCards.length - 1]) + 2;
    const inNativeFlow = () => Boolean(nativeCard) && window.scrollY >= nativeFlowStart();
    const nearest = () => snapCards.reduce((best, card, i) =>
      Math.abs(target(card) - window.scrollY) < Math.abs(target(snapCards[best]) - window.scrollY) ? i : best, 0);
    const measure = () => {
      main.style.paddingTop = `${baseTop}px`;
      main.style.paddingBottom = `${baseBottom}px`;
      main.style.minHeight = '0px';
      const leading = Math.max(0, (window.innerHeight - snapCards[0].offsetHeight) / 2 - documentTop(snapCards[0]));
      main.style.paddingTop = `${baseTop + leading}px`;
      const last = cards[cards.length - 1];
      const trailing = Math.max(0, window.innerHeight - last.offsetHeight - baseBottom);
      main.style.paddingBottom = `${baseBottom + trailing}px`;
    };
    const stop = () => {
      generation++;
      animation?.stop();
      window.clearTimeout(animationTimer);
      window.clearTimeout(settleTimer);
      running = false;
      queued = 0;
    };
    const snap = (index: number, instant = false) => {
      if (disposed) return;
      stop();
      const token = generation;
      markActive(Math.max(0, Math.min(snapCards.length - 1, index)));
      const destination = target(snapCards[active]);
      const distance = destination - window.scrollY;
      movingDirection = Math.sign(distance);
      if (instant || reduced.matches || document.hidden || Math.abs(distance) < 1) {
        window.scrollTo({ top: destination, behavior: 'instant' });
        announce();
        return;
      }
      running = true;
      const finish = () => {
        if (disposed || token !== generation || !running) return;
        window.clearTimeout(animationTimer);
        running = false;
        window.scrollTo({ top: destination, behavior: 'instant' });
        const next = queued;
        queued = 0;
        announce();
        // One pending intent only: immediately continue, but never skip reading a tall card.
        if (next && fits(snapCards[active]) && active + next >= 0 && active + next < snapCards.length) snap(active + next);
      };
      const duration = Math.max(.2, Math.min(.36, .22 + Math.abs(distance) / window.innerHeight * .16));
      animation = animate(window.scrollY, destination, {
        duration, ease: [.22, .65, .3, 1],
        onUpdate: value => { if (token === generation) window.scrollTo({ top: value, behavior: 'instant' }); },
        onComplete: finish,
      });
      animationTimer = window.setTimeout(() => { if (token === generation) { animation?.stop(); finish(); } }, duration * 1000 + 100);
    };
    const request = (direction: -1 | 1) => {
      if (running && direction === movingDirection) {
        queued = direction; // Coalesce repeated input; no unbounded backlog after the user stops.
        return;
      }
      const next = Math.max(0, Math.min(snapCards.length - 1, active + direction));
      if (next === active && !running && Math.abs(window.scrollY - target(snapCards[active])) < 1) return;
      snap(next); // A reversal responds immediately from the current position.
    };
    const editable = (node: EventTarget | null) => node instanceof Element &&
      Boolean(node.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]'));
    const canReadWithin = (direction: number) => {
      const card = snapCards[active];
      if (fits(card)) return false;
      const start = target(card);
      const end = documentTop(card) + card.offsetHeight - window.innerHeight;
      return direction > 0 ? window.scrollY < end - 2 : window.scrollY > start + 2;
    };
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.shiftKey || event.defaultPrevented || editable(event.target)) return;
      // Resolve the axis BEFORE animation handling, so horizontal cases stay independent.
      const horizontalTrack = event.target instanceof Element && Boolean(event.target.closest('.miaoda-journey-track, .miaoda-core-design, .beauty-evaluation-strip'));
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY) * (horizontalTrack ? 1.05 : 1.5)) return;
      const factor = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      const vertical = event.deltaY * factor;
      const direction = Math.sign(vertical);
      if (!direction) return;
      // Always feed input to the classifier, including during animations and native tall-card reading.
      const intent = wheelIntent.consume(vertical, performance.now());
      if (!running && (canReadWithin(direction) || inNativeFlow() || (nativeCard && active === snapCards.length - 1 && direction > 0))) return;
      event.preventDefault();
      if (intent) request(intent);
    };
    const key = (event: KeyboardEvent) => {
      if (editable(event.target) || event.altKey || event.ctrlKey || event.metaKey) return;
      const direction = event.key === 'ArrowDown' || event.key === 'PageDown' || (event.key === ' ' && !event.shiftKey) ? 1
        : event.key === 'ArrowUp' || event.key === 'PageUp' || (event.key === ' ' && event.shiftKey) ? -1 : 0;
      if (event.key === ' ' && event.target instanceof Element && event.target.closest('button, a')) return;
      if (inNativeFlow() || (nativeCard && active === snapCards.length - 1 && direction > 0)) return;
      if (direction && (running || !canReadWithin(direction))) {
        event.preventDefault();
        if (!event.repeat) request(direction);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault(); snap(event.key === 'Home' ? 0 : snapCards.length - 1);
      }
    };
    const settled = () => {
      if (running || inNativeFlow()) return;
      const card = snapCards[active];
      if (!fits(card) && window.scrollY >= target(card) &&
          window.scrollY <= documentTop(card) + card.offsetHeight - window.innerHeight) return;
      const index = nearest();
      if (Math.abs(window.scrollY - target(snapCards[index])) < 1) {
        if (active !== index) markActive(index);
        return;
      }
      snap(index);
    };
    const scroll = () => {
      if (running || inNativeFlow()) return;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settled, 120);
    };
    const resize = () => {
      window.cancelAnimationFrame(resizing);
      const adjust = () => {
        const wasNative = inNativeFlow();
        stop(); measure();
        if (!wasNative) snap(active, true);
      };
      if (document.hidden) adjust();
      else resizing = window.requestAnimationFrame(adjust);
    };
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') stop();
    };
    const visibility = () => { if (running && !inNativeFlow()) snap(active, true); };
    measure();
    markActive(0);
    let initialized = false;
    const initialize = () => {
      if (disposed || initialized) return;
      initialized = true;
      window.cancelAnimationFrame(frame);
      snap(0, true);
    };
    const initializeTimer = window.setTimeout(() => { if (document.hidden) initialize(); }, 0);
    frame = window.requestAnimationFrame(initialize);
    const observer = new ResizeObserver(resize);
    cards.forEach(card => observer.observe(card));
    window.addEventListener('wheel', wheel, { passive: false });
    window.addEventListener('keydown', key);
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', resize);
    window.addEventListener('pointerdown', pointer, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    return () => {
      disposed = true; stop(); observer.disconnect();
      window.cancelAnimationFrame(frame); window.cancelAnimationFrame(resizing);
      window.clearTimeout(initializeTimer);
      window.removeEventListener('wheel', wheel); window.removeEventListener('keydown', key);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', pointer);
      document.removeEventListener('visibilitychange', visibility);
      main.style.paddingTop = original.top; main.style.paddingBottom = original.bottom;
      main.style.minHeight = original.minHeight;
      cards.forEach(card => { delete card.dataset.snapActive; });
    };
  }, [mainRef, selector, pageKey]);
}
