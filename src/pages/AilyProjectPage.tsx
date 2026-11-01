import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { asset, motionSettings } from '@/data/portfolio';
import useCardSnap from '@/hooks/useCardSnap';
import AilyRevisedCards from '@/components/AilyRevisedCards';

export default function AilyProjectPage() {
  const mainRef = useRef<HTMLElement>(null);
  useCardSnap(mainRef, '.miaoda-project-sections > section', 'aily');
  return <main ref={mainRef} className="miaoda-project-page aily-project-page" aria-label="Aily 工作伙伴项目详情">
    <div className="miaoda-project-sections">
      <motion.section className="miaoda-project-hero aily-project-hero" aria-label="Aily 工作伙伴界面展示" layoutId="project-project-3" initial={false} transition={{ layout: { duration: 1.2, ease: motionSettings.ease } }}>
        <Image src={asset('media/aily-hero.png')} alt="Aily 工作伙伴：一站式 Agents 服务，支持办公、编程、新工作任务、自动化和市场等协同场景" loading="eager"/>
      </motion.section>
      <motion.section className="miaoda-project-hero aily-background-card" aria-label="Aily 项目背景与我的范围" initial={false}>
        <div className="aily-background-content">
          <section className="aily-background-block" aria-labelledby="aily-background-title">
            <h2 id="aily-background-title">项目背景</h2>
            <p>{['当 AI 从即时问答走向持续执行，用户面对的不再是一次回答是否满意，而是能否把一项', '长期工作放心交给 Agent：它是否理解目标、按什么规则执行、能否访问正确的信息、', '何时需要人确认、出错后能否追溯和接管。Aily 工作伙伴面向企业办公场景，将飞书中的', '轻量 Bot 延伸为可持续协作的工作伙伴。'].map(line => <span className="aily-background-line" key={line}>{line}</span>)}</p>
            <p className="aily-background-key-question">本案例聚焦的核心问题是：<strong>如何让 Agent 持续工作，同时让人掌握委托规则与关键节点</strong></p>
          </section>
          <section className="aily-background-block" aria-labelledby="aily-scope-title">
            <h2 id="aily-scope-title">我的范围</h2>
            <p>{['围绕这一问题，我主导了自动化任务、伙伴管理、个人伙伴详情页框架与详细配置、主动', '工作及 Inbox 的体验设计。设计重点是帮助用户理解执行者、明确工作规则，并在需要', '判断时重新参与。'].map(line => <span className="aily-background-line" key={line}>{line}</span>)}<span className="aily-background-line">以下按「<strong>建立协作预期 — 委托持续工作 — 在关键节点参与</strong>」的体验脉络展开。</span></p>
          </section>
        </div>
      </motion.section>
      <AilyRevisedCards/>
    </div>
  </main>;
}
