import styles from "./QuantityPicker.module.scss";

interface Props {
  value: number;
  max: number;
  onChange: (n: number) => void;
}

export function QuantityPicker({ value, max, onChange }: Props) {
  const dec = () => onChange(Math.max(1, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  const disabled = max < 1;
  return (
    <div className={styles.wrap}>
      <span className={styles.label}>Quantity</span>
      <div className={styles.box}>
        <button
          type="button"
          className={styles.btn}
          onClick={dec}
          disabled={disabled || value <= 1}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className={styles.value} aria-live="polite">
          {disabled ? 0 : value}
        </span>
        <button
          type="button"
          className={styles.btn}
          onClick={inc}
          disabled={disabled || value >= max}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
}
