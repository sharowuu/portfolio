import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePortfolio } from '@/data/portfolio-context';
import { projects, motionSettings, asset } from '@/data/portfolio';
import useViewport from '@/hooks/useViewport';
import Media from './Media';
import Magnetic from './Magnetic';
export default function ProjectSlider(){
 const {cursor,setCursor,introDone}=usePortfolio();const {pathname}=useLocation();const {height,width,mobile}=useViewport();
 const dragging=useRef({id:-1,x:0,y:0,moved:false,time:0});const lock=useRef(false);
 const home=pathname==='/';const about=pathname==='/about';const active=((cursor%4)+4)%4;
 useEffect(()=>{if(!home||!introDone)return;
  const wheel=(e:WheelEvent)=>{e.preventDefault();const d=Math.abs(e.deltaY);if(d<20||lock.current)return;lock.current=true;setCursor(n=>n+(e.deltaY>0?-1:1));window.setTimeout(()=>{lock.current=false},Math.max(30,165-d))};
  const key=(e:KeyboardEvent)=>{if(['ArrowUp','ArrowLeft','ArrowDown','ArrowRight'].includes(e.key)){e.preventDefault();setCursor(n=>n+(['ArrowUp','ArrowLeft'].includes(e.key)?1:-1))}};
  window.addEventListener('wheel',wheel,{passive:false});window.addEventListener('keydown',key);return()=>{window.removeEventListener('wheel',wheel);window.removeEventListener('keydown',key)};
 },[home,introDone,setCursor]);
 const offset=(d:number)=>d===0?0:Math.sign(d)*(height*(mobile?.37:.4)+(Math.abs(d)-1)*(mobile?43:35));
 return <><div className={`slider-column ${home?'':'slider-away'}`} role="region" aria-label="项目滚动卡片" aria-hidden={!home} inert={!home} style={{pointerEvents:home?'auto':'none'}}
  onPointerDown={e=>{if(e.pointerType==='mouse'&&e.button!==0)return;dragging.current={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false,time:0}}}
  onPointerMove={e=>{const d=dragging.current;if(d.id!==e.pointerId)return;const dy=e.clientY-d.y;if(Math.abs(dy)>=45&&Math.abs(dy)>Math.abs(e.clientX-d.x)&&performance.now()-d.time>=170){e.currentTarget.setPointerCapture(e.pointerId);setCursor(n=>n+(dy>0?-1:1));d.moved=true;d.y=e.clientY;d.x=e.clientX;d.time=performance.now()}}}
  onPointerUp={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);dragging.current.id=-1;window.setTimeout(()=>{dragging.current.moved=false},100)}}>
  <ul className="card-stage"><AnimatePresence initial={false}>
   {Array.from({length:7},(_,i)=>cursor+i-3).map(key=>{const d=key-cursor;const idx=((key%4)+4)%4;const p=projects[idx];const current=d===0;const rotate=d===0?0:Math.sign(d)*(mobile?93:98);
    return <motion.li key={key} className="stack-card" data-distance={d} data-project={p.id}
     initial={current&&introDone?false:{y:Math.sign(d||-1)*height*.6,rotateX:rotate,scale:mobile?.76:.8}}
     animate={{y:!introDone?offset(current?-1:d):home?offset(d):current?0:Math.sign(d)*height*.6,rotateX:!introDone&&current?-(mobile?93:98):rotate,scale:current&&introDone?1:mobile?.76:.8,x:about&&current?Math.max(width*.6,420)+(mobile?40:0):0,opacity:home||about?1:current?1:0}}
     exit={{y:Math.sign(d)*height*.6,opacity:0}}
     transition={home&&introDone?motionSettings.spring:{duration:mobile?.8:1.2,ease:motionSettings.ease}}
     style={{zIndex:current?8:4-Math.abs(d)}}>
      <Magnetic enabled={home&&current&&introDone} className="magnetic-card">
       <motion.div layoutId={current&&home?`project-${p.id}`:undefined} className="card-surface" style={{borderRadius:32}} transition={{layout:{duration:1.2,ease:motionSettings.ease}}}>
        <Link to={`/project/${p.id}`} tabIndex={current&&home?0:-1} aria-label={`打开${p.title}`} onClick={e=>{if(dragging.current.moved||!introDone){e.preventDefault();return;}if(!current){e.preventDefault();setCursor(key)}}}>
         <motion.div className="cover-content" animate={{opacity:current?1:0}} transition={{duration:.3}}>
          {p.id==='project-4'?<div className="feishu-card-home-cover" aria-label="飞书卡片项目封面"><img src={asset(p.cover)} alt="" loading={current?'eager':'lazy'} decoding="async"/>{current&&home?<video src={asset('media/feishu-card-editor.mp4')} muted loop playsInline autoPlay/>:null}</div>:<Media image={p.cover} video={p.video} active={current&&home} title={p.title} strictLoad/>} {!p.coverContainsTitle&&<span className="cover-title">{p.title}</span>}{p.reference&&<span className="reference-label">参考画面 · 待替换</span>}
         </motion.div>
        </Link>
       </motion.div>
      </Magnetic>
     </motion.li>
   })}
  </AnimatePresence></ul><div className="stack-fade stack-fade-top"/><div className="stack-fade stack-fade-bottom"/>
 </div>
 <motion.div className="project-dots" aria-hidden={!home} inert={!home} animate={{opacity:home&&introDone?1:0,x:about?width*.6:0}} transition={{duration:.8,ease:motionSettings.ease}} aria-label={`当前项目 ${active+1} / 4`}>
  {[3,2,1,0].map(i=><button key={i} aria-label={`切换到${projects[i].title}`} aria-current={active===i} onClick={()=>setCursor(n=>n+(i-active))}><span style={{opacity:active===i?1:.2}}/></button>)}
 </motion.div></>;
}
