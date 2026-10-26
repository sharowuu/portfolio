import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { asset, motionSettings } from '@/data/portfolio';
import useCardSnap from '@/hooks/useCardSnap';
import BeautyStageTwoCard from '@/components/BeautyStageTwoCard';
import CaseVideo from '@/components/CaseVideo';

export default function BeautyProjectPage() {
  const mainRef = useRef<HTMLElement>(null);
  useCardSnap(mainRef, '.miaoda-project-sections > section', 'beauty');
  return <main ref={mainRef} className="miaoda-project-page beauty-project-page" aria-label="妙搭产物默认好看项目详情">
    <div className="miaoda-project-sections">
      <motion.section className="miaoda-project-hero" aria-label="妙搭产物默认好看界面展示" layoutId="project-project-2" initial={false} transition={{ layout: { duration: 1.2, ease: motionSettings.ease } }}>
        <Image src={asset('media/miaoda-beauty-hero.svg')} alt="Figma 原稿中的多种妙搭生成界面展示" loading="eager"/>
      </motion.section>
      <motion.section className="miaoda-project-hero beauty-evolution-card" aria-label="八个阶段的策略演进" initial={false}>
        <Image src={asset('media/miaoda-beauty-evolution.svg')} alt="八个阶段的策略演进。2025.07：组件统一与主题；2025.07-08：prompt 探索与 shadcn 切换；2025.10-11：官网 block 素材；2025.11-2026.01：把抽象审美翻译成模型可执行的设计规则；2026.03-04：Design Guideline 拆 Skill，精细化治理风格；2026.05-06：灵感升级 jspage；2026.07：妙搭接入 Aily；2026.08-10：多模型分工、视觉检查与体验工程持续优化。"/>
      </motion.section>
      <motion.section className="miaoda-project-hero beauty-stage-01-card" aria-label="01 组件统一与主题兜底" initial={false}>
        <Image src={asset('media/miaoda-beauty-stage-01-perspective-v3.svg')} alt="01 组件统一与主题兜底，2025.07。挑战：同时具备几套设计系统，默认产物缺少统一视觉基线；首要任务是统一组件、素材和 PE，而不是立即追求高创意。做法与效果：下掉 aily-ui，统一收敛到 antd；刷新 RAG 为 antd 版本；清理 code agent 与 page function 的 PE；做出基本可用的主题第一版。原稿倾斜叠放主题界面与右侧单张示例。"/>
      </motion.section>
      <BeautyStageTwoCard/>
      <motion.section className="miaoda-project-hero beauty-stage-03-card" aria-label="03 提供官网 Blocks 素材" initial={false}>
        <Image src={asset('media/miaoda-beauty-stage-03.svg')} alt="03 提供官网 Blocks 素材，2025.10-11。围绕官网主题、装饰、图表、布局与语义化色板问题，收集并按 Hero、Feature、Testimonial、CTA、Pricing 分类官网 Blocks 素材。"/>
        <div className="beauty-stage-03-video">
          <CaseVideo src="media/miaoda-beauty-stage-03.mp4" active title="官网 Hero 区块优化演示" edgeToEdge displayRatio={113 / 67}/>
        </div>
      </motion.section>
      <motion.section className="miaoda-project-hero beauty-stage-04-card" aria-label="04 PE 调优" initial={false}>
        <Image src={asset('media/miaoda-beauty-stage-04.svg')} alt="04 PE 调优：把抽象审美翻译成模型可执行的设计规则，2025.11-2026.01。以 Visual DNA、色彩心理、CSS 与 Tailwind 变量，以及更具象的生图、布局和微交互描述替代空泛形容词。"/>
        <div className="beauty-stage-04-video">
          <CaseVideo src="media/miaoda-beauty-deep-space.mp4" active title="深空风格效果演示" edgeToEdge displayRatio={1222 / 720}/>
        </div>
      </motion.section>
      <motion.section className="miaoda-project-hero beauty-stage-05-card beauty-stage-tall-card" data-snap-native="true" aria-label="05 Design Guideline 拆 Skill" initial={false}>
        <Image src={asset('media/miaoda-beauty-stage-05.svg')} alt="05 2 万 token Design Guideline 拆 Skill，精细化治理风格，2026.03-04。把全局底线放入 AGENTS.md、场景细则放入规范型 Skill，并治理图表配色、渐变、信息密度、卡片层级及生图触发。"/>
      </motion.section>
    </div>
  </main>;
}
