import { content } from "@/lib/content";
import type { Lang } from "@/lib/i18n/config";
import type { ImageKey, Img } from "@/lib/site";

type Props = {
  img: ImageKey | Img;
  lang: Lang; // for the alt text
  ratio?: string; // CSS aspect-ratio, e.g. "4 / 3"
  height?: number | string; // alternative to ratio
  priority?: boolean;
  className?: string;
};

// Credits for every photograph are on /credits, not under the photos.
export default function Photo({ img, lang, ratio = "4 / 3", height, priority, className }: Props) {
  const i: Img = typeof img === "string" ? content(lang).images[img] : img;
  const style = height !== undefined ? { height } : { aspectRatio: ratio };
  return (
    <figure className={`photo ${className ?? ""}`}>
      <div className="photo__frame" style={style}>
        {i.src ? (
          <img src={i.src} alt={i.alt} loading={priority ? "eager" : "lazy"} decoding="async" fetchPriority={priority ? "high" : undefined} />
        ) : (
          <div className="placeholder" role="img" aria-label={i.alt}>
            {i.alt}
          </div>
        )}
      </div>
    </figure>
  );
}
