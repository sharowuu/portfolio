import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MotionConfig, LayoutGroup } from 'framer-motion';
import { PortfolioContext } from '@/data/portfolio-context';
import SiteHeader from './SiteHeader';
import ProjectSlider from './ProjectSlider';
import { profile, asset } from '@/data/portfolio';
export const Layout = () => {
 const [corePoint,setCorePoint]=useState(0);
 const [executionPoint,setExecutionPoint]=useState(0);
 const [deliveryPoint,setDeliveryPoint]=useState(0);
 const [editingPoint,setEditingPoint]=useState(0);
 const [cursor,setCursor]=useState(0);const [info,setInfo]=useState(false);const [introDone,setIntroDone]=useState(false);const {pathname}=useLocation();
 useEffect(()=>{const font=new FontFace('Portfolio Suisse',`url(${asset('media/suisse-book.woff2')})`);font.load().then(f=>document.fonts.add(f)).catch(()=>{});const timer=window.setTimeout(()=>setIntroDone(true),950);return()=>window.clearTimeout(timer)},[]);
 useEffect(()=>{document.title=`${profile.name} — 个人作品集`;document.body.classList.toggle('home-lock',pathname==='/');window.scrollTo(0,0);return()=>document.body.classList.remove('home-lock')},[pathname]);
 return <PortfolioContext.Provider value={{editingPoint,setEditingPoint,deliveryPoint,setDeliveryPoint,executionPoint,setExecutionPoint,corePoint,setCorePoint,cursor,setCursor,info,setInfo,introDone}}><MotionConfig reducedMotion="user"><LayoutGroup>
  <SiteHeader/>{pathname==='/'&&<ProjectSlider/>}<Outlet/>
 </LayoutGroup></MotionConfig></PortfolioContext.Provider>;
};
