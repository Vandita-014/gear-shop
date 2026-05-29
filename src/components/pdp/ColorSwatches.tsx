import type { ColorOption } from "../../data/variants";
import styles from "./ColorSwatches.module.scss";

interface Props {
  colors: ColorOption[];
  value: string;
  onChange: (id: string) => void;
}

export function ColorSwatches({ colors, value, onChange }: Props) {
  const active = colors.find((c) => c.id === value);
  return (
    <div className={styles.wrap}>
      <div className={styles.label}>
        Colour <strong>{active?.label ?? ""}</strong>
      </div>
      <div className={styles.row} role="radiogroup" aria-label="Colour">
        {colors.map((c) => (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={c.id === value}
            aria-label={c.label}
            title={c.label}
            className={`${styles.swatch} ${c.id === value ? styles.swatchActive : ""}`}
            onClick={() => onChange(c.id)}
          >
            <span className={styles.dot} style={{ background: c.hex }} />
          </button>
        ))}
      </div>
    </div>
  );
}
