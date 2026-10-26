import { useEffect, useRef } from 'react';
import { Image } from '@/components/ui/image';
import { asset } from '@/data/portfolio';
import { playbackPositions } from '@/data/playback';
interface MediaProps { image?:string; video?:string; title:string; active?:boolean; className?:string }
export default function Media({image,video,title,active=true,className=''}:MediaProps){
 const ref=useRef<HTMLVideoElement>(null);
 useEffect(()=>{ const v=ref.current; if(!v||!video)return; const restore=()=>{const time=playbackPositions.get(video);if(time&&Number.isFinite(v.duration))v.currentTime=time%v.duration;};const remember=()=>{if(!v.paused)playbackPositions.set(video,v.currentTime)};v.addEventListener('loadedmetadata',restore);v.addEventListener('timeupdate',remember);if(v.readyState>=1)restore();return()=>{if(active)playbackPositions.set(video,v.currentTime);v.removeEventListener('loadedmetadata',restore);v.removeEventListener('timeupdate',remember)}},[video,active]);
 useEffect(()=>{ const v=ref.current; if(!v)return; if(active) v.play().catch(()=>{}); else v.pause(); },[active,video]);
 return video ? <video ref={ref} className={`project-media ${className}`} src={asset(video)} poster={image ? asset(image) : undefined} muted loop playsInline autoPlay={active} preload="auto" aria-label={title}/> : <Image className={`project-media ${className}`} src={asset(image||'media/portrait-placeholder.svg')} alt={title} draggable={false} loading="eager"/>;
}
