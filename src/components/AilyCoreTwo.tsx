import { useEffect, useRef, useState } from 'react';
import CaseVideo from './CaseVideo';
import './AilyCoreTwo.css';

export default function AilyCoreTwo() {
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
  return <section ref={sectionRef} className="miaoda-project-hero aily-core-two" aria-label="核心设计 02：把一次请求变成可管理的持续工作">
    <div className="aily-core-two-problem">
      <h2>核心问题</h2>
      <p>自然语言便于表达工作意图，但持续运行需要可核对的执行规则。既不能只给用户一张技术配置表，也不能让一句模糊承诺代替长期任务管理。</p>
    </div>
    <div className="aily-core-two-principle">
      <h2>自动化任务</h2>
      <p>自然语言描述任务的自由度，用结构化配置表达时间、条件、执行对象和投递规则<br/>自动化只承载规则，由任务承载一次具体工作</p>
    </div>
    <div className="aily-core-two-media"><CaseVideo src="media/aily-automation.mp4" active={active} title="Aily 核心设计 02 · 自动化任务演示"/></div>
  </section>;
}
