import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { asset, motionSettings } from '@/data/portfolio';
import useCardSnap from '@/hooks/useCardSnap';
import AilyRevisedCards from '@/components/AilyRevisedCards';

const AILY_BACKGROUND_LINES = [
  '当 AI 从即时问答走向持续执行，用户面对的不再是一次回答是否满意，而是能否把一项',
  '长期工作放心交给 Agent：它是否理解目标、按什么规则执行、能否访问正确的信息、',
  '何时需要人确认、出错后能否追溯和接管。Aily 工作伙伴面向企业办公场景，将飞书中的',
  '轻量 Bot 延伸为可持续协作的工作伙伴。'
];

const AILY_SCOPE_LINES = [
  '围绕这一问题，我主导了自动化任务、主动工作、伙伴管理和配置、个人伙伴详情页框架',
  '及 Inbox 的体验设计。设计重点是帮助用户理解执行者、明确 agent 工作规则与边界，',
  '并在需要判断时重新参与。'
];

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
          <h2 className="aily-background-title" id="aily-background-title">项目背景</h2>
          <div className="aily-background-timeline">
            <Image src={asset('media/aily-background-timeline.webp')} alt="Aily 产品重心演进：2023 角色 + 飞书 bot，建立员工与 AI 的协作关系；2024 RAG 知识库 + Workflow，企业落地确定性场景；2025 工作助手 + 任务模式，企业 agent 解决复杂问题" width={630} height={114} loading="lazy"/>
          </div>
          <p className="aily-background-text">{AILY_BACKGROUND_LINES.map(line => <span className="aily-background-line" key={line}>{line}</span>)}</p>
          <h2 className="aily-background-title is-scope" id="aily-scope-title">我的范围</h2>
          <p className="aily-background-text is-scope">{AILY_SCOPE_LINES.map(line => <span className="aily-background-line" key={line}>{line}</span>)}</p>
        </div>
      </motion.section>
      <AilyRevisedCards/>
    </div>
  </main>;
}
