import { useEffect, useState, type RefObject } from 'react';

export default function useMediaVisibility(ref: RefObject<HTMLElement | null>) {
  const [state, setState] = useState({ visible: false, near: false, sectionVisible: false, pageVisible: true });
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const section = element.closest('section') || element;
    const visible = new IntersectionObserver(([entry]) => setState(value => ({ ...value, visible: entry.isIntersecting && entry.intersectionRatio > 0 })), { threshold: [0, .05] });
    const nearby = new IntersectionObserver(([entry]) => setState(value => ({ ...value, near: entry.isIntersecting })), { rootMargin: '240px 0px', threshold: 0 });
    const sectionObserver = new IntersectionObserver(([entry]) => setState(value => ({ ...value, sectionVisible: entry.isIntersecting })), { threshold: 0 });
    const visibility = () => setState(value => ({ ...value, pageVisible: !document.hidden }));
    visible.observe(element);
    nearby.observe(section);
    sectionObserver.observe(section);
    document.addEventListener('visibilitychange', visibility);
    visibility();
    return () => { visible.disconnect(); nearby.disconnect(); sectionObserver.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, [ref]);
  return state;
}
