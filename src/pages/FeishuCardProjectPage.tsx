import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { asset, motionSettings } from '@/data/portfolio';
import useCardSnap from '@/hooks/useCardSnap';
import CaseVideo from '@/components/CaseVideo';

export default function FeishuCardProjectPage() {
  const mainRef = useRef<HTMLElement>(null);
  useCardSnap(mainRef, '.feishu-card-project-sections > section', 'feishu-card');

  return (
    <main ref={mainRef} className="feishu-card-project-page" aria-label="飞书卡片项目详情">
      <div className="feishu-card-project-sections">
        <motion.section
          className="feishu-card-visual"
          layoutId="project-project-4"
          initial={false}
          transition={{ layout: { duration: 1.2, ease: motionSettings.ease } }}
          aria-label="飞书卡片项目视频占位"
        >
          <Image src={asset('media/feishu-card-visual.png')} alt="飞书卡片项目视频容器" loading="eager" />
          <div className="feishu-card-editor-video">
            <CaseVideo src="media/feishu-card-editor.mp4" active title="飞书卡片编辑器" displayRatio={16 / 10} />
          </div>
        </motion.section>
        <motion.section
          className="feishu-card-visual feishu-card-overview"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: .2 }}
          transition={{ duration: .55, ease: motionSettings.ease }}
          aria-label="飞书卡片体系建设工作概述"
        >
          <div className="feishu-card-overview-content">
            <p className="feishu-card-overview-lead">从 2022 年开始，我持续推进飞书卡片搭建工具的改版与规范建设，建立涵盖 100+ 组件生产规则的卡片搭建规范。进一步融合消息卡片与 URL 预览卡片的生产体验，将组件在编辑器中的配置方式，与其在飞书桌面端、移动端的展示和交互规则统一起来</p>
            <p className="feishu-card-overview-kicker">主要包含四类工作：</p>
            <section>
              <h2><strong>工具重构：</strong>统一卡片生产体验</h2>
              <p>调整搭建工具框架，兼容消息卡片与 URL 卡片的能力差异，设计组件配置、变量绑定、多语言及全局配置等体验，让不同卡片场景在同一工具中完成搭建。</p>
            </section>
            <section>
              <h2><strong>规范建设：</strong>打通生产侧与消费侧规则</h2>
              <p>不仅定义组件“怎么配置”，也关注“最终怎么展示和使用”；结合 Aurora Design，与主端共建卡片基础结构、尺寸自适应、全局样式及交互规则，兼顾桌面端和移动端体验。</p>
            </section>
            <section>
              <h2><strong>资产沉淀：</strong>把设计经验转化为可复用能力</h2>
              <p>独立撰写组件能力文档，发起组件白皮书专项，并推进 Figma 组件库和卡片模板建设，让业务接入不再只依赖一对一咨询</p>
            </section>
            <section>
              <h2><strong>业务落地：</strong>从场景需求中反哺通用能力</h2>
              <p>支持 MyAI 日历、图表、表格、交互容器等场景，直接使用 Card DSL 搭建和验证卡片，与业务、研发共同调试还原效果，将具体需求抽象为通用组件与规则。</p>
            </section>
          </div>
        </motion.section>
        <p className="feishu-card-progress-note">更多细节持续完善中...</p>
      </div>
    </main>
  );
}
