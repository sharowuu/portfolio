import { useEffect, useRef, useState } from 'react';
import CaseVideo from './CaseVideo';
import './AilyProactiveWork.css';

export default function AilyProactiveWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const update = () => setActive(section.dataset.snapActive === 'true');
    update();
    const observer = new MutationObserver(update);
    observer.observe(section, { attributes: true, attributeFilter: ['data-snap-active'] });
    return () => observer.disconnect();
  }, []);
  return <section ref={sectionRef} className="miaoda-project-hero aily-proactive-work" aria-label="核心设计 02：主动工作">
    <div className="aily-proactive-copy">
      <h2>主动工作</h2>
      <p>持续工作不只有预设任务。我也设计了主动工作的配置体验，让伙伴在理解工作目标、协作关系和关注点后，在合适时机提供帮助。用户不必逐件交代。但仍能调整它关注什么、主动到什么程度，以及何时推送，让主动帮助保留清晰的边界。</p>
    </div>
    <div className="aily-proactive-media"><CaseVideo src="media/aily-proactive-work.mp4" active={active} title="Aily 核心设计 02 · 主动工作演示"/></div>
  </section>;
}
