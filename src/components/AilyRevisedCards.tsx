import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { asset } from '@/data/portfolio';
import { WheelIntent } from '@/hooks/wheelIntent';
import useViewport from '@/hooks/useViewport';
import layouts from '@/data/aily-revised-layout.json';
import AilyFrameworkCases from './AilyFrameworkCases';
import AilyTooltips from './AilyTooltips';
import { DeferredImage } from './DeferredImage';
import CaseVideo from './CaseVideo';
import { ailyArtwork, isAilyTooltip } from '@/data/aily-tooltip-utils';
import useViewportVideo from '@/hooks/useViewportVideo';
import './AilyRevisedCards.css';

const nodes = ['660-21610', '1970-38915', '664-47751', '4014-43460', '678-55865', '1987-38992', '2033-42161', '4026-43549', '664-50778', '2031-40420', '1991-39275', '688-31222', '1989-39051', '4121-51669', '4087-43771'];
const titles = ['核心问题', '设计思路', '统一智能体配置框架', 'Aily 中的三种委派', '自动化任务委派 - 表达意图', '自动化任务委派 - 运行调试', '自动化任务委派 - 可追踪', '主动工作 - 落地场景', '主动工作 - 状态感知', '主动工作 - 配置结构', '核心矛盾与收件箱定位', '收件箱设计思路', '移动端设计 - 任务', '移动端设计 - 团队', '写在最后的思考'];
const at = (x: number, y: number, width?: number, height?: number): CSSProperties => ({
  left: `${x / 724 * 100}%`, top: `${y / 676 * 100}%`,
  ...(width === undefined ? {} : { width: `${width / 724 * 100}%` }),
  ...(height === undefined ? {} : { height: `${height / 676 * 100}%` }),
});
// The closing card is only 360 tall (design 676): its copy keeps design px spacing and is centred vertically.
const REFLECT_HEIGHT = 360;
const REFLECT_SHIFT = 26;

function NativeCopy({ page }: { page: typeof layouts[number] }) {
  const baseHeight = page.page === 10 ? REFLECT_HEIGHT : 676;
  const yShift = page.page === 10 ? REFLECT_SHIFT : 0;
  const place = (x: number, y: number): CSSProperties => ({
    left: `${x / 724 * 100}%`, top: `${(y + yShift) / baseHeight * 100}%`,
  });
  return <>{page.texts.map((block, index) => {
    // Page 12 already ships its bubble shape inside the artwork, so its copy must stay native.
    if (page.page !== 12 && isAilyTooltip(block)) return null;
    const first = block.lines[0];
    // Keep each strategy number and label in one centered row, not on separate font baselines.
    if (page.page === 4 && block.font === 'DIN Condensed' && /^0[1-4]$/.test(first.text)) {
      const row = Number(first.text) - 1;
      const label = page.texts.find(item => item.size === 18 && item.lines[0].x === 106 && Math.abs(item.lines[0].y - first.y) < 10);
      return <div key={index} className="aily-strategy-heading" style={at(66, 189 + row * 88, 160 + row * 68, 68)}>
        <span className="aily-strategy-number" style={{ color: block.color }}>{first.text}</span>
        <strong className="aily-strategy-label">{label?.lines[0].text}</strong>
      </div>;
    }
    if (page.page === 4 && block.size === 18 && first.x === 106) return null;
    const baseline = block.font === 'DIN Condensed' ? .775 : .86;
    const font = block.font === 'DIN Condensed' ? "'DIN Condensed','Arial Narrow',sans-serif" : "'PingFang SC',sans-serif";
    const style: CSSProperties = {
      ...place(first.x, first.y - block.size * baseline),
      width: `${(724 - first.x - 48) / 724 * 100}%`,
      height: `${(block.lines[block.lines.length - 1].y - first.y + block.size * 1.5) / 724 * 100}cqw`,
      fontFamily: font, fontSize: `${block.size / 724 * 100}cqw`,
      fontWeight: block.bold ? 600 : 400, color: block.color, opacity: block.opacity,
    };
    if (page.page >= 6 && page.page < 7 && /^(表达意图|运行调试|可追踪)：/.test(first.text)) {
      return <ul key={index} className="aily-revised-copy aily-revised-unordered-list" style={{
        ...style, ...at(50, first.y - block.size * baseline, 624),
      }}>
        <li>{block.lines.map(line => line.text).join('')}</li>
      </ul>;
    }
    const content: ReactNode = block.lines.map((line, lineIndex) => <span key={lineIndex} style={{
      left: `${(line.x - first.x) / 724 * 100}cqw`,
      top: `${(line.y - first.y) / 724 * 100}cqw`,
    }}>{page.page === 10 && lineIndex > 0 && index === 1 ? `${lineIndex}. ` : ''}{line.text}</span>);
    return block.bold && block.size === 16
      ? <h2 key={index} className="aily-revised-copy" style={style}>{content}</h2>
      : <p key={index} className="aily-revised-copy" style={style}>{content}</p>;
  })}</>;
}

function PendingVideos({ page, top, controlsY, height = 391, message = '这里后续补上视频', textStyle }: { page: number; top: number; controlsY?: number; height?: number; message?: string; textStyle?: CSSProperties }) {
  const [selected, setSelected] = useState(0);
  const drag = useRef({ id: -1, x: 0, y: 0 });
  const lastWheel = useRef(0);
  const count = controlsY === undefined ? 1 : 4;
  const choose = (next: number) => setSelected(Math.max(0, Math.min(count - 1, next)));
  const end = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current.id !== event.pointerId) return;
    const dx = event.clientX - drag.current.x, dy = event.clientY - drag.current.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) choose(selected + (dx < 0 ? 1 : -1));
    drag.current.id = -1;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return <>
    <div className="aily-revised-video-slot" style={at(50, top, 624, height)} role="region" tabIndex={count > 1 ? 0 : -1}
      aria-label={`第${page}页，视频${selected + 1}待补充`} data-video-placeholder data-case={selected + 1}
      onPointerDown={event => { if (count === 1 || event.button !== 0) return; drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY }; }}
      onPointerMove={event => { const d = drag.current; if (d.id === event.pointerId && Math.abs(event.clientX - d.x) > 8 && Math.abs(event.clientX - d.x) > Math.abs(event.clientY - d.y)) event.currentTarget.setPointerCapture(event.pointerId); }}
      onPointerUp={end} onPointerCancel={event => { drag.current.id = -1; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
      onKeyDown={event => { if (count > 1 && ['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); event.stopPropagation(); choose(selected + (event.key === 'ArrowRight' ? 1 : -1)); } }}
      onWheel={event => { if (count === 1 || Math.abs(event.deltaX) <= Math.abs(event.deltaY) * 1.05) return; event.stopPropagation(); const now = performance.now(); if (Math.abs(event.deltaX) > 12 && now - lastWheel.current > 550) { lastWheel.current = now; choose(selected + Math.sign(event.deltaX)); } }}>
      <div className="aily-revised-pending-track" style={{ transform: `translateX(-${selected * 100}%)` }}>
        {Array.from({ length: count }, (_, i) => <div key={i} className="aily-revised-pending-panel" style={textStyle} aria-hidden={selected !== i}>{message}</div>)}
      </div>
    </div>
    {controlsY !== undefined && <nav className="aily-revised-pagination" aria-label={`第${page}页视频案例切换`} style={at(269, controlsY - 12, 186, 24)}>
      <button className="aily-revised-arrow prev" disabled={selected === 0} aria-label="上一个视频案例" onClick={() => choose(selected - 1)}><ChevronLeft/></button>
      <div className="aily-revised-dots">{Array.from({ length: count }, (_, i) => <button key={i} aria-label={`查看视频案例${i + 1}`} aria-current={i === selected} onClick={() => choose(i)}><span/></button>)}</div>
      <button className="aily-revised-arrow next" disabled={selected === count - 1} aria-label="下一个视频案例" onClick={() => choose(selected + 1)}><ChevronRight/></button>
      <span className="aily-revised-sr" aria-live="polite">案例 {selected + 1} / {count}，视频待补充</span>
    </nav>}
  </>;
}

type AilyLayout = typeof layouts[number];
const isMainCopy = (block: AilyLayout['texts'][number]) => block.lines[0].x === 50;
const orderedCopy = (page: AilyLayout) => [...page.texts].sort((a, b) => a.lines[0].y - b.lines[0].y);
function MobileCopy({ page }: { page: AilyLayout }) {
  return <div className="aily-mobile-copy">{orderedCopy(page).filter(isMainCopy).map((block, index) => {
    const text = block.lines.map(line => line.text).join('');
    if (block.bold) return <h2 key={index}>{text}</h2>;
    if (page.page === 10 && block.lines.length === 4 && block.lines[0].text.startsWith('后续')) return <div key={index}><p>{block.lines[0].text}</p><ol>{block.lines.slice(1).map(line => <li key={line.text}>{line.text}</li>)}</ol></div>;
    return <p key={index}>{text}</p>;
  })}</div>;
}
function MobileVisual({ page, top, bottom = 650, alt, active = true, prefetch = false, allCopy = false, artHeight = 676 }: { page: AilyLayout; top: number; bottom?: number; alt: string; active?: boolean; prefetch?: boolean; allCopy?: boolean; artHeight?: number }) {
  if (!page.art) return null;
  const labels = allCopy ? page.texts : page.texts.filter(block => !isMainCopy(block));
  const height = bottom - top;
  const local = { ...page, texts: labels.map(block => ({ ...block, lines: block.lines.map(line => ({ ...line, y: (line.y - top) * artHeight / height })) })) };
  return <div className="aily-mobile-visual" style={{ aspectRatio: `724 / ${height}` }}>
    <DeferredImage active={active} prefetch={prefetch} className="aily-mobile-visual-art" src={asset(ailyArtwork(page.art))} alt={alt} draggable={false} style={{ height: `${artHeight / height * 100}%`, top: `${-top / height * 100}%` }}/>
    {page.page === 11 && <div className="aily-delegation-base-bar" style={{ left: `${50 / 724 * 100}%`, top: `${(552 - top) / height * 100}%`, width: `${614 / 724 * 100}%`, height: `${34 / height * 100}%` }} aria-hidden="true"/>}
    {page.page === 12 && <DeferredImage className="aily-revised-native-shot" active={active} prefetch={prefetch}
      src={asset('media/aily-revised-12-shot.webp')} alt="" draggable={false}
      style={{ left: `${50 / 724 * 100}%`, top: `${(193 - top) / height * 100}%`, width: `${635 / 724 * 100}%`, height: `${483 / height * 100}%` }}/>}
    <NativeCopy page={local}/>
    <AilyTooltips art={page.art} active={active} top={top} height={height}/>
  </div>;
}
function MobileCardContent({ page, title }: { page: AilyLayout; title: string }) {
  if (page.page === 4) {
    const labels = page.texts.filter(block => block.size === 18);
    const descriptions = page.texts.filter(block => block.size === 16 && block.lines[0].x > 200);
    return <><MobileCopy page={page}/><ol className="aily-mobile-strategy">{labels.map((label, index) => <li key={label.lines[0].text}>
      <div><span>{String(index + 1).padStart(2, '0')}</span><strong>{label.lines[0].text}</strong></div>
      <p>{descriptions[index].lines.map(line => line.text).join('')}</p>
    </li>)}</ol></>;
  }
  if (page.page === 5) return <><MobileCopy page={page}/><div className="aily-mobile-pending"><PendingVideos page={5} top={134} controlsY={573}/></div></>;
  // The delegation map keeps its title block above the crop so the card copy is not repeated.
  if (page.page === 11) {
    const intro = page.texts.filter(block => block.lines[0].x === 50 && block.lines[0].y < 120);
    return <><MobileCopy page={{ ...page, texts: intro }}/><MobileVisual page={page} top={120} bottom={676} alt={title} allCopy/></>;
  }
  // The proactive-work opener keeps its title block above the crop, like the delegation map.
  if (page.page === 12) return <><MobileCopy page={{ ...page, texts: page.texts.filter(block => block.lines[0].x === 50) }}/><MobileVisual page={page} top={150} bottom={676} alt={title}/></>;
  // The mobile-design pages ship as one finished frame whose card height is 566, so the artwork keeps its own crop.
  if (page.page >= 13) return <MobileVisual page={page} top={0} bottom={566} artHeight={566} alt={title}/>;
  const visualTop = page.page === 3 ? 224 : page.page === 8 ? 250 : page.page === 9 ? 160 : 180;
  return <><MobileCopy page={page}/><MobileVisual page={page} top={visualTop} bottom={page.page === 7 ? 665 : 650} alt={title}/></>;
}

const automationCases = layouts.filter(page => page.page >= 6 && page.page < 7);
const automationLabels = ['表达意图', '运行调试', '可追踪'];
const visibleCards = layouts.map((page, index) => ({ page, node: nodes[index], title: titles[index] }))
  .filter(({ page }) => page.page !== 6.1 && page.page !== 6.2);

function AutomationTraceVideo({ active, mobile }: { active: boolean; mobile: boolean }) {
  return <div className={`aily-automation-trace-video${mobile ? ' is-mobile' : ' aily-revised-video-slot'}`} style={mobile ? undefined : at(50, 212, 624, 390)}>
    {active && <CaseVideo src="media/optimized/aily-automation-trace-borderless.mp4" poster="media/optimized/aily-automation-trace-borderless-poster.webp" active={active} title="自动化任务委派 · 可追踪" edgeToEdge displayRatio={1144 / 716}/>}
  </div>;
}

function AutomationCases() {
  const { mobile } = useViewport();
  const [selected, setSelected] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);
  const drag = useRef({ id: -1, x: 0, y: 0, axis: '' });
  const choose = (next: number) => { setDragOffset(0); setSelected(Math.max(0, Math.min(automationCases.length - 1, next))); };
  useEffect(() => {
    // Listen on the containing card: native copy sits above the visual viewport.
    const element = viewport.current?.closest('section');
    if (!element) return;
    const intent = new WheelIntent();
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.defaultPrevented) return;
      const sideways = event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) * 1.05;
      if (!sideways) return;
      const factor = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientWidth : 1;
      const delta = (event.shiftKey && event.deltaX === 0 ? event.deltaY : event.deltaX) * factor;
      if (!delta) return;
      event.preventDefault();
      event.stopPropagation();
      const direction = intent.consume(delta, performance.now());
      if (direction) {
        setDragOffset(0);
        setSelected(value => Math.max(0, Math.min(automationCases.length - 1, value + direction)));
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
    {mobile ? <MobileCopy page={{ ...automationCases[0], texts: automationCases[0].texts.filter(block => block.lines[0].y < 150) }}/> : <NativeCopy page={{ ...automationCases[0], texts: automationCases[0].texts.filter(block => block.lines[0].y < 150) }}/>}
    <div ref={viewport} className={`aily-automation-viewport${mobile ? ' aily-mobile-automation' : ''}`} tabIndex={0} role="region" aria-roledescription="轮播" aria-label="自动化任务委派：三个横向案例" data-active-case={selected + 1}
      onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); event.stopPropagation(); choose(selected + (event.key === 'ArrowRight' ? 1 : -1)); } }}
      onPointerDown={event => { if (event.button !== 0 || !event.isPrimary) return; drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, axis: '' }; }}
      onPointerMove={event => {
        const state = drag.current;
        if (state.id !== event.pointerId) return;
        const dx = event.clientX - state.x, dy = event.clientY - state.y;
        if (!state.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 8) state.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (state.axis !== 'x') return;
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
        const blocked = selected === 0 && dx > 0 || selected === automationCases.length - 1 && dx < 0;
        setDragOffset(blocked ? dx * .15 : dx);
      }}
      onPointerUp={event => finishDrag(event)} onPointerCancel={event => finishDrag(event, true)}>
      <div className={`aily-automation-track${dragOffset ? ' is-dragging' : ''}`} style={{ transform: `translateX(calc(-${selected * 100}% + ${dragOffset}px))` }}>
        {automationCases.map((page, index) => <div key={page.page} className="aily-automation-panel" role="group" aria-roledescription="案例" aria-label={`${index + 1} / 3：${automationLabels[index]}`} aria-hidden={selected !== index} inert={selected !== index} data-automation-case={index + 1} data-figma-node={nodes[index + 3]}>
          {mobile ? <>
            <ul className="aily-mobile-case-caption"><li>{page.texts.find(block => /^(表达意图|运行调试|可追踪)：/.test(block.lines[0].text))?.lines.map(line => line.text).join('')}</li></ul>
            {page.art ? <MobileVisual page={{ ...page, texts: page.texts.filter(block => block.size < 16) }} top={195} bottom={610} alt={automationLabels[index]} active={selected === index} prefetch={Math.abs(selected - index) === 1}/> : <AutomationTraceVideo active={selected === index} mobile/>}
          </> : <>
            {page.art && <DeferredImage active={selected === index} prefetch={Math.abs(selected - index) === 1} className="aily-automation-art" src={asset(ailyArtwork(page.art))} alt={automationLabels[index]} decoding="async" draggable={false}/>}
            <NativeCopy page={{ ...page, texts: page.texts.filter(block => block.lines[0].y >= 150) }}/>
            <AilyTooltips art={page.art} active={selected === index}/>
            {page.page === 6.2 && <AutomationTraceVideo active={selected === index} mobile={false}/>}
          </>}
        </div>)}
      </div>
    </div>
    <nav className="aily-revised-pagination aily-automation-pagination" aria-label="自动化案例切换" style={at(269, 626, 186, 24)}>
      <button className="aily-revised-arrow prev" disabled={selected === 0} aria-label="上一个自动化案例" onClick={() => choose(selected - 1)}><ChevronLeft/></button>
      <div className="aily-revised-dots">{automationCases.map((page, index) => <button key={page.page} aria-label={`查看自动化案例${index + 1}：${automationLabels[index]}`} aria-current={selected === index} onClick={() => choose(index)}><span/></button>)}</div>
      <button className="aily-revised-arrow next" disabled={selected === automationCases.length - 1} aria-label="下一个自动化案例" onClick={() => choose(selected + 1)}><ChevronRight/></button>
      <span className="aily-revised-sr" aria-live="polite">案例 {selected + 1} / 3：{automationLabels[selected]}</span>
    </nav>
  </>;
}

function MobileScreenVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const { source, shouldLoad } = useViewportVideo(ref, asset(src), true);
  return <div className="aily-mobile-screen" aria-hidden="true">
    <video ref={ref} src={source} muted autoPlay={shouldLoad} loop playsInline preload={shouldLoad ? 'auto' : 'none'}/>
  </div>;
}

export default function AilyRevisedCards() {
  const { mobile } = useViewport();
  return <>{visibleCards.map(({ page, node, title }, index) => <section key={page.page}
    className={`miaoda-project-hero aily-revised-card${page.page === 5 || page.page === 6 ? ' miaoda-core-design' : ''}${page.page >= 13 ? ' is-phone-outset' : ''}${page.page >= 13 ? ' is-card-566' : ''}${page.page === 10 ? ' is-card-reflect' : ''}`}
    data-figma-node={node} data-aily-page={index + 3} aria-label={`第${index + 3}页：${page.page === 6 ? '自动化任务委派' : title}`}>
    {page.page === 5 ? <AilyFrameworkCases/> : page.page === 6 ? <AutomationCases/> : mobile ? <MobileCardContent page={page} title={title}/> : <>
      {page.art && <DeferredImage className="aily-revised-art" src={asset(ailyArtwork(page.art))} alt={page.page >= 13 ? (page.page === 13 ? '移动端设计：PC 首页的任务与目标，在手机上继续推进' : '移动端设计：团队成员关系与伙伴能力界面') : page.page === 3 ? '三种伙伴档案与配置界面' : page.page === 11 ? 'Aily 中的三种委派：发起一次任务、自动化任务、主动工作，委托深度从目标到规则再到边界递增' : page.page === 12 ? '主动工作的落地场景：个人助手主动卡与每日前瞻、团队助手到点提醒，以及条件成立时带着依据出现' : page.page >= 7 && page.page < 8 ? title : page.page === 8 ? '收件箱事件示例与分类关系' : '收件箱改版前后界面与接收设置'} loading="lazy" decoding="async" draggable={false}/>}
      {page.page === 11 && <div className="aily-delegation-base-bar" style={at(50, 552, 614, 34)} aria-hidden="true"/>}
      {page.page === 12 && <DeferredImage className="aily-revised-native-shot" src={asset('media/aily-revised-12-shot.webp')} alt="" loading="lazy" decoding="async" draggable={false} style={at(50, 193, 635, 483)}/>}
      {page.page === 4 && [182, 242, 310, 378].map((width, i) => <div key={i} className="aily-revised-strategy-pill" style={at(50, 189 + i * 88, width, 68)} aria-hidden="true"/>)}
      <NativeCopy page={page}/>
      <AilyTooltips art={page.art}/>
    </>}
    {page.page >= 13 && <DeferredImage className="aily-mobile-phone" src={asset(page.page === 13 ? 'media/aily-mobile-phone.webp' : 'media/aily-mobile-team-phone.webp')} alt="" loading="lazy" decoding="async" draggable={false}/>}
    {page.page === 13 && <MobileScreenVideo src="media/aily-mobile-task-screen-v2.mp4"/>}
    {page.page === 14 && <MobileScreenVideo src="media/aily-mobile-team-screen.mp4"/>}
  </section>)}</>;
}
