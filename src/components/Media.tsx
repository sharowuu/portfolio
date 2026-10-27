import { useEffect, useRef, useState } from 'react';
import { Image } from '@/components/ui/image';
import { asset } from '@/data/portfolio';
import { playbackPositions } from '@/data/playback';
interface MediaProps { image?:string; video?:string; title:string; active?:boolean; className?:string; strictLoad?:boolean }
export default function Media({image,video,title,active=true,className='',strictLoad=false}:MediaProps){
 const ref=useRef<HTMLVideoElement>(null);
 const [near,setNear]=useState(false);
 useEffect(()=>{ const v=ref.current; if(!v||!video)return; const ob=new IntersectionObserver(([e])=>setNear(e.isIntersecting),{rootMargin:'400px 1200px',threshold:0}); ob.observe(v); return()=>ob.disconnect(); },[video]);
 const shouldLoad=video ? (strictLoad ? !!active : (!!active||near)) : false;
 useEffect(()=>{ const v=ref.current; if(!v||!video)return; const restore=()=>{const time=playbackPositions.get(video);if(time&&Number.isFinite(v.duration))v.currentTime=time%v.duration;};const remember=()=>{if(!v.paused)playbackPositions.set(video,v.currentTime)};v.addEventListener('loadedmetadata',restore);v.addEventListener('timeupdate',remember);if(v.readyState>=1)restore();return()=>{if(active)playbackPositions.set(video,v.currentTime);v.removeEventListener('loadedmetadata',restore);v.removeEventListener('timeupdate',remember)}},[video,active]);
 useEffect(()=>{ const v=ref.current; if(!v)return; if(active&&shouldLoad) v.play().catch(()=>{}); else v.pause(); },[active,shouldLoad,video]);
 return video ? <video ref={ref} className={`project-media ${className}`} src={shouldLoad?asset(video):undefined} poster={image ? asset(image) : undefined} muted loop playsInline autoPlay={active} preload={!shouldLoad?'none':(active?'auto':'metadata')} aria-label={title}/> : <Image className={`project-media ${className}`} src={asset(image||'media/portrait-placeholder.svg')} alt={title} draggable={false} loading={active?'eager':'lazy'}/>;
}
