import { Children, cloneElement, isValidElement, useEffect, useRef, useState, type ReactNode } from 'react';
import useViewport from '@/hooks/useViewport';

const flatMobileArt = new Set([
  'miaoda-core-collaboration.svg', 'miaoda-beauty-evolution.svg',
  'miaoda-beauty-stage-01-perspective-v3.svg', 'miaoda-beauty-stage-02.svg',
  'miaoda-beauty-stage-03.svg', 'miaoda-beauty-stage-04.svg', 'miaoda-beauty-stage-05.svg',
]);
function mobileChildren(children: ReactNode): ReactNode {
  return Children.map(children, child => {
    if (!isValidElement<{ src?: string; children?: ReactNode }>(child)) return child;
    const src = child.props.src;
    if (typeof src === 'string' && flatMobileArt.has(src.split('/').pop() || '')) {
      return cloneElement(child, { src: src.replace(/media\/([^/]+)$/, 'media/mobile/$1') });
    }
    if (child.props.children) return cloneElement(child, { children: mobileChildren(child.props.children) });
    return child;
  });
}

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
  return <div className="mobile-design-frame">
    <div className="mobile-design-scroll" ref={frame} onScroll={event => setMoved(event.currentTarget.scrollLeft > 8)}>
      <div className="mobile-design-canvas" style={{ width, height }}>{mobileChildren(children)}</div>
    </div>
    <span className={`mobile-design-hint${moved ? ' has-scrolled' : ''}`}>左右滑动查看完整设计</span>
  </div>;
}
