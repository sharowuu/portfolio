import { forwardRef, useCallback, useEffect, useRef, useState, type ComponentPropsWithoutRef } from 'react';
import useMediaVisibility from '@/hooks/useMediaVisibility';
import { requestImage } from '@/lib/media-load-queue';
import dimensions from '@/data/media-dimensions.json';

export interface DeferredImageProps extends ComponentPropsWithoutRef<'img'> {
  active?: boolean;
  prefetch?: boolean;
}
const sizes: Record<string, number[]> = dimensions;
export const DeferredImage = forwardRef<HTMLImageElement, DeferredImageProps>(function DeferredImage({
  src, srcSet, active = true, prefetch = false, loading = 'lazy', decoding = 'async', width, height, ...props
}, forwardedRef) {
  const node = useRef<HTMLImageElement>(null);
  const attach = useCallback((element: HTMLImageElement | null) => {
    node.current = element;
    if (typeof forwardedRef === 'function') forwardedRef(element);
    else if (forwardedRef) forwardedRef.current = element;
  }, [forwardedRef]);
  const { visible, near, sectionVisible, pageVisible } = useMediaVisibility(node);
  const [readySrc, setReadySrc] = useState<string>();
  const key = typeof src === 'string' ? src.slice(src.indexOf('media/')).split(/[?#]/)[0] : '';
  const intrinsic = sizes[key];
  const placeholder = intrinsic
    ? `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${intrinsic[0]}' height='${intrinsic[1]}'/%3E`
    : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E";
  const urgent = active && (visible || (loading === 'eager' && near));
  const speculative = (active && near) || (prefetch && sectionVisible);
  useEffect(() => {
    if (!src || readySrc === src || !pageVisible || (!urgent && !speculative)) return;
    return requestImage(src, urgent ? 'visible' : 'idle', () => setReadySrc(src));
  }, [src, readySrc, urgent, speculative, pageVisible]);
  const ready = !!src && readySrc === src;
  return <img {...props} ref={attach} src={ready ? src : placeholder} srcSet={ready ? srcSet : undefined}
    width={width ?? intrinsic?.[0]} height={height ?? intrinsic?.[1]}
    loading="eager" decoding={decoding} data-media-src={src} data-media-ready={ready} />;
});
