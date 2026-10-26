import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { asset, motionSettings } from '@/data/portfolio';
import useCardSnap from '@/hooks/useCardSnap';
import AilyCoreCases from '@/components/AilyCoreCases';
import AilyBeforeAfter from '@/components/AilyBeforeAfter';
import AilyCoreTwo from '@/components/AilyCoreTwo';
import AilyProactiveWork from '@/components/AilyProactiveWork';
import AilyInboxFinal from '@/components/AilyInboxFinal';

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
            <p>随着 AI 从即时问答走向任务执行，人与 AI 的协作开始超出单次对话：一项工作需要持续迭代，多项工作需要并行管理，不同 Agent 的能力与工作方式也需要被理解和配置。Aily 从个人助手转向企业办公场景的 AI 工作台，旨在将飞书中的轻量 Bot 延伸为可持续的工作协作。</p>
          </section>
          <section className="aily-background-block" aria-labelledby="aily-scope-title">
            <h2 id="aily-scope-title">我的范围</h2>
            <p>当 AI 从回答走向持续执行工作，设计的重点也随之变化：不只是帮助用户发起一次请求，而是让他们理解执行者、明确工作规则，并在需要判断时重新参与。围绕这一问题，我主导了自动化任务、伙伴管理、个人伙伴详情页框架与详细配置，主动工作以及 Inbox 的体验设计。以下按“建立协作预期—委托持续工作—在关键节点参与”的体验关系展开。</p>
          </section>
        </div>
      </motion.section>
      <motion.section className="miaoda-project-hero aily-core-card" aria-label="核心设计 01：先看懂伙伴，再决定如何委托" initial={false}>
        <div className="aily-core-copy">
          <h2>核心问题</h2>
          <p>飞书中的伙伴类型不断增加，包括「团队伙伴」、「三方伙伴」、「专家」和「专属伙伴」等，能力相近，却各有所长。随着能力持续丰富，单纯叠加入口已难以清晰组织伙伴的能力、工作方式与管理配置。因此，首要任务是建立统一的伙伴管理框架：让用户看懂伙伴，让配置者高效调整伙伴。</p>
        </div>
        <div className="aily-core-visual" aria-label="个人伙伴与团队伙伴界面示例">
          <span className="aily-core-shadow aily-core-shadow-one" aria-hidden="true"/>
          <span className="aily-core-shadow aily-core-shadow-two" aria-hidden="true"/>
          <img className="aily-core-screen aily-core-screen-one" src={asset('media/aily-core-partner-1.png')} alt="个人伙伴 Lydia 的档案和配置界面"/>
          <img className="aily-core-screen aily-core-screen-two" src={asset('media/aily-core-partner-2.png')} alt="团队伙伴小鹿听你说的档案和事项界面"/>
        </div>
      </motion.section>
      <AilyCoreCases/>
      <AilyBeforeAfter/>
      <AilyCoreTwo/>
      <AilyProactiveWork/>
      <AilyInboxFinal/>
    </div>
  </main>;
}
