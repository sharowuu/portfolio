import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Maximize2, Play, X } from 'lucide-react';
import { asset, motionSettings } from '@/data/portfolio';

export default function CaseVideo({ src, active, title, poster, edgeToEdge = false, displayRatio = 16 / 9 }: { src: string; active: boolean; title: string; poster?: string; edgeToEdge?: boolean; displayRatio?: number }) {
  const inline = useRef<HTMLVideoElement>(null);
  const enlarged = useRef<HTMLVideoElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const playbackTime = useRef(0);
  const [visible, setVisible] = useState(false);
  const [near, setNear] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const video = inline.current;
    if (!video) return;
    const nearObserver = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: '400px 1200px', threshold: 0 });
    const visibleObserver = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .2 });
    nearObserver.observe(video);
    visibleObserver.observe(video);
    return () => { nearObserver.disconnect(); visibleObserver.disconnect(); };
  }, []);
  useEffect(() => {
    const video = inline.current;
    if (!video) return;
    if (active && visible && near && !expanded) {
      let cancelled = false;
      void video.play().then(() => { if (!cancelled) setBlocked(false); }).catch(() => { if (!cancelled) setBlocked(true); });
      return () => { cancelled = true; video.pause(); };
    }
    video.pause();
  }, [active, visible, near, expanded]);
  useEffect(() => {
    const modal = dialog.current;
    if (!expanded || !modal) return;
    const overflow = document.body.style.overflow;
    const player = enlarged.current;
    const opener = trigger.current;
    document.body.style.overflow = 'hidden';
    modal.showModal();
    return () => {
      player?.pause();
      if (modal.open) modal.close();
      document.body.style.overflow = overflow;
      opener?.focus({ preventScroll: true });
    };
  }, [expanded]);
  const open = () => {
    if (failed) return;
    playbackTime.current = inline.current?.currentTime || 0;
    inline.current?.pause();
    setExpanded(true);
  };
  const close = () => {
    const time = enlarged.current?.currentTime;
    if (inline.current && time !== undefined && Number.isFinite(time)) inline.current.currentTime = time;
    dialog.current?.close();
    setExpanded(false);
  };
  const startEnlarged = () => {
    const video = enlarged.current;
    if (!video) return;
    video.currentTime = playbackTime.current;
    void video.play().catch(() => { /* Native controls remain available if autoplay is blocked. */ });
  };
  return <>
    <button ref={trigger} type="button" className={`core-design-video case-video-trigger${edgeToEdge ? ' case-video-edge-to-edge' : ''}`} tabIndex={active ? 0 : -1}
      aria-label={`放大播放：${title}`} aria-haspopup="dialog" onPointerDown={event => event.stopPropagation()} onClick={open}>
      <video ref={inline} src={(near || expanded) ? asset(src) : undefined} poster={poster ? asset(poster) : undefined} muted autoPlay={active && visible && near && !expanded} loop playsInline preload={!near ? 'none' : (active && visible ? 'auto' : 'metadata')} aria-label={title}
        onError={() => setFailed(true)} onPlaying={() => setBlocked(false)} />
      <span className="case-video-expand"><Maximize2/><span>放大播放</span></span>
      {blocked && !failed && <span className="case-video-fallback"><Play/>点击播放并放大</span>}
      {failed && <span className="case-video-fallback" role="status">视频暂时无法播放</span>}
    </button>
    {expanded && createPortal(<dialog ref={dialog} className={`case-video-dialog${edgeToEdge ? ' case-video-edge-to-edge' : ''}`} style={{ '--case-video-ratio': displayRatio } as CSSProperties} aria-label={`${title} · 放大播放`} role="dialog"
      onClose={() => setExpanded(false)} onCancel={close} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <motion.div className="case-video-expanded-panel" initial={{ opacity: 0, y: reduced ? 0 : 24, scale: reduced ? 1 : .96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .5, ease: motionSettings.ease }}>
        <button type="button" className="case-video-close" aria-label="关闭放大视频" onClick={close} autoFocus><X/></button>
        <video ref={enlarged} src={asset(src)} poster={poster ? asset(poster) : undefined} muted autoPlay loop controls playsInline preload="auto" aria-label={title} onLoadedMetadata={startEnlarged}/>
      </motion.div>
    </dialog>, document.body)}
  </>;
}
