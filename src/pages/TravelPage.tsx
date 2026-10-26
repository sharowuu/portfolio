import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { asset,profile } from '@/data/portfolio';
interface PhotoProps {index:number; depth:ReturnType<typeof useSpring>}
function Photo({index,depth}:PhotoProps){
 const z=useTransform(depth,v=>((index*280+v)%2240+2240)%2240-1800);
 const opacity=useTransform(z,[-1800,-1400,-100,300],[0,.9,1,0]);
 const xs=[-250,240,-130,180,-310,300,-80,100],ys=[-200,-190,50,30,240,200,-90,180];
 return <motion.div className="travel-photo" style={{z,x:xs[index],y:ys[index],opacity}}><Image src={asset(profile.portrait)} alt="个人影像占位"/></motion.div>
}
export default function TravelPage(){
 const navigate=useNavigate();const value=useMotionValue(0);const depth=useSpring(value,{stiffness:45,damping:25});const pointer=useRef(0);
 useEffect(()=>{const wheel=(e:WheelEvent)=>{e.preventDefault();value.set(value.get()+e.deltaY*.9)};window.addEventListener('wheel',wheel,{passive:false});return()=>window.removeEventListener('wheel',wheel)},[value]);
 return <main className="travel-page" onPointerDown={e=>{if(e.target instanceof Element && e.target.closest('button'))return;pointer.current=e.clientY;e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId)){value.set(value.get()+(pointer.current-e.clientY)*2);pointer.current=e.clientY}}} onPointerUp={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)}}>
 <p className="travel-caption">个人影像占位 · 滚动或拖动浏览</p><div className="travel-scene">{Array.from({length:8},(_,i)=><Photo key={i} index={i} depth={depth}/>)}</div><Plane className="travel-plane" strokeWidth={.8}/>
 <button className="travel-return" onClick={()=>navigate('/about')} aria-label="返回个人页"><span className="flip-label"><span>B</span><span>A</span><span>C</span><span>K</span></span><small>点击返回</small></button>
 </main>
}
