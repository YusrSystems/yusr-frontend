import { useCallback, useState } from "react";

export function useLightBox()
{
  const [lightbox, setLightbox] = useState<{ srcLight: string; srcDark: string; alt: string; } | null>(null);

  const openLightbox = useCallback((srcLight: string, srcDark: string, alt: string) =>
  {
    setLightbox({ srcLight, srcDark, alt });
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  return { lightbox, openLightbox, closeLightbox };
}
