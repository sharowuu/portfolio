import { useState, useEffect } from 'react';
export default function useViewport(){
  const [size,setSize]=useState(()=>({width:window.innerWidth,height:window.innerHeight}));
  useEffect(()=>{const update=()=>setSize({width:window.innerWidth,height:window.innerHeight});window.addEventListener('resize',update);return()=>window.removeEventListener('resize',update)},[]);
  return {...size,mobile:size.width<769};
}
