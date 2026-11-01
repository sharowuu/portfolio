import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ailyTooltipSets as sets, type AilyTooltip as Tooltip } from '@/data/aily-tooltip-utils';
import './AilyTooltips.css';

function TooltipItem({ tooltip, active, index, top, height, flow }: {
  tooltip: Tooltip; active: boolean; index: number; top: number; height: number; flow: boolean;
}) {
  const anchor = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const element = anchor.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting && entry.intersectionRatio >= .6);
    }, { threshold: [0, .6], rootMargin: '0px 0px -8% 0px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const visible = active && inView;
  const style: CSSProperties = {
    '--aily-tooltip-delay': `${220 + index * 100}ms`,
    ...(flow ? {} : {
      left: `${tooltip.x / 724 * 100}%`,
      top: `${(tooltip.y - top) / height * 100}%`,
      width: `${tooltip.width / 724 * 100}%`,
      height: `${tooltip.height / height * 100}%`,
    }),
  } as CSSProperties;
  return <div ref={anchor} className={flow ? 'aily-framework-annotation aily-tooltip-flow' : 'aily-tooltip-anchor'}
    data-aily-tooltip={tooltip.text} data-visible={visible} aria-hidden={!visible} style={style}>
    <svg className={`aily-tooltip-dot${flow ? ' aily-tooltip-flow-dot' : ''}`} viewBox={flow ? `${tooltip.dotX - 4} ${tooltip.dotY - 4} 8 8` : tooltip.viewBox} aria-hidden="true">
      <circle cx={tooltip.dotX} cy={tooltip.dotY} r="3" fill="none" stroke="var(--aily-tooltip-ink)" strokeOpacity=".3" strokeWidth=".5"/>
      <circle cx={tooltip.dotX} cy={tooltip.dotY} r="2" fill="var(--aily-tooltip-ink)" fillOpacity=".3"/>
    </svg>
    <div className="aily-tooltip-reveal">
      {!flow && <svg className="aily-tooltip-shape" viewBox={tooltip.viewBox} aria-hidden="true">
        <path d={tooltip.path} fill="var(--aily-tooltip-surface)"/>
      </svg>}
      <span className="aily-tooltip-text" style={flow ? undefined : {
        left: `${tooltip.textX / tooltip.width * 100}%`,
        top: `${tooltip.textY / tooltip.height * 100}%`,
        fontSize: `${12 / 724 * 100}cqw`,
      }}>{tooltip.text}</span>
    </div>
  </div>;
}

export default function AilyTooltips({ art, active = true, top = 0, height = 676, flow = false }: {
  art: string | null; active?: boolean; top?: number; height?: number; flow?: boolean;
}) {
  const set = art ? sets[art] : undefined;
  if (!set) return null;
  return <>{set.tooltips.map((tooltip, index) => <TooltipItem key={tooltip.text} tooltip={tooltip}
    active={active} index={index} top={top} height={height} flow={flow}/>)}</>;
}
