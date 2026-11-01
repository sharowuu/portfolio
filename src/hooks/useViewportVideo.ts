import { useEffect, useRef, useState, type RefObject } from 'react';
import useMediaVisibility from './useMediaVisibility';
import { holdIdleImages } from '@/lib/media-load-queue';

// Do not attach src to unselected/offscreen videos: preload="none" alone is not a network gate.
export default function useViewportVideo(ref: RefObject<HTMLVideoElement | null>, src: string | undefined, active: boolean, savedPosition?: RefObject<number>) {
  const visibility = useMediaVisibility(ref);
  const eligible = active && visibility.visible && visibility.pageVisible;
  const [settled, setSettled] = useState(false);
  const localPosition = useRef(0);
  const position = savedPosition ?? localPosition;
  const [blocked, setBlocked] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setSettled(eligible), eligible ? 160 : 0);
    return () => window.clearTimeout(timer);
  }, [eligible]);
  const shouldLoad = eligible && settled;
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (!shouldLoad || !src) {
      video.pause();
      // React has removed src. load() aborts the previous transfer and releases its decoder.
      video.load();
      return;
    }
    const release = holdIdleImages();
    const timeout = window.setTimeout(release, 15000);
    const remember = () => { if (video.currentTime > 0) position.current = video.currentTime; };
    const restore = () => {
      if (position.current && Number.isFinite(video.duration)) video.currentTime = position.current % video.duration;
    };
    video.addEventListener('timeupdate', remember);
    video.addEventListener('loadedmetadata', restore);
    video.addEventListener('loadeddata', release, { once: true });
    video.addEventListener('error', release, { once: true });
    let cancelled = false;
    void video.play().then(() => { if (!cancelled) setBlocked(false); }).catch(() => { if (!cancelled) setBlocked(true); });
    return () => {
      cancelled = true;
      remember();
      video.pause();
      video.removeEventListener('timeupdate', remember);
      video.removeEventListener('loadedmetadata', restore);
      video.removeEventListener('loadeddata', release);
      video.removeEventListener('error', release);
      window.clearTimeout(timeout);
      release();
    };
  }, [shouldLoad, src, ref, position]);
  useEffect(() => {
    const video = ref.current;
    return () => { if (video) { video.pause(); video.removeAttribute('src'); video.load(); } };
  }, [ref]);
  return { ...visibility, shouldLoad, blocked: shouldLoad && blocked, source: shouldLoad ? src : undefined };
}
