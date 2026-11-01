import { useEffect, useRef, useState, type ReactNode } from 'react';
import useViewport from '@/hooks/useViewport';

// Desktop passes children through unchanged. Mobile keeps one shared coordinate
// canvas for artwork + overlays, with native sideways scrolling instead of tiny text.
export default function ResponsiveDesignCanvas({ children, width = 620, height = 676 / 724 * width }: { children: ReactNode; width?: number; height?: number }) {
  const { mobile } = useViewport();
  const frame = useRef<HTMLDivElement>(null);
  const [moved, setMoved] = useState(false);
  useEffect(() => {
    const node = frame.current;
    if (!mobile || !node) return;
    const parent = node.closest('section');
    if (!parent) return;
    parent.classList.add('mobile-scroll-design-card');
    return () => parent.classList.remove('mobile-scroll-design-card');
  }, [mobile]);
  if (!mobile) return <>{children}</>;
  return <div className="mobile-design-scroll" ref={frame} onScroll={event => setMoved(event.currentTarget.scrollLeft > 8)}>
    <div className="mobile-design-canvas" style={{ width, height }}>{children}</div>
    <span className={`mobile-design-hint${moved ? ' has-scrolled' : ''}`}>左右滑动查看完整设计</span>
  </div>;
}
