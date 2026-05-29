// Fake Store API has no variants, brand, stock, or sale info.
// We synthesize them deterministically from product id so the UI is rich
// and stable across reloads. In a real store this comes from the API.

export type StockState = "in_stock" | "low_stock" | "sold_out";

export interface SizeOption {
  label: string;
  stock: number; // 0 = sold out
  state: StockState;
}

export interface ColorOption {
  id: string;
  label: string;
  hex: string;
}

export interface ProductVariants {
  brand: string;
  colors: ColorOption[];
  sizes: SizeOption[];
  onSale: boolean;
  originalPrice?: number;
  deliveryEstimate: string;
}

const BRANDS = [
  "Northridge",
  "Alpine & Oak",
  "Boreal Supply",
  "Cairn Outfitters",
  "Granite Pass",
  "Wolfden Co.",
];

const PALETTES: ColorOption[][] = [
  [
    { id: "moss", label: "Moss", hex: "#4a5d3a" },
    { id: "stone", label: "Stone", hex: "#b8b0a1" },
    { id: "char", label: "Charcoal", hex: "#2a2a2a" },
  ],
  [
    { id: "rust", label: "Rust", hex: "#a85a3a" },
    { id: "navy", label: "Deep Navy", hex: "#1f2c44" },
    { id: "sand", label: "Sand", hex: "#d8c7a1" },
    { id: "black", label: "Black", hex: "#111111" },
  ],
  [
    { id: "forest", label: "Forest", hex: "#2f5d3a" },
    { id: "cream", label: "Cream", hex: "#efe7d4" },
  ],
];

const SIZE_SETS: string[][] = [
  ["XS", "S", "M", "L", "XL"],
  ["S", "M", "L", "XL"],
  ["6", "7", "8", "9", "10", "11", "12"],
  ["One Size"],
];

function hash(n: number): number {
  // simple deterministic pseudo-random
  let x = (n + 1) * 9301 + 49297;
  x = (x * 233280) % 2147483647;
  return Math.abs(x);
}

export function getVariants(productId: number, price: number): ProductVariants {
  const h = hash(productId);
  const brand = BRANDS[h % BRANDS.length];
  const colors = PALETTES[h % PALETTES.length];
  const sizeLabels = SIZE_SETS[(h >> 3) % SIZE_SETS.length];

  const sizes: SizeOption[] = sizeLabels.map((label, i) => {
    const r = hash(productId * 17 + i) % 10;
    let stock: number;
    let state: StockState;
    if (r === 0) {
      stock = 0;
      state = "sold_out";
    } else if (r <= 2) {
      stock = r; // 1 or 2 left
      state = "low_stock";
    } else {
      stock = 5 + (r % 6);
      state = "in_stock";
    }
    return { label, stock, state };
  });

  const onSale = h % 3 === 0;
  const originalPrice = onSale
    ? Math.round((price * (1 + (15 + (h % 25)) / 100)) * 100) / 100
    : undefined;

  const days = 2 + (h % 5);
  const deliveryEstimate = `Free delivery in ${days}–${days + 2} business days`;

  return { brand, colors, sizes, onSale, originalPrice, deliveryEstimate };
}
