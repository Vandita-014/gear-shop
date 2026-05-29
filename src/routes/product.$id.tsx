import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useProduct, buildGallery } from "../hooks/useProduct";
import { getVariants } from "../data/variants";
import { Header } from "../components/pdp/Header";
import { ImageGallery } from "../components/pdp/ImageGallery";
import { ProductInfo } from "../components/pdp/ProductInfo";
import { ProductDetails } from "../components/pdp/ProductDetails";
import styles from "../components/pdp/PDPLayout.module.scss";

const searchSchema = z.object({
  color: z.string().optional(),
  size: z.string().optional(),
});

export const Route = createFileRoute("/product/$id")({
  validateSearch: searchSchema,
  head: ({ params }) => ({
    meta: [
      { title: `Product ${params.id} — Northridge Outdoor` },
      {
        name: "description",
        content:
          "Premium outdoor gear, built for the long haul. Free returns within 30 days.",
      },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { product, loading, error } = useProduct(id);

  const variants = useMemo(
    () => (product ? getVariants(product.id, product.price) : null),
    [product],
  );

  const [color, setColor] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [qty, setQty] = useState<number>(1);

  // Initialize selection from URL or sensible defaults
  useEffect(() => {
    if (!variants) return;
    const initColor =
      (search.color &&
        variants.colors.find((c) => c.id === search.color)?.id) ||
      variants.colors[0].id;
    const firstAvailable =
      variants.sizes.find((s) => s.state !== "sold_out")?.label ??
      variants.sizes[0].label;
    const initSize =
      (search.size &&
        variants.sizes.find((s) => s.label === search.size && s.state !== "sold_out")
          ?.label) ||
      firstAvailable;
    setColor(initColor);
    setSize(initSize);
    setQty(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants]);

  // Keep URL in sync with selection (deep-linkable)
  useEffect(() => {
    if (!color || !size) return;
    if (search.color === color && search.size === size) return;
    navigate({
      search: (prev: { color?: string; size?: string }) => ({ ...prev, color, size }),
      replace: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, size]);

  // Clamp quantity when size changes
  useEffect(() => {
    if (!variants) return;
    const s = variants.sizes.find((x) => x.label === size);
    if (s && qty > s.stock) setQty(Math.max(1, s.stock || 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, variants]);

  return (
    <>
      <Header category={product?.category} />
      <main className={styles.page}>
        {loading && <Skeleton />}
        {error && (
          <div className={styles.errorBox}>
            <h2>Couldn't load this product</h2>
            <p>{error}</p>
          </div>
        )}
        {product && variants && color && size && (
          <>
            <div className={styles.grid}>
              <ImageGallery images={buildGallery(product)} alt={product.title} />
              <div className={styles.right}>
                <ProductInfo
                  product={product}
                  variants={variants}
                  selectedColor={color}
                  selectedSize={size}
                  quantity={qty}
                  onColorChange={setColor}
                  onSizeChange={setSize}
                  onQuantityChange={setQty}
                />
              </div>
            </div>
            <ProductDetails product={product} variants={variants} />
          </>
        )}
      </main>
    </>
  );
}

function Skeleton() {
  return (
    <div className={styles.skeletonGrid}>
      <div className={`${styles.skel} ${styles.skelImage}`} />
      <div>
        <div className={styles.skel} style={{ height: 14, width: "30%", marginBottom: 16 }} />
        <div className={styles.skel} style={{ height: 28, width: "80%", marginBottom: 16 }} />
        <div className={styles.skel} style={{ height: 20, width: "40%", marginBottom: 24 }} />
        <div className={styles.skel} style={{ height: 44, width: "60%", marginBottom: 16 }} />
        <div className={styles.skel} style={{ height: 44, width: "100%", marginBottom: 16 }} />
        <div className={styles.skel} style={{ height: 52, width: "100%" }} />
      </div>
    </div>
  );
}
