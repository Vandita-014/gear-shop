import { useCart } from "../../stores/CartContext";
import styles from "./Header.module.scss";

interface Props {
  category?: string;
}

export function Header({ category }: Props) {
  const { count } = useCart();
  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <div className={styles.logo}>Northridge</div>
          <nav className={styles.nav} aria-label="Primary">
            <a href="/">Shop</a>
            <a href="/">Journal</a>
            <a href="/">Stores</a>
          </nav>
          <button className={styles.cart} aria-label={`Cart, ${count} items`}>
            Cart
            <span className={styles.badge}>{count}</span>
          </button>
        </div>
      </header>
      {category && (
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <a href="/">Shop</a>
          <span className={styles.sep}>/</span>
          <span style={{ textTransform: "capitalize" }}>{category}</span>
        </nav>
      )}
    </>
  );
}
