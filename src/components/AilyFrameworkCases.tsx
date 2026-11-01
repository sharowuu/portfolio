import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { asset } from '@/data/portfolio';
import { WheelIntent } from '@/hooks/wheelIntent';
import useViewport from '@/hooks/useViewport';
import cases from '@/data/aily-framework-layout.json';
import CaseVideo from './CaseVideo';
import AilyTooltips from './AilyTooltips';
import { ailyArtwork, isAilyTooltip } from '@/data/aily-tooltip-utils';

const at = (x: number, y: number, width?: number, height?: number): CSSProperties => ({
  left: `${x / 724 * 100}%`, top: `${y / 676 * 100}%`,
  ...(width === undefined ? {} : { width: `${width / 724 * 100}%` }),
  ...(height === undefined ? {} : { height: `${height / 676 * 100}%` }),
});

export default function AilyFrameworkCases() {
  const { mobile } = useViewport();
  const [selected, setSelected] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);
  const drag = useRef({ id: -1, x: 0, y: 0, axis: '' });
  const choose = (next: number) => { setDragOffset(0); setSelected(Math.max(0, Math.min(cases.length - 1, next))); };
  useEffect(() => {
    const element = viewport.current?.closest('section');
    if (!element) return;
    const intent = new WheelIntent();
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.defaultPrevented) return;
      if (!event.shiftKey && Math.abs(event.deltaX) <= Math.abs(event.deltaY) * 1.05) return;
      const factor = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientWidth : 1;
      const delta = (event.shiftKey && event.deltaX === 0 ? event.deltaY : event.deltaX) * factor;
      if (!delta) return;
      event.preventDefault(); event.stopPropagation();
      const direction = intent.consume(delta, performance.now());
      if (direction) {
        setDragOffset(0);
        setSelected(value => Math.max(0, Math.min(cases.length - 1, value + direction)));
      }
    };
    element.addEventListener('wheel', wheel, { passive: false });
    return () => element.removeEventListener('wheel', wheel);
  }, []);
  const finishDrag = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const state = drag.current;
    if (state.id !== event.pointerId) return;
    const dx = event.clientX - state.x;
    if (!cancelled && state.axis === 'x' && Math.abs(dx) > 35) choose(selected + (dx < 0 ? 1 : -1));
    setDragOffset(0);
    drag.current = { id: -1, x: 0, y: 0, axis: '' };
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return <>
    <div ref={viewport} className={`aily-framework-viewport${mobile ? ' is-mobile' : ''}`} tabIndex={0} role="region" aria-roledescription="轮播" aria-label="统一智能体配置框架：三个横向案例" data-active-case={selected + 1}
      onKeyDown={event => { if (['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); event.stopPropagation(); choose(selected + (event.key === 'ArrowRight' ? 1 : -1)); } }}
      onPointerDown={event => { if (event.button !== 0 || !event.isPrimary || (event.target as HTMLElement).closest('.aily-framework-copy')) return; drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, axis: '' }; }}
      onPointerMove={event => {
        const state = drag.current;
        if (state.id !== event.pointerId) return;
        const dx = event.clientX - state.x, dy = event.clientY - state.y;
        if (!state.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 8) state.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (state.axis !== 'x') return;
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
        const blocked = selected === 0 && dx > 0 || selected === cases.length - 1 && dx < 0;
        setDragOffset(blocked ? dx * .15 : dx);
      }}
      onPointerUp={event => finishDrag(event)} onPointerCancel={event => finishDrag(event, true)}>
      <div className={`aily-framework-track${dragOffset ? ' is-dragging' : ''}`} style={{ transform: `translateX(calc(-${selected * 100}% + ${dragOffset}px))` }}>
        {cases.map((page, index) => <div key={page.node} className="aily-framework-panel" role="group" aria-roledescription="案例" aria-label={`${index + 1} / 3：${page.label}`} aria-hidden={selected !== index} inert={selected !== index} data-framework-case={index + 1} data-figma-node={page.node}>
          {page.texts.map((block, i) => {
            if (isAilyTooltip(block)) return null;
            const first = block.lines[0], text = block.lines.map(line => line.text).join('');
            const style: CSSProperties | undefined = mobile ? undefined : { ...at(first.x, first.y - block.size * .86), fontSize: `${block.size / 724 * 100}cqw`, color: block.color, fontWeight: block.bold ? 600 : 400 };
            return block.bold ? <h2 key={i} className="aily-framework-copy" style={style}>{text}</h2> : <p key={i} className="aily-framework-copy aily-framework-annotation" style={style}>{text}</p>;
          })}
          <AilyTooltips art={page.art} active={selected === index} flow={mobile}/>
          {page.art ? mobile ? <div className="aily-framework-mobile-art"><img src={asset(ailyArtwork(page.art))} alt={page.label} draggable={false}/></div> : <img className="aily-framework-art" src={asset(ailyArtwork(page.art))} alt={page.label} decoding="async" draggable={false}/> : <div className="aily-framework-media" style={mobile ? undefined : at(50, 134, 624, 391)}>
            <CaseVideo src="media/aily-framework-team-management.mp4" active={selected === index} title="编排伙伴之间的调度关系" edgeToEdge displayRatio={1148 / 720}/>
          </div>}
        </div>)}
      </div>
    </div>
    <nav className="aily-revised-pagination aily-framework-pagination" aria-label="统一框架案例切换" style={at(269, Math.max(...cases.map(page => page.controlsY)) - 12, 186, 24)}>
      <button className="aily-revised-arrow prev" disabled={selected === 0} aria-label="上一个框架案例" onClick={() => choose(selected - 1)}><ChevronLeft/></button>
      <div className="aily-revised-dots">{cases.map((page, index) => <button key={page.node} aria-label={`查看框架案例${index + 1}：${page.label}`} aria-current={selected === index} onClick={() => choose(index)}><span/></button>)}</div>
      <button className="aily-revised-arrow next" disabled={selected === cases.length - 1} aria-label="下一个框架案例" onClick={() => choose(selected + 1)}><ChevronRight/></button>
      <span className="aily-revised-sr" aria-live="polite">案例 {selected + 1} / 3：{cases[selected].label}</span>
    </nav>
  </>;
}
