import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";

/**
 * The tab icon is the personal mark in src/brand. Lovable's sync restores
 * public/favicon.ico to its heart, so every dev start and production build
 * copies the mark back over the public files and the client output.
 */
const FILES = ["favicon.svg", "favicon.ico", "favicon-32.png", "apple-touch-icon.png"] as const;

function stamp(root: string, dir: string) {
  mkdirSync(dir, { recursive: true });
  for (const name of FILES) {
    copyFileSync(resolve(root, "src/brand", name), resolve(dir, name));
  }
}

export function lockSiteFavicon(): Plugin {
  let root = process.cwd();
  return {
    name: "lock-site-favicon",
    enforce: "post",
    configResolved(config) {
      root = config.root;
      stamp(root, resolve(root, "public"));
    },
    buildStart() {
      stamp(root, resolve(root, "public"));
    },
    closeBundle() {
      stamp(root, resolve(root, "public"));
      for (const dir of ["dist", "dist/client", ".output/public"]) {
        stamp(root, resolve(root, dir));
      }
    },
  };
}
