import { useState } from "react";
import type { FakeStoreProduct } from "../../hooks/useProduct";
import type { ProductVariants } from "../../data/variants";
import styles from "./ProductDetails.module.scss";

interface Props {
  product: FakeStoreProduct;
  variants: ProductVariants;
}

const REVIEWS = [
  {
    name: "Marta L.",
    rating: 5,
    body: "Took it on a four-day trek through the Dolomites. Held up beautifully — no break-in needed.",
  },
  {
    name: "Devon K.",
    rating: 4,
    body: "Materials feel premium. Sizing runs a touch large; I'd size down if between sizes.",
  },
  {
    name: "Priya S.",
    rating: 5,
    body: "Exactly what I was looking for. Fast delivery and the colour matches the photos.",
  },
];

type SectionId = "description" | "specs" | "reviews";

export function ProductDetails({ product, variants }: Props) {
  const [open, setOpen] = useState<SectionId | null>("description");

  const toggle = (id: SectionId) => setOpen((cur) => (cur === id ? null : id));

  const specs: Array<[string, string]> = [
    ["Brand", variants.brand],
    ["Category", product.category],
    ["Available colours", variants.colors.map((c) => c.label).join(", ")],
    ["Sizes", variants.sizes.map((s) => s.label).join(", ")],
    ["Country of origin", "Portugal"],
    ["Care", "Hand wash cold, line dry"],
  ];

  return (
    <section className={styles.wrap} aria-label="Product details">
      <AccordionItem
        id="description"
        title="Description"
        open={open === "description"}
        onToggle={toggle}
      >
        <p>{product.description}</p>
      </AccordionItem>

      <AccordionItem
        id="specs"
        title="Specifications"
        open={open === "specs"}
        onToggle={toggle}
      >
        <table className={styles.specs}>
          <tbody>
            {specs.map(([k, v]) => (
              <tr key={k}>
                <th scope="row">{k}</th>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AccordionItem>

      <AccordionItem
        id="reviews"
        title={`Reviews (${REVIEWS.length})`}
        open={open === "reviews"}
        onToggle={toggle}
      >
        <div className={styles.reviews}>
          {REVIEWS.map((r) => (
            <article key={r.name} className={styles.review}>
              <header className={styles.reviewHead}>
                <span className={styles.reviewer}>{r.name}</span>
                <span className={styles.stars} aria-label={`${r.rating} stars`}>
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </span>
              </header>
              <p className={styles.reviewBody}>{r.body}</p>
            </article>
          ))}
        </div>
      </AccordionItem>
    </section>
  );
}

interface AccordionItemProps {
  id: SectionId;
  title: string;
  open: boolean;
  onToggle: (id: SectionId) => void;
  children: React.ReactNode;
}

function AccordionItem({
  id,
  title,
  open,
  onToggle,
  children,
}: AccordionItemProps) {
  return (
    <div className={styles.item}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={`panel-${id}`}
        onClick={() => onToggle(id)}
      >
        <span>{title}</span>
        <span className={`${styles.icon} ${open ? styles.iconOpen : ""}`}>
          +
        </span>
      </button>
      <div
        id={`panel-${id}`}
        className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
        role="region"
      >
        <div className={styles.panelInner}>{children}</div>
      </div>
    </div>
  );
}
