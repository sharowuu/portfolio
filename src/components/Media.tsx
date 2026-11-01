import { useEffect, useRef } from 'react';
import { DeferredImage } from './DeferredImage';
import { asset } from '@/data/portfolio';
import { playbackPositions } from '@/data/playback';
import useViewportVideo from '@/hooks/useViewportVideo';
interface MediaProps { image?: string; video?: string; title: string; active?: boolean; className?: string; strictLoad?: boolean; prefetch?: boolean }
export default function Media({ image, video, title, active = true, className = '', prefetch = false }: MediaProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const savedPosition = useRef(video ? playbackPositions.get(video) || 0 : 0);
  const { source, shouldLoad, near } = useViewportVideo(ref, video ? asset(video) : undefined, active, savedPosition);
  useEffect(() => {
    const player = ref.current;
    if (!video || !player) return;
    const remember = () => { if (player.currentTime > 0) playbackPositions.set(video, player.currentTime); };
    player.addEventListener('timeupdate', remember);
    return () => { remember(); player.removeEventListener('timeupdate', remember); };
  }, [video]);
  return video
    ? <video ref={ref} className={`project-media ${className}`} src={source} poster={image && active && near ? asset(image) : undefined}
      muted loop playsInline autoPlay={shouldLoad} preload={shouldLoad ? 'auto' : 'none'} aria-label={title}/>
    : <DeferredImage className={`project-media ${className}`} src={asset(image || 'media/portrait-placeholder.svg')}
      alt={title} active={active} prefetch={prefetch} draggable={false} loading={active ? 'eager' : 'lazy'}/>;
}
