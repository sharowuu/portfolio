import { useEffect, useRef, type PointerEvent } from 'react';
import { animate, useMotionValue, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { asset, miaodaCoreDesign, miaodaCoreExecution, miaodaCoreDelivery, miaodaCoreEditing, motionSettings } from '@/data/portfolio';
import { usePortfolio } from '@/data/portfolio-context';
import { WheelIntent } from '@/hooks/wheelIntent';
import Magnetic from './Magnetic';
import CaseVideo from './CaseVideo';

export default function CoreDesignSection({ execution = false, delivery = false, editing = false }: { execution?: boolean; delivery?: boolean; editing?: boolean }) {
  const context = usePortfolio();
  const corePoint = editing ? context.editingPoint : delivery ? context.deliveryPoint : execution ? context.executionPoint : context.corePoint;
  const setCorePoint = editing ? context.setEditingPoint : delivery ? context.setDeliveryPoint : execution ? context.setExecutionPoint : context.setCorePoint;
  const points = editing ? miaodaCoreEditing.points : delivery ? miaodaCoreDelivery.points : execution ? miaodaCoreExecution.points : miaodaCoreDesign.points;
  const caseLabel = editing ? '可视化修改案例' : delivery ? '阶段交付案例' : execution ? '执行协作案例' : '设计点';
  const grouped = execution || delivery || editing;
  const background = editing ? 'media/miaoda-editing-background.svg' : delivery ? 'media/miaoda-delivery-background.svg' : 'media/miaoda-execution-background.svg';
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const targetIndex = useRef(corePoint);
  const position = useMotionValue(0);
  const reduced = useReducedMotion();
  const animation = useRef<ReturnType<typeof animate> | null>(null);
  const finishTimer = useRef(0);
  const dragging = useRef({ id: -1, x: 0, y: 0, start: 0, moved: false });
  const count = points.length;
  const choose = (next: number) => {
    const index = Math.max(0, Math.min(count - 1, next));
    targetIndex.current = index;
    setCorePoint(index);
  };
  useEffect(() => {
    const unsubscribe = position.on('change', value => {
      if (track.current) track.current.style.transform = `translate3d(${value}px,0,0)`;
    });
    return unsubscribe;
  }, [position]);
  useEffect(() => {
    const index = Math.max(0, Math.min(count - 1, corePoint));
    if (index !== corePoint) { setCorePoint(index); return; }
    const width = viewport.current?.getBoundingClientRect().width || 0;
    const destination = -corePoint * width;
    targetIndex.current = corePoint;
    animation.current?.stop();
    window.clearTimeout(finishTimer.current);
    if (reduced || document.hidden) position.set(destination);
    else {
      animation.current = animate(position, destination, { duration: .55, ease: motionSettings.ease });
      finishTimer.current = window.setTimeout(() => { animation.current?.stop(); position.set(destination); }, 700);
    }
    return () => { animation.current?.stop(); window.clearTimeout(finishTimer.current); };
  }, [corePoint, count, position, reduced, setCorePoint]);
  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const intent = new WheelIntent();
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      const sideways = event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) * 1.05;
      if (!sideways) return; // Vertical wheel events keep the page's centered card snap.
      event.preventDefault(); event.stopPropagation();
      const delta = event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX;
      const direction = intent.consume(delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.getBoundingClientRect().width : 1), performance.now());
      if (!direction) return;
      const next = Math.max(0, Math.min(count - 1, targetIndex.current + direction));
      targetIndex.current = next;
      setCorePoint(next);
    };
    const resize = () => {
      animation.current?.stop(); window.clearTimeout(finishTimer.current);
      position.set(-targetIndex.current * element.getBoundingClientRect().width);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    element.addEventListener('wheel', wheel, { passive: false });
    return () => { observer.disconnect(); element.removeEventListener('wheel', wheel); };
  }, [count, position, setCorePoint]);
  const down = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    animation.current?.stop(); window.clearTimeout(finishTimer.current);
    dragging.current = { id: event.pointerId, x: event.clientX, y: event.clientY, start: position.get(), moved: false };
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const d = dragging.current;
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
  const up = (event: PointerEvent<HTMLDivElement>) => {
    const d = dragging.current;
    if (d.id !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const width = viewport.current?.getBoundingClientRect().width || 1;
    const dx = event.clientX - d.x;
    const next = d.moved && Math.abs(dx) > Math.min(60, width * .12)
      ? targetIndex.current + (dx < 0 ? 1 : -1) : Math.round(-position.get() / width);
    dragging.current.id = -1;
    choose(next);
    // React doesn't rerender when the selected index is unchanged, so settle the drag here too.
    animation.current?.stop();
    const destination = -Math.max(0, Math.min(count - 1, next)) * width;
    if (reduced || document.hidden) position.set(destination);
    else {
      animation.current = animate(position, destination, { duration: .55, ease: motionSettings.ease });
      finishTimer.current = window.setTimeout(() => { animation.current?.stop(); position.set(destination); }, 700);
    }
  };
  return <section className={`miaoda-core-design${grouped ? ' miaoda-core-execution' : ''}${delivery ? ' miaoda-core-delivery' : ''}${editing ? ' miaoda-core-editing' : ''}`} aria-label={`${editing ? '低门槛可视化修改' : delivery ? '阶段性交付' : execution ? '执行可见与用户可控' : '核心设计'}：${count}个案例横向展示`} data-point={corePoint + 1}>
    {!grouped && <img className="execution-fixed-background" src={asset('media/miaoda-core-background.svg')} alt="" aria-hidden="true"/>}
    {grouped ? <img className="execution-fixed-background" src={asset(background)} alt="" aria-hidden="true"/> : <p className="miaoda-section-number miaoda-card-title"><strong>05</strong><span>核心设计</span></p>}
    <div ref={viewport} className="core-design-viewport" tabIndex={0} role="region" aria-label={`横向滚动或拖拽切换${editing ? '可视化修改案例' : delivery ? '阶段交付案例' : execution ? '执行协作案例' : '核心设计点'}`} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
      onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); event.stopPropagation(); choose(targetIndex.current + (event.key === 'ArrowRight' ? 1 : -1)); } }}>
      <div ref={track} className="core-design-track">
        {points.map((point, index) => <article key={point.image} className="core-design-slide" aria-hidden={index !== corePoint}>
          <img src={asset(point.image)} alt={`设计点 ${index + 1}：${point.description}${point.video ? '' : '视频待补充。'}`} draggable={false}/>
          {point.video && <CaseVideo src={point.video} active={index === corePoint} edgeToEdge={!grouped && index === 2} displayRatio={!grouped && index === 2 ? 1908 / 1076 : 16 / 9} poster={!grouped && index === 2 ? 'media/miaoda-clarification-clean-poster.jpg' : undefined} title={grouped ? `${caseLabel} ${index + 1} · 演示视频` : `设计点 ${index + 1} · ${index === 0 ? '空输入框' : index === 1 ? '模板' : '问题澄清'}演示`}/> }
        </article>)}
      </div>
    </div>
    <nav className="core-design-controls" aria-label={editing ? '可视化修改案例分页' : delivery ? '阶段交付案例分页' : execution ? '执行协作案例分页' : '核心设计分页'}>
      <Magnetic><button type="button" className="core-design-arrow" disabled={corePoint === 0} aria-label={`上一个${caseLabel}`} onClick={() => choose(targetIndex.current - 1)}><ChevronLeft/></button></Magnetic>
      <div className="core-design-dots">{points.map((_, index) => <button type="button" key={index} aria-label={`切换到${caseLabel} ${index + 1}`} aria-current={index === corePoint} onClick={() => choose(index)}><span/></button>)}</div>
      <Magnetic><button type="button" className="core-design-arrow" disabled={corePoint === count - 1} aria-label={`下一个${caseLabel}`} onClick={() => choose(targetIndex.current + 1)}><ChevronRight/></button></Magnetic>
    </nav>
    <span className="core-design-status" aria-live="polite">{editing ? '可视化修改案例' : delivery ? '阶段交付案例' : execution ? '执行协作案例' : '核心设计'} {corePoint + 1} / {count}</span>
  </section>;
}
