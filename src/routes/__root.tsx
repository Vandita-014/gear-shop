import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import "../styles/global.scss";
import styles from "./Root.module.scss";
import { CartProvider } from "../stores/CartContext";

function NotFoundComponent() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Page not found</h2>
        <p className={styles.subtitle}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className={styles.actions}>
          <Link to="/" className={styles.primaryButton}>
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>This page didn't load</h1>
        <p className={styles.subtitle}>
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className={styles.actions}>
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className={styles.primaryButton}
          >
            Try again
          </button>
          <a href="/" className={styles.secondaryButton}>
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Northridge — Premium Outdoor Gear" },
      {
        name: "description",
        content: "Built for the trail. Premium outdoor gear, packs and apparel.",
      },
      { property: "og:title", content: "Northridge — Premium Outdoor Gear" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Outlet />
      </CartProvider>
    </QueryClientProvider>
  );
}
