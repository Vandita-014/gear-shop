import { useEffect, useState } from "react";

export interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

export interface UseProductResult {
  product: FakeStoreProduct | null;
  loading: boolean;
  error: string | null;
}

// Fake Store API returns one image per product. We synthesize a small gallery
// by reusing the image with different presentations — in a real store the API
// returns N images.
export function buildGallery(p: FakeStoreProduct): string[] {
  return [p.image, p.image, p.image, p.image];
}

export function useProduct(id: string | number): UseProductResult {
  const [product, setProduct] = useState<FakeStoreProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: FakeStoreProduct) => {
        if (!alive) return;
        setProduct(data);
        setLoading(false);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e.message || "Failed to load product");
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  return { product, loading, error };
}
