import { useState } from "react";
import type { FakeStoreProduct } from "../../hooks/useProduct";
import type { ProductVariants, SizeOption } from "../../data/variants";
import { useCart } from "../../stores/CartContext";
import { ColorSwatches } from "./ColorSwatches";
import { SizeSelector } from "./SizeSelector";
import { QuantityPicker } from "./QuantityPicker";
import styles from "./ProductInfo.module.scss";

interface Props {
  product: FakeStoreProduct;
  variants: ProductVariants;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  onColorChange: (id: string) => void;
  onSizeChange: (label: string) => void;
  onQuantityChange: (n: number) => void;
}

function fmt(n: number) {
  return `$${n.toFixed(2)}`;
}

// Simulate the async "add to cart" endpoint with a 15% random failure,
// per the bonus spec.
function mockAddToCart(): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.15) reject(new Error("Network hiccup. Try again."));
      else resolve();
    }, 600);
  });
}

export function ProductInfo(props: Props) {
  const {
    product,
    variants,
    selectedColor,
    selectedSize,
    quantity,
    onColorChange,
    onSizeChange,
    onQuantityChange,
  } = props;

  const { addItem } = useCart();
  const [busy, setBusy] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeSize: SizeOption | undefined = variants.sizes.find(
    (s) => s.label === selectedSize,
  );
  const soldOut = !activeSize || activeSize.state === "sold_out";
  const colorLabel =
    variants.colors.find((c) => c.id === selectedColor)?.label ?? "";

  const handleAdd = async () => {
    if (soldOut || busy) return;
    setBusy(true);
    setError(null);
    try {
      await mockAddToCart();
      addItem({
        productId: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        color: colorLabel,
        size: selectedSize,
        qty: quantity,
      });
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1600);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.panel}>
      <div>
        <div className={styles.brand}>{variants.brand}</div>
        <h1 className={styles.title}>{product.title}</h1>
        <div className={styles.rating}>
          <span className={styles.stars} aria-hidden="true">
            {"★".repeat(Math.round(product.rating.rate))}
            {"☆".repeat(5 - Math.round(product.rating.rate))}
          </span>
          <span>
            {product.rating.rate.toFixed(1)} ({product.rating.count} reviews)
          </span>
        </div>
      </div>

      <div className={styles.priceRow}>
        <span
          className={`${styles.price} ${variants.onSale ? styles.priceSale : ""}`}
        >
          {fmt(product.price)}
        </span>
        {variants.onSale && variants.originalPrice && (
          <>
            <span className={styles.priceOriginal}>
              {fmt(variants.originalPrice)}
            </span>
            <span className={styles.saleBadge}>Sale</span>
          </>
        )}
      </div>

      <div className={styles.divider} />

      <ColorSwatches
        colors={variants.colors}
        value={selectedColor}
        onChange={onColorChange}
      />

      <SizeSelector
        sizes={variants.sizes}
        value={selectedSize}
        onChange={onSizeChange}
      />

      <QuantityPicker
        value={quantity}
        max={activeSize?.stock ?? 0}
        onChange={onQuantityChange}
      />

      <button
        type="button"
        className={`${styles.cta} ${justAdded ? styles.added : ""}`}
        disabled={soldOut || busy}
        onClick={handleAdd}
      >
        {busy
          ? "Adding…"
          : justAdded
            ? "Added to cart ✓"
            : soldOut
              ? "Sold out"
              : "Add to cart"}
      </button>

      {error && <div className={styles.error}>{error}</div>}

      {!soldOut && (
        <div className={styles.delivery}>{variants.deliveryEstimate}</div>
      )}

      <div className={styles.perks} aria-label="Store benefits">
        <div className={styles.perk}><strong>Free</strong>Returns 30 days</div>
        <div className={styles.perk}><strong>Lifetime</strong>Repair warranty</div>
        <div className={styles.perk}><strong>Carbon</strong>Neutral shipping</div>
      </div>
    </div>
  );
}
