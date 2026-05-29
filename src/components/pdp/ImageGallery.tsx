import { useRef, useState, type MouseEvent } from "react";
import styles from "./ImageGallery.module.scss";

interface Props {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);
  const [zooming, setZooming] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = imgRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.transformOrigin = `${x}% ${y}%`;
  };

  return (
    <div className={styles.gallery}>
      <div
        className={`${styles.mainWrap} ${zooming ? styles.zooming : ""}`}
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onMouseMove={handleMove}
      >
        <img
          ref={imgRef}
          className={styles.mainImg}
          src={images[active]}
          alt={alt}
          loading="eager"
        />
      </div>

      <div className={styles.thumbs} role="tablist" aria-label="Product images">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`View image ${i + 1}`}
            className={`${styles.thumb} ${i === active ? styles.thumbActive : ""}`}
            onClick={() => setActive(i)}
          >
            <img src={src} alt="" loading="lazy" />
          </button>
        ))}
      </div>

      <div className={styles.dots} aria-hidden="true">
        {images.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
