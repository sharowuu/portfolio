import { motion } from 'framer-motion';
import { useRef } from 'react';
import useCardSnap from '@/hooks/useCardSnap';
import { Navigate,useParams } from 'react-router-dom';
import { usePortfolio } from '@/data/portfolio-context';
import { projects,motionSettings } from '@/data/portfolio';
import Media from '@/components/Media';
import MiaodaProjectPage from './MiaodaProjectPage';
import BeautyProjectPage from './BeautyProjectPage';
import AilyProjectPage from './AilyProjectPage';
import FeishuCardProjectPage from './FeishuCardProjectPage';
import useViewport from '@/hooks/useViewport';
export default function ProjectPage(){
 const {id}=useParams();const project=projects.find(p=>p.id===id);const {info,setInfo}=usePortfolio();const {mobile}=useViewport();
 const mainRef=useRef<HTMLElement>(null);
 useCardSnap(mainRef, '.project-sections > .detail-card', id||'');
 if(!project)return <Navigate to="/" replace/>;
 if(project.detailLayout==='miaoda')return <MiaodaProjectPage/>;
 if(project.detailLayout==='beauty')return <BeautyProjectPage/>;
 if(project.detailLayout==='aily')return <AilyProjectPage/>;
 if(project.detailLayout==='feishu-card')return <FeishuCardProjectPage/>;
 return <main ref={mainRef} className="project-page" aria-label={`${project.title}详情`}><div className="project-sections">
  {project.sections.map((section,index)=><motion.button key={`${project.id}-${index}`} type="button" className={`detail-card ${index===0?'detail-hero':''}`} layoutId={index===0?`project-${project.id}`:undefined}
   style={{borderRadius:mobile?32:64}} initial={false} transition={{duration:1.2,ease:motionSettings.ease,layout:{duration:1.2,ease:motionSettings.ease}}}
   onClick={()=>setInfo(v=>!v)} aria-label={`${section.title}：${info?'查看画面':'查看文字'}`} aria-pressed={info}>
   <motion.div className="detail-info" aria-hidden={!info} animate={{opacity:info?1:0}} transition={{duration:.35}}><h2>{section.title}</h2><p>{section.text}</p></motion.div>
   <motion.div className="detail-visual" aria-hidden={info} animate={{opacity:info?0:1}} transition={{duration:mobile?.3:.4}}><Media image={section.image} video={section.video} title={section.title} active={!info}/><span className="detail-placeholder-note">{project.title} · {section.title} · 参考画面待替换</span></motion.div>
  </motion.button>)}
 </div></main>
}
