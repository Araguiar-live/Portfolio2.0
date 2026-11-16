import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
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
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
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
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      { title: "Selected Work — Portfolio" },
      {
        name: "description",
        content:
          "A single, fluidly scrolling portfolio of deliberate case studies in engineering and design.",
      },
      { property: "og:title", content: "Selected Work — Portfolio" },
      {
        property: "og:description",
        content:
          "A single, fluidly scrolling portfolio of deliberate case studies in engineering and design.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Arimo:wght@400;700&family=Inter:wght@400;500;600;700&family=M+PLUS+Rounded+1c:wght@500;700&family=Montserrat:wght@300;400;500;600&family=Poppins:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
    scripts: [
      {
        // Puts the personal mark back if a sync swaps the tab icon for Lovable's heart.
        children:
          '(function(){var SVG="/favicon.svg",PNG="/favicon-32.png",APPLE="/apple-touch-icon.png";function lock(){var links=document.querySelectorAll(\'link[rel*="icon"]\'),saw=false;for(var i=0;i<links.length;i++){var link=links[i],rel=(link.getAttribute("rel")||"").toLowerCase(),href=link.getAttribute("href")||"";if(rel.indexOf("apple")!==-1){if(href!==APPLE)link.setAttribute("href",APPLE);continue}if(href===SVG){saw=true;continue}if(href===PNG)continue;link.setAttribute("rel","icon");link.setAttribute("type","image/svg+xml");if(link.getAttribute("href")!==SVG)link.setAttribute("href",SVG);saw=true}if(!saw){var icon=document.createElement("link");icon.rel="icon";icon.type="image/svg+xml";icon.href=SVG;document.head.appendChild(icon)}}lock();new MutationObserver(lock).observe(document.head,{childList:true,subtree:true,attributes:true,attributeFilter:["href","rel"]})})();',
      },
      {
        // Sizes the interactive hero's fallback grid before hydration so it doesn't flash 12 rows.
        children:
          '(function(){var pad=2,gap=2,w=document.documentElement.clientWidth,h=window.innerHeight,innerW=Math.max(0,w-pad*2),innerH=Math.max(0,h-pad*2),cols=w<640?Math.max(4,Math.round((innerW+gap)/66)):14,cellW=(innerW-gap*(cols-1))/cols,rows=Math.max(1,Math.round((innerH+gap)/(cellW+gap))),cellH=(innerH-gap*(rows-1))/rows,root=document.documentElement;root.style.setProperty("--hero-cols",String(cols));root.style.setProperty("--hero-rows",String(rows));root.style.setProperty("--hero-cell-w",cellW+"px");root.style.setProperty("--hero-cell-h",cellH+"px");})();',
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
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
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
