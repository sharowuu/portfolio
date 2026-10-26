import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { animate, motion, useReducedMotion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { asset, motionSettings } from '@/data/portfolio';

export default function BeautyStageTwoCard() {
  const strip = useRef<HTMLDivElement>(null);
  const drag = useRef({ id: -1, startX: 0, startY: 0, startScroll: 0, active: false });
  const animation = useRef<ReturnType<typeof animate> | null>(null);
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

  const down = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const node = event.currentTarget;
    animation.current?.stop();
    node.dataset.pointerFocus = 'true';
    node.focus({ preventScroll: true });
    drag.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, startScroll: node.scrollLeft, active: false };
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (state.id !== event.pointerId) return;
    const dx = event.clientX - state.startX, dy = event.clientY - state.startY;
    if (!state.active) {
      if (Math.abs(dx) < 4 || Math.abs(dx) <= Math.abs(dy)) return;
      state.active = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    event.preventDefault();
    event.currentTarget.scrollLeft = state.startScroll - dx;
  };
  const up = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current.id !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    drag.current.id = -1;
    drag.current.active = false;
    setDragging(false);
  };
  const key = (event: KeyboardEvent<HTMLDivElement>) => {
    const node = event.currentTarget, max = node.scrollWidth - node.clientWidth;
    delete node.dataset.pointerFocus;
    let destination: number;
    if (event.key === 'ArrowRight') destination = Math.min(max, node.scrollLeft + node.clientWidth * .7);
    else if (event.key === 'ArrowLeft') destination = Math.max(0, node.scrollLeft - node.clientWidth * .7);
    else if (event.key === 'Home') destination = 0;
    else if (event.key === 'End') destination = max;
    else return;
    event.preventDefault(); event.stopPropagation();
    animation.current?.stop();
    if (reduced) node.scrollLeft = destination;
    else animation.current = animate(node.scrollLeft, destination, {
      duration: .55, ease: motionSettings.ease,
      onUpdate: value => { node.scrollLeft = value; },
    });
  };
  return <motion.section className="miaoda-project-hero beauty-stage-02-card" aria-label="02 Prompt 探索与 Shadcn 切换" initial={false}>
    <Image className="beauty-stage-02-background" src={asset('media/miaoda-beauty-stage-02.svg')} alt="02 Prompt 探索与 Shadcn 切换，2025.07-08。挑战与做法：建立视觉评测维度，用 Prompt 把好看内置进默认链路；切换 Shadcn，配套页面 Layout、内置主题及区块级 Blocks 素材。" loading="eager"/>
    <div ref={strip} className={`beauty-evaluation-strip${dragging ? ' is-dragging' : ''}`} tabIndex={0} role="region" aria-label="视觉评测维度演进长图，可左右拖拽、横向滑动或使用左右方向键查看全部"
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onLostPointerCapture={up} onKeyDown={key}
      onBlur={event => { delete event.currentTarget.dataset.pointerFocus; }}
      onScroll={event => { const n = event.currentTarget; setProgress(Math.max(0, Math.min(1, n.scrollLeft / Math.max(1, n.scrollWidth - n.clientWidth)))); }}>
      <Image src={asset('media/miaoda-beauty-evaluation-full.svg')} alt="视觉评测维度演进完整长图：初期信息与布局30%、视觉与版式30%、一致性与可维护20%、适配与可用性20%；随后信息架构与首屏动线、视觉系统与风格一致、版式结构与空间节奏按0/1/2三档判定；再发展为布局层级、视觉一致性、字体排版、完成度与响应式、间距与对齐、色彩对比和渲染缺陷七维评分，每维5分。" draggable={false} loading="eager"/>
    </div>
    <div className="beauty-evaluation-fade beauty-evaluation-fade-left" data-visible={progress > .001} aria-hidden="true"/>
    <div className="beauty-evaluation-fade beauty-evaluation-fade-right" data-visible={progress < .999} aria-hidden="true"/>
  </motion.section>;
}
