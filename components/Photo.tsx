import { images, type ImageKey, type Img } from "@/lib/site";

type Props = {
  img: ImageKey | Img;
  ratio?: string; // CSS aspect-ratio, e.g. "4 / 3"
  height?: number | string; // alternative to ratio
  priority?: boolean;
  credit?: boolean; // show a credit line under the photo (default false: credits live on /credits)
  className?: string;
  sizes?: string;
};

export function creditText(i: Img) {
  if (!i.credit) return "";
  return i.license ? `Photo: ${i.credit} · ${i.license}` : `Photo: ${i.credit}`;
}

export default function Photo({ img, ratio = "4 / 3", height, priority, credit = false, className }: Props) {
  const i: Img = typeof img === "string" ? images[img] : img;
  const style = height !== undefined ? { height } : { aspectRatio: ratio };
  return (
    <figure className={`photo ${className ?? ""}`}>
      <div className="photo__frame" style={style}>
        {i.src ? (
          <img src={i.src} alt={i.alt} loading={priority ? "eager" : "lazy"} decoding="async" fetchPriority={priority ? "high" : undefined} />
        ) : (
          <div className="placeholder" role="img" aria-label={i.alt}>
            Photo needed: {i.alt}
          </div>
        )}
      </div>
      {credit && i.src && i.credit ? <figcaption className="photo__credit">{creditText(i)}</figcaption> : null}
    </figure>
  );
}
