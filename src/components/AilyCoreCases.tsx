import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { animate, useMotionValue, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motionSettings } from '@/data/portfolio';
import { WheelIntent } from '@/hooks/wheelIntent';
import CaseVideo from './CaseVideo';
import './AilyCoreCases.css';

// Source: Figma 660:42967 and 667:50832. Both explicitly reserve video for later.
// Add only the corresponding user-provided local media path to video when available.
const ailyCoreCases = [
  { id: 'partner-management', title: '聚合伙伴，统一管理', video: 'media/aily-partner-management.mp4', displayRatio: 1148 / 720 },
  { id: 'partner-orchestration', title: '编排伙伴之间的调度关系', video: 'media/aily-team-management.mp4', displayRatio: 1148 / 720 },
];

export default function AilyCoreCases() {
  const [selected, setSelected] = useState(0);
  const selectedRef = useRef(0);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const position = useMotionValue(0);
  const reduced = useReducedMotion();
  const animation = useRef<ReturnType<typeof animate> | null>(null);
  const finishTimer = useRef(0);
  const drag = useRef({ id: -1, x: 0, y: 0, start: 0, moved: false });
  const suppressClick = useRef(false);
  const count = ailyCoreCases.length;

  const choose = useCallback((next: number, instant = false) => {
    const index = Math.max(0, Math.min(count - 1, next));
    selectedRef.current = index;
    setSelected(index);
    animation.current?.stop();
    window.clearTimeout(finishTimer.current);
    const destination = -index * (viewport.current?.getBoundingClientRect().width || 0);
    if (instant || reduced || document.hidden) position.set(destination);
    else {
      animation.current = animate(position, destination, { duration: .55, ease: motionSettings.ease });
      finishTimer.current = window.setTimeout(() => {
        animation.current?.stop(); position.set(destination);
      }, 700);
    }
  }, [count, position, reduced]);

  useEffect(() => {
    const unsubscribe = position.on('change', value => {
      if (track.current) track.current.style.transform = `translate3d(${value}px,0,0)`;
    });
    return () => { unsubscribe(); animation.current?.stop(); window.clearTimeout(finishTimer.current); };
  }, [position]);

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const intent = new WheelIntent();
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      if (!event.shiftKey && Math.abs(event.deltaX) <= Math.abs(event.deltaY) * 1.05) return;
      event.preventDefault(); event.stopPropagation();
      const delta = event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX;
      const factor = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientWidth : 1;
      const direction = intent.consume(delta * factor, performance.now());
      if (direction) choose(selectedRef.current + direction);
    };
    const observer = new ResizeObserver(() => choose(selectedRef.current, true));
    observer.observe(element);
    element.addEventListener('wheel', wheel, { passive: false });
    return () => { observer.disconnect(); element.removeEventListener('wheel', wheel); };
  }, [choose]);

  const down = (event: PointerEvent<HTMLDivElement>) => {
    if (event.isPrimary === false || (event.pointerType === 'mouse' && event.button !== 0)) return;
    animation.current?.stop(); window.clearTimeout(finishTimer.current);
    suppressClick.current = false;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, start: position.get(), moved: false };
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d.id !== event.pointerId || !viewport.current) return;
    const dx = event.clientX - d.x, dy = event.clientY - d.y;
    if (!d.moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      d.moved = true; event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (!d.moved) return;
    const min = -(count - 1) * viewport.current.getBoundingClientRect().width;
    const next = d.start + dx;
    position.set(next > 0 ? next * .15 : next < min ? min + (next - min) * .15 : next);
  };
  const endDrag = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const d = drag.current;
    if (d.id !== event.pointerId) return;
    const dx = event.clientX - d.x;
    const threshold = Math.min(60, (viewport.current?.getBoundingClientRect().width || 1) * .12);
    const next = !cancelled && d.moved && Math.abs(dx) > threshold
      ? selectedRef.current + (dx < 0 ? 1 : -1) : selectedRef.current;
    suppressClick.current = d.moved;
    drag.current.id = -1;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    choose(next);
  };

  return <section className="miaoda-core-design aily-cases" aria-label="核心设计 01：两个伙伴管理案例" data-case={selected + 1}>
    <div ref={viewport} className="aily-cases-viewport" tabIndex={0} role="region" aria-label="横向拖拽、滚动或左右方向键切换伙伴管理案例"
      onPointerDown={down} onPointerMove={move} onPointerUp={event => endDrag(event)} onPointerCancel={event => endDrag(event, true)}
      onClickCapture={event => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } }}
      onKeyDown={event => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        event.preventDefault(); event.stopPropagation();
        choose(selectedRef.current + (event.key === 'ArrowRight' ? 1 : -1));
      }}>
      <div ref={track} className="aily-cases-track">
        {ailyCoreCases.map((item, index) => <article key={item.id} className="aily-case" aria-hidden={selected !== index} inert={selected !== index}>
          <h2 onPointerDown={event => event.stopPropagation()}>{item.title}</h2>
          <div className="aily-case-media" style={{ '--aily-case-media-ratio': item.displayRatio } as CSSProperties}>
            {item.video ? <CaseVideo src={item.video} active={selected === index} title={`Aily 案例 ${index + 1} · ${item.title}`} edgeToEdge displayRatio={item.displayRatio}/>
              : <div className="aily-case-placeholder" aria-label={`${item.title}：视频待补充`}>这里后续补上视频</div>}
          </div>
        </article>)}
      </div>
    </div>
    <nav className="aily-case-controls" aria-label="伙伴管理案例分页">
      <button type="button" className="aily-case-arrow" disabled={selected === 0} aria-label="上一个伙伴管理案例" onClick={() => choose(selectedRef.current - 1)}><ChevronLeft/></button>
      <div className="aily-case-dots">{ailyCoreCases.map((item, index) =>
        <button type="button" key={item.id} aria-label={`切换到案例 ${index + 1}：${item.title}`} aria-current={selected === index} onClick={() => choose(index)}><span/></button>)}</div>
      <button type="button" className="aily-case-arrow" disabled={selected === count - 1} aria-label="下一个伙伴管理案例" onClick={() => choose(selectedRef.current + 1)}><ChevronRight/></button>
    </nav>
    <span className="core-design-status" aria-live="polite">案例 {selected + 1} / {count} · {ailyCoreCases[selected].title}</span>
  </section>;
}
