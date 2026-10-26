import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import useViewport from '@/hooks/useViewport';
interface MagneticProps {children:React.ReactNode; enabled?:boolean; className?:string}
export default function Magnetic({children,enabled=true,className=''}:MagneticProps){
 const ref=useRef<HTMLDivElement>(null); const {mobile}=useViewport();
 const mx=useMotionValue(0),my=useMotionValue(0);
 const x=useSpring(mx,{stiffness:70,damping:24,mass:.28}),y=useSpring(my,{stiffness:70,damping:24,mass:.28});
 useEffect(()=>{if(!enabled||mobile)return;
  const move=(e:MouseEvent)=>{const el=ref.current;if(!el)return;const r=el.getBoundingClientRect();const dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);const distance=Math.hypot(dx,dy);const f=Math.pow(Math.max(0,1-distance/325),1.1);mx.set(-dx*.095*f);my.set(-dy*.095*f)};
  const reset=()=>{mx.set(0);my.set(0)};
  window.addEventListener('mousemove',move);window.addEventListener('mouseout',reset);return()=>{window.removeEventListener('mousemove',move);window.removeEventListener('mouseout',reset);reset()};
 },[enabled,mobile,mx,my]);
 return <motion.div ref={ref} style={{x,y}} className={className}>{children}</motion.div>
}
