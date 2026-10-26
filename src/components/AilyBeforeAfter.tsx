import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { asset } from '@/data/portfolio';
import './AilyBeforeAfter.css';

const MIN_POSITION = 4;
const MAX_POSITION = 96;
const START_POSITION = 50;

export default function AilyBeforeAfter() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef(0);
  const direction = useRef<1 | -1>(1);
  const lastTime = useRef(0);
  const dragging = useRef(false);
  const pointerPosition = useRef(START_POSITION);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState(START_POSITION);
  const [scanDirection, setScanDirection] = useState<1 | -1>(1);
  const [playing, setPlaying] = useState(true);

  const stopFrame = useCallback(() => {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = 0; lastTime.current = 0;
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (!entry.isIntersecting) stopFrame();
    }, { threshold: .25 });
    observer.observe(element);
    return () => { observer.disconnect(); stopFrame(); };
  }, [stopFrame]);

  useEffect(() => {
    stopFrame();
    if (!playing || !visible || dragging.current || document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tick = (time: number) => {
      const delta = lastTime.current ? Math.min(32, time - lastTime.current) : 0;
      lastTime.current = time;
      if (delta) setPosition(current => {
        let next = current + direction.current * delta * .018;
        if (next >= 88) { next = 88; direction.current = -1; setScanDirection(-1); }
        if (next <= 12) { next = 12; direction.current = 1; setScanDirection(1); }
        return next;
      });
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return stopFrame;
  }, [playing, visible, stopFrame]);

  const updateFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const next = Math.max(MIN_POSITION, Math.min(MAX_POSITION, ((event.clientX - rect.left) / rect.width) * 100));
    if (Math.abs(next - pointerPosition.current) > .1) {
      const nextDirection = next > pointerPosition.current ? 1 : -1;
      direction.current = nextDirection;
      setScanDirection(nextDirection);
    }
    pointerPosition.current = next;
    setPosition(next);
  };
  const down = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    dragging.current = true; stopFrame();
    pointerPosition.current = position;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromPointer(event);
  };
  const up = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    lastTime.current = 0;
    if (playing) setPlaying(false);
  };
  const reset = () => {
    direction.current = 1; pointerPosition.current = START_POSITION; setScanDirection(1); setPosition(START_POSITION); setPlaying(true);
  };
  const style = { '--compare-position': `${position}%` } as CSSProperties;

  return <section ref={root} className="miaoda-project-hero aily-before-after" aria-label="统一智能体配置框架改版前后对比" style={style}>
    <h2>统一智能体配置框架</h2>
    <div className="aily-compare-frame" role="slider" tabIndex={0} aria-label="拖动查看改版前后差异" aria-valuemin={MIN_POSITION} aria-valuemax={MAX_POSITION} aria-valuenow={Math.round(position)} aria-valuetext={`已显示 ${Math.round(position)}% 改版后界面`}
      onPointerDown={down} onPointerMove={event => { if (dragging.current) updateFromPointer(event); }} onPointerUp={up} onPointerCancel={up}
      onKeyDown={event => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault(); setPlaying(false);
        const nextDirection = event.key === 'ArrowRight' ? 1 : -1;
        direction.current = nextDirection; setScanDirection(nextDirection);
        setPosition(current => Math.max(MIN_POSITION, Math.min(MAX_POSITION, current + nextDirection * 2)));
      }}>
      <img className="aily-compare-image aily-compare-before" src={asset('media/aily-partner-before.png')} alt="改版前：伙伴信息和配置分散在档案侧栏与多级页签中" draggable={false}/>
      <img className="aily-compare-image aily-compare-after" src={asset('media/aily-partner-after.png')} alt="改版后：统一智能体配置框架，伙伴身份、能力与配置集中呈现" draggable={false}/>
      <span className="aily-compare-label aily-compare-label-before">BEFORE</span>
      <span className="aily-compare-label aily-compare-label-after">AFTER</span>
      <span className={`aily-compare-divider${scanDirection === 1 ? ' is-moving-right' : ' is-moving-left'}`} aria-hidden="true"><span className="aily-compare-scan-fade"/></span>
    </div>
    <div className="aily-compare-controls" aria-label="扫描动画控制">
      <button type="button" aria-label={playing ? '暂停自动扫描' : '继续自动扫描'} onClick={() => setPlaying(value => !value)}>{playing ? <Pause/> : <Play/>}</button>
      <button type="button" aria-label="重置扫描位置" onClick={reset}><RotateCcw/></button>
      <output aria-live="polite">改版后 {Math.round(position)}%</output>
    </div>
  </section>;
}
