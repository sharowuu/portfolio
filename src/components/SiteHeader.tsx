import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { UserRound, MessageCircle, Mail, Phone, ArrowUpRight, Info, Minimize2, ChevronLeft, X } from 'lucide-react';
import { profile, projects, asset, miaodaContent, miaodaUserAnalysis, miaodaDesignStrategy, miaodaCoreDesign, miaodaCoreCollaboration, miaodaCoreExecution, miaodaCoreDelivery, miaodaCoreEditing, motionSettings } from '@/data/portfolio';
import { usePortfolio } from '@/data/portfolio-context';
import useViewport from '@/hooks/useViewport';
import Magnetic from './Magnetic';
export default function SiteHeader(){
 const {pathname}=useLocation();const navigate=useNavigate();const {info,setInfo,introDone}=usePortfolio();const {mobile}=useViewport();
 const [social,setSocial]=useState(false);const [wechatQr,setWechatQr]=useState(false);const [notice,setNotice]=useState('');
 const about=pathname==='/about',detail=pathname.startsWith('/project/'),travel=pathname==='/travel';
 const project=projects.find(p=>pathname===`/project/${p.id}`);
 const miaoda=project?.detailLayout==='miaoda';
 const beauty=project?.detailLayout==='beauty';
 const aily=project?.detailLayout==='aily';
 const feishuCard=project?.detailLayout==='feishu-card';
 const directProject=miaoda||beauty||aily||feishuCard;
 const [miaodaSection,setMiaodaSection]=useState(0);
 useEffect(()=>{
  if(!miaoda&&!beauty&&!aily)return;
  const update=()=>{
   const cards=Array.from(document.querySelectorAll<HTMLElement>('.miaoda-project-sections > section'));
   if(!cards.length)return;
   const middle=window.innerHeight/2;
   const nearest=cards.reduce((best,card,i)=>{
    const r=card.getBoundingClientRect(),b=cards[best].getBoundingClientRect();
    return Math.abs(r.top+r.height/2-middle)<Math.abs(b.top+b.height/2-middle)?i:best;
   },0);
   setMiaodaSection(aily?(nearest>=7?4:nearest>=5?3:nearest>=2?2:0):beauty?Math.min(6,nearest):nearest >= 9 ? 8 : nearest === 8 ? 7 : nearest === 7 ? 6 : nearest === 6 ? 5 : nearest === 5 ? 4 : nearest === 4 ? 3 : Math.min(2,nearest));
  };
  const frame=window.requestAnimationFrame(update);
  const snapUpdate=(event:Event)=>{
   const detail=(event as CustomEvent<{pageKey:string;index:number}>).detail;
   if(aily&&detail?.pageKey==='aily')setMiaodaSection(detail.index>=7?4:detail.index>=5?3:detail.index>=2?2:0);
   else update();
  };
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',update);
  window.addEventListener('portfolio:snap-active',snapUpdate);
  return()=>{window.cancelAnimationFrame(frame);window.removeEventListener('scroll',update);window.removeEventListener('resize',update);window.removeEventListener('portfolio:snap-active',snapUpdate)};
 },[miaoda,beauty,aily]);
 const copy=async(value:string,label:string)=>{try{await navigator.clipboard.writeText(value);setNotice(`${label}已复制：${value}`)}catch{const input=document.createElement('textarea');input.value=value;input.style.position='fixed';input.style.opacity='0';document.body.appendChild(input);input.select();const copied=document.execCommand('copy');input.remove();setNotice(copied?`${label}已复制：${value}`:`复制失败，请手动复制：${value}`)}};
 const open=(url:string,label:string)=>{if(!url){setNotice(`${label}待补充。请在 src/data/portfolio.ts 中填写你的真实信息。`);return;}if(url.startsWith('mailto:'))window.location.href=url;else if(/^https?:\/\//.test(url))window.open(url,'_blank','noopener,noreferrer')};
 const back=()=>{window.scrollTo({top:0,behavior:'instant'});setInfo(false);setSocial(false);navigate('/')};
 if(travel)return null;
 return <><header className={`site-header ${about?'header-about':''} ${detail?'header-detail':''} ${directProject?'header-miaoda':''} ${beauty?'header-beauty':''} ${feishuCard?'header-feishu-card':''}`}>
  <motion.div className="identity" initial={false} animate={{y:introDone?0:mobile?'36dvh':'8rem',scale:introDone?1:.72}} transition={{duration:1.08,ease:motionSettings.ease}}>
   <AnimatePresence mode="wait"><motion.div key={directProject?(beauty?`beauty-${miaodaSection===0?'intro':'details'}`:`${aily?'aily':feishuCard?'feishu-card':'miaoda'}-${miaodaSection}`):project?.id||'identity'} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:.5,ease:motionSettings.ease}}>
    {feishuCard?<div className="feishu-card-header-intro"><div className="feishu-card-header-title"><svg viewBox="0 0 34 34" aria-hidden="true"><path d="M18.7 13.7c.8-.8 1.8-1.5 2.8-2.1-.9-3.7-2.5-6.8-4.8-9.6H2c-.3 0-.4.4-.2.6 5.1 3.7 9.4 8.5 12.5 14 .7-1 2.4-2.3 4.4-2.9Z" fill="#00D6B9"/><path d="M13 33c7 0 13.3-3.5 17.1-9.3.9-1.4 1.7-2.9 2.3-4.4-1.5 2.7-4.3 4.4-7.4 4.4-3.8 0-7.1-2.3-10.7-3.8C9.8 18 5.7 15.2 2 11.7c-.2-.2-.5 0-.5.2v12.7c0 .7.3 1.3.9 1.7A20.5 20.5 0 0 0 13 33Z" fill="#3370FF"/></svg><h1>飞书卡片</h1></div><span>CREADIT CARD</span><p>飞书卡片是一个覆盖从卡片生成到消费完整链路的产品体系，既关注卡片如何被创建，也关注它如何被触达、展示和使用。</p><time>2022 - 2023</time></div>:aily?(miaodaSection===4?<div className="aily-core-intro">
      <h1>核心设计 - <strong>03</strong></h1>
      <span>USER ANALYSIS</span>
      <h2>持续运行 但不持续打扰</h2>
      <p>把执行动态，转成用户需要关注的工作</p>
    </div>:miaodaSection===3?<div className="aily-core-intro">
      <h1>核心设计 - <strong>02</strong></h1>
      <span>USER ANALYSIS</span>
      <h2>把一次请求，变成可管理的持续工作</h2>
      <p>不再每次手动唤起 agent，而是约定什么时候做</p>
    </div>:miaodaSection===2?<div className="aily-core-intro">
      <h1>核心设计 - <strong>01</strong></h1>
      <span>USER ANALYSIS</span>
      <h2>先看懂伙伴，再决定如何委托</h2>
      <p>把陌生的 Agent，变成可理解、可配置的工作伙伴</p>
    </div>:<div className="aily-background-intro">
      <h1><img className="aily-brand-logo" src={asset('media/aily-logo.png')} alt=""/><span>Aily</span> 工作伙伴</h1>
      <span className="aily-intro-watermark">AILY.FEISHU.COM</span>
      <p>探索人与 Agent 协同办公，让 AI 持续工作，<br/>让人掌握关键节点</p>
      <time>2026.04 - 2026.10</time>
    </div>):beauty?<img className="beauty-project-intro-art" src={asset(miaodaSection===6?'media/miaoda-beauty-stage-05-intro.svg':miaodaSection===5?'media/miaoda-beauty-stage-04-intro.svg':miaodaSection===4?'media/miaoda-beauty-stage-03-intro.svg':miaodaSection===3?'media/miaoda-beauty-stage-02-intro.svg':miaodaSection===2?'media/miaoda-beauty-stage-01-intro.svg':miaodaSection===1?'media/miaoda-beauty-evolution-intro.svg':'media/miaoda-beauty-intro.svg')} alt={miaodaSection>0?'八个阶段的策略演进。这条专项线从组件和主题的确定性兜底出发，经历素材召回、具象化 PE、Design Guideline 拆 Skill，最终进入模型能力与工程链路协同。核心不是让模型自由发挥，而是在可接受的稳定性边界内，逐步释放设计创造力。':`妙搭产物默认好看。${project?.sections[0]?.text} 项目时间：2025.07 - 2026.10。`}/>:miaoda?<div className={`miaoda-project-intro ${miaodaSection>0?'miaoda-background-intro':''}`}>
      {miaodaSection===0?<><h1><img src={asset('media/miaoda-logo.svg')} alt="飞书妙搭"/></h1><span className="miaoda-intro-watermark">MIAODA.COM</span><p>{miaodaContent.summary}</p><time>2025.01 - 2026.10</time></>:miaodaSection===1?<img className="miaoda-introduction-left" src={asset('media/miaoda-project-introduction-left.svg')} alt={`项目简介。${miaodaContent.background}`}/>:miaodaSection===2?<><h1>用户分析</h1><span className="miaoda-intro-watermark">USER ANALYSIS</span><p>{miaodaUserAnalysis.summary}</p></>:miaodaSection===3?<img className="miaoda-introduction-left" src={asset('media/miaoda-design-strategy-left.svg')} alt={`设计策略。${miaodaDesignStrategy.summary}`}/>:miaodaSection===4?<><h1>核心设计 - 01</h1><span className="miaoda-intro-watermark">USER ANALYSIS</span><p className="core-design-headline">{miaodaCoreDesign.headline}</p><p className="core-design-intro-summary">{miaodaCoreDesign.summary}</p></>:miaodaSection===5?<><h1>核心设计 - 02</h1><span className="miaoda-intro-watermark">USER ANALYSIS</span><p className="core-design-headline">{miaodaCoreCollaboration.headline}</p><p className="core-design-intro-summary core-collaboration-summary">{miaodaCoreCollaboration.summary}</p></>:miaodaSection===6?<><h1>核心设计 - 02</h1><span className="miaoda-intro-watermark">USER ANALYSIS</span><p className="core-design-headline">{miaodaCoreExecution.headline}</p><div className="core-execution-principles">{miaodaCoreExecution.principles.map(text=><p key={text}>{text}</p>)}</div></>:miaodaSection===7?<><h1>核心设计 - 03</h1><span className="miaoda-intro-watermark">USER ANALYSIS</span><p className="core-design-headline core-delivery-headline">{miaodaCoreDelivery.headline}</p><p className="core-design-intro-summary core-delivery-summary">{miaodaCoreDelivery.summary}</p></>:<><h1>核心设计 - 04</h1><span className="miaoda-intro-watermark">USER ANALYSIS</span><p className="core-design-headline">{miaodaCoreEditing.headline}</p><p className="core-design-intro-summary core-editing-summary">{miaodaCoreEditing.summary}</p></>}
    </div>:<><h1>{project?.title||profile.name}</h1><p>{project?.category||profile.role}</p></>}
   </motion.div></AnimatePresence>
  </motion.div>
  <motion.nav aria-label="主导航" className={`control-dock ${detail?'dock-project':''}`} initial={{opacity:0,y:30}} animate={{opacity:introDone?1:0,y:introDone?0:30}} transition={{duration:.8,ease:motionSettings.ease}}>
   {detail?<>
    <Magnetic>{directProject?<button className="icon-button" aria-label="回到首页" onClick={back}><ChevronLeft/><span className="button-label">回到首页</span></button>:<button className={`icon-button ${info?'active':''}`} aria-label="切换项目信息" aria-pressed={info} onClick={()=>setInfo(v=>!v)}><Info/><span className="button-label">项目说明</span></button>}</Magnetic>
    <Magnetic><button className="icon-button" aria-label={aily?'前往 Aily':feishuCard?'前往飞书卡片搭建':miaoda||beauty?'前往妙搭':'查看项目链接'} onClick={()=>open(project?.website||'','项目链接')}><ArrowUpRight/><span className="button-label">{aily?'前往 Aily':feishuCard?'前往飞书卡片搭建':miaoda||beauty?'前往妙搭':'项目链接'}</span></button></Magnetic>
   </>:<>
    <Magnetic>{about?<button className="icon-button active round" aria-label="返回首页" onClick={back}><ChevronLeft/></button>:<NavLink to="/about" className="icon-button" aria-label="关于我" onClick={()=>{setSocial(false);setWechatQr(false)}}><UserRound/><span className="button-label">关于我</span></NavLink>}</Magnetic>
    {!about&&<Magnetic><button className={`icon-button contact-trigger ${social?'active round contact-close':''}`} aria-label={social?'收起联系方式':'展开联系方式'} aria-expanded={social} onClick={()=>{setSocial(v=>!v);setWechatQr(false)}}><motion.span className="contact-trigger-glyph" animate={{rotate:social?-90:0}} transition={{duration:.3,ease:[.785,.135,.15,.86]}}>{social?<X/>:<MessageCircle/>}</motion.span>{!social&&<span className="button-label">联系我</span>}</button></Magnetic>}
    <AnimatePresence initial={false}>{(about||social)&&<motion.div className="social-links" initial="closed" animate="open" exit="closed" variants={{open:{transition:{staggerChildren:.055,delayChildren:.04}},closed:{transition:{staggerChildren:.045,staggerDirection:-1}}}}>
     <motion.div variants={{open:{x:0,opacity:1,scale:1},closed:{x:-18,opacity:0,scale:.86}}} transition={{duration:.32,ease:motionSettings.ease}}><Magnetic><button className="icon-button" aria-label="复制邮箱" onClick={()=>void copy(profile.email,'邮箱')}><Mail/><span className="button-label">邮箱</span></button></Magnetic></motion.div>
     <motion.div variants={{open:{x:0,opacity:1,scale:1},closed:{x:-18,opacity:0,scale:.86}}} transition={{duration:.32,ease:motionSettings.ease}}><Magnetic><div className={`wechat-contact${wechatQr?' is-open':''}`} onMouseEnter={()=>setWechatQr(true)} onMouseLeave={()=>setWechatQr(false)} onFocusCapture={()=>setWechatQr(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node))setWechatQr(false)}}><button className="icon-button wechat-button" aria-label="微信二维码" aria-expanded={wechatQr}><svg className="wechat-mark" viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="M10 4C5.58 4 2 6.91 2 10.5c0 2 1.11 3.79 2.86 4.98L4.2 18l3.02-1.4c.88.26 1.81.4 2.78.4.36 0 .72-.02 1.07-.06A6.05 6.05 0 0 1 10 13.5c0-3.31 2.91-6 6.5-6 .36 0 .71.03 1.05.08C16.22 5.46 13.38 4 10 4Z"/><path d="M22 13.5c0-2.76-2.46-5-5.5-5s-5.5 2.24-5.5 5 2.46 5 5.5 5c.66 0 1.29-.1 1.88-.29L21 19.5l-.58-2.2C21.4 16.38 22 15.02 22 13.5Z"/><path d="M7.5 8.5h.01M12 8.5h.01M14.5 12h.01M18.5 12h.01"/></svg><span className="button-label">微信</span></button><div className="wechat-qr-popover" role="tooltip" aria-hidden={!wechatQr} style={{opacity:wechatQr?1:0,visibility:wechatQr?'visible':'hidden',translate:wechatQr?'-50% 0':'-50% 1rem'}}><img src={asset('media/wechat-qr.jpg')} alt="吴晓媛的微信二维码"/><span>扫码添加微信</span></div></div></Magnetic></motion.div>
     <motion.div variants={{open:{x:0,opacity:1,scale:1},closed:{x:-18,opacity:0,scale:.86}}} transition={{duration:.32,ease:motionSettings.ease}}><Magnetic><button className="icon-button" aria-label="复制电话" onClick={()=>void copy(profile.phone,'电话')}><Phone/><span className="button-label">电话</span></button></Magnetic></motion.div>
    </motion.div>}</AnimatePresence>
   </>}
  </motion.nav>
 </header>
 {detail&&!directProject&&<motion.div className="back-project" initial={{x:70,opacity:0}} animate={{x:0,opacity:1}} transition={{duration:1.2,ease:motionSettings.ease}}><Magnetic><button className="icon-button" aria-label="返回首页" onClick={back}><Minimize2/><span className="button-label">返回首页</span></button></Magnetic></motion.div>}
 <AnimatePresence>{notice&&<motion.div className="content-notice" role="status" initial={{opacity:0,y:-16,scale:.96,filter:'blur(6px)'}} animate={{opacity:1,y:0,scale:1,filter:'blur(0px)'}} exit={{opacity:0,y:-10,scale:.97,filter:'blur(4px)'}} transition={{duration:.42,ease:motionSettings.ease}}><p>{notice}</p><button aria-label="关闭提示" onClick={()=>setNotice('')}><X size={16}/></button></motion.div>}</AnimatePresence>
 </>;
}
