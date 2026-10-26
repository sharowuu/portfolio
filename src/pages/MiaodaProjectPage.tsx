import { useRef, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { asset, motionSettings } from '@/data/portfolio';
import useCardSnap from '@/hooks/useCardSnap';
import CoreDesignSection from '@/components/CoreDesignSection';

// Original Figma callout tip, shared by all three journey insights.
function JourneyInsightArrow() {
  return <svg className="journey-insight-arrow" viewBox="50 448 16 6" aria-hidden="true" focusable="false">
    <path d="M50 453.995C51.6962 453.995 53.3114 453.203 54.4383 451.818L57.2526 448.361C57.6504 447.872 58.3496 447.872 58.7474 448.361L61.5617 451.818C62.6886 453.203 64.3038 453.995 66 453.995Z" fill="white" />
  </svg>;
}

export default function MiaodaProjectPage() {
  const mainRef=useRef<HTMLElement>(null);
  useCardSnap(mainRef, '.miaoda-project-sections > section', 'miaoda');
  const reducedMotion=useReducedMotion();
  const insightVariants: Variants = {
    hidden: {
      opacity: 0,
      y: reducedMotion ? 0 : 16,
      transition: { duration: reducedMotion ? .1 : .28, ease: motionSettings.easeOut, delay: 0 },
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? .1 : .5, ease: motionSettings.ease, delay: reducedMotion ? 0 : index * .06 },
    }),
  };
  const journeyRef=useRef<HTMLDivElement>(null);
  const [journeyHover,setJourneyHover]=useState(false);
  const [journeyDrag,setJourneyDrag]=useState({active:false,startX:0,startScroll:0});
  const [journeyScroll,setJourneyScroll]=useState(0);
  const [journeyEdges,setJourneyEdges]=useState({left:false,right:true});
  const pointerDown=(event:React.PointerEvent<HTMLDivElement>)=>{const node=journeyRef.current;if(!node)return;node.setPointerCapture(event.pointerId);setJourneyDrag({active:true,startX:event.clientX,startScroll:node.scrollLeft})};
  const pointerMove=(event:React.PointerEvent<HTMLDivElement>)=>{if(!journeyDrag.active||!journeyRef.current)return;journeyRef.current.scrollLeft=journeyDrag.startScroll-(event.clientX-journeyDrag.startX)};
  const pointerUp=(event:React.PointerEvent<HTMLDivElement>)=>{if(journeyRef.current?.hasPointerCapture(event.pointerId))journeyRef.current.releasePointerCapture(event.pointerId);setJourneyDrag(v=>({...v,active:false}))};
  const journeyKey=(event:React.KeyboardEvent<HTMLDivElement>)=>{const node=journeyRef.current;if(!node)return;if(event.key==='ArrowRight'){event.preventDefault();node.scrollBy({left:160,behavior:'smooth'})}else if(event.key==='ArrowLeft'){event.preventDefault();node.scrollBy({left:-160,behavior:'smooth'})}};
  return <main ref={mainRef} className="miaoda-project-page" aria-label="飞书妙搭项目详情">
    <div className="miaoda-project-sections">
      <motion.section className="miaoda-project-hero" aria-label="飞书妙搭界面展示" layoutId="project-project-1" initial={false} transition={{ layout: { duration: 1.2, ease: motionSettings.ease } }}>
        <img src={asset('media/miaoda-hero.svg')} alt="Figma 原稿中的飞书妙搭首页界面" />
      </motion.section>
      <motion.section className="miaoda-positioning miaoda-positioning-revised" aria-label="项目简介与定位、我负责的范围及主要贡献" initial={false}>
        <img src={asset('media/miaoda-project-introduction-v2.svg')} alt="AI 驱动的全栈应用开发平台。三种模式渐进覆盖：灵感（原型）→应用（全栈）→专家（复杂系统）。为业务部门搭建围绕已有数据和飞书协同、有权限有流转的轻业务系统。我负责的范围：应用模式核心链路的体验设计。主要贡献：定义应用模式端到端体验框架；重构需求确认与开发过程的信息表达；设计应用预览、测试、修改和发布的闭环；调试 AI 生成产物的默认效果。"/>
      </motion.section>
      <motion.section className="miaoda-user-analysis" aria-label="用户分析：业务人员从零到六十，专业研发从六十到一百" initial={false} transition={{ duration: 1.2, ease: motionSettings.ease }}>
        <p className="miaoda-section-number miaoda-card-title"><strong>02</strong><span>目标用户</span></p>
        <img src={asset('media/miaoda-user-analysis.svg')} alt="用户分析：核心人群是业务人员和编程小白，延伸人群是专业开发者" />
      </motion.section>
      <motion.section className="miaoda-user-journey" aria-label="用户旅程，可横向拖拽浏览完整内容" initial={false} transition={{ duration: 1.2, ease: motionSettings.ease }} onMouseEnter={()=>setJourneyHover(true)} onMouseLeave={()=>setJourneyHover(false)}>
        <p className="miaoda-section-number miaoda-card-title"><strong>03</strong><span>用户旅程</span></p>
        <div ref={journeyRef} className={`miaoda-journey-track ${journeyDrag.active?'is-dragging':''}`} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onKeyDown={journeyKey} onScroll={event=>{const node=event.currentTarget;setJourneyScroll(node.scrollLeft);setJourneyEdges({left:node.scrollLeft>2,right:node.scrollLeft<node.scrollWidth-node.clientWidth-2})}} tabIndex={0}>
          <div className="miaoda-journey-artwork">
            <img src={asset('media/miaoda-user-journey.svg')} alt="用户旅程各阶段说明" draggable={false}/>
            <img className="miaoda-journey-curve" src={asset('media/miaoda-journey-curve.svg')} alt="从需求触发到使用运营的用户想法、旅程曲线和情绪节点" draggable={false}/>
          </div>
        </div>
        <span className={`miaoda-journey-edge miaoda-journey-edge-left${journeyEdges.left?' is-visible':''}`} aria-hidden="true"/>
        <span className={`miaoda-journey-edge miaoda-journey-edge-right${journeyEdges.right?' is-visible':''}`} aria-hidden="true"/>
        <motion.div className="miaoda-journey-insights" style={{x:-journeyScroll*724/899}} aria-hidden={!journeyHover} initial="hidden" animate={journeyHover?'visible':'hidden'}>
          <motion.article className="journey-insight journey-insight-break" custom={0} variants={insightVariants}><JourneyInsightArrow/><strong>最大认知断点</strong><span>业务语言如何转换成系统结构</span></motion.article>
          <motion.article className="journey-insight journey-insight-low" style={{x:-journeyScroll*(1-724/899)}} custom={1} variants={insightVariants}><JourneyInsightArrow/><strong>最大情绪低点</strong><span>AI 长时间执行，但用户不知道是否可控</span></motion.article>
          <motion.article className="journey-insight journey-insight-value" style={{x:-journeyScroll*(1-724/899)}} custom={2} variants={insightVariants}><JourneyInsightArrow/><strong>核心价值时刻</strong><span>用户首次完成端到端真实业务任务</span></motion.article>
        </motion.div>
      </motion.section>
      <motion.section className="miaoda-design-strategy" aria-label="设计策略" initial={false}>
        <img src={asset('media/miaoda-design-strategy-v2.svg')} alt="设计策略：01，需求表达阶段解决认知断点：引导式创建、场景区分、结构化澄清。02，AI 执行阶段解决情绪低点：分阶段交付成果、进度可见、关键节点用户可介入。03，测试预览阶段体现核心价值：真实测试预览、快速修复。" />
      </motion.section>
      <CoreDesignSection/>
      <motion.section className="miaoda-core-collaboration" aria-label="核心设计 - 02：AI 自主执行 vs 用户控制" initial={false}>
        <img src={asset('media/miaoda-core-collaboration.svg')} alt="单一主对话 + 可见协作团队 + 渐进式控制。目标层：提出目标、提供上下文、校准范围、关键决策、验收结果；责任与协调层：理解目标、拆解计划、调度团队、管理风险、验证结果、综合交付；专业执行层：调研助手、问题审查、验收测试、脚本帮手。"/>
      </motion.section>
      <CoreDesignSection execution/>
      <CoreDesignSection delivery/>
      <CoreDesignSection editing/>
    </div>
  </main>;
}
