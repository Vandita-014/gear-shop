import type { SizeOption } from "../../data/variants";
import styles from "./SizeSelector.module.scss";

interface Props {
  sizes: SizeOption[];
  value: string;
  onChange: (label: string) => void;
}

export function SizeSelector({ sizes, value, onChange }: Props) {
  const active = sizes.find((s) => s.label === value);
  const hint =
    active?.state === "low_stock"
      ? `Only ${active.stock} left in size ${active.label}`
      : active?.state === "sold_out"
        ? `Size ${active.label} is sold out`
        : "";

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.label}>Size</span>
        <button type="button" className={styles.guide}>
          Size guide
        </button>
      </div>
      <div className={styles.row} role="radiogroup" aria-label="Size">
        {sizes.map((s) => {
          const sold = s.state === "sold_out";
          const low = s.state === "low_stock";
          const isActive = s.label === value;
          return (
            <button
              key={s.label}
              type="button"
              role="radio"
              aria-checked={isActive}
              disabled={sold}
              className={[
                styles.size,
                isActive && !sold ? styles.active : "",
                low && !isActive ? styles.lowStock : "",
                sold ? styles.soldOut : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => !sold && onChange(s.label)}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      <div className={styles.hint} aria-live="polite">
        {hint}
      </div>
    </div>
  );
}
