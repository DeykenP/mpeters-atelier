import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Route changes animate with the browser View Transitions API:
    // a soft dissolve between pages and the product photo carried from the
    // grid into its page (see globals.css).
    viewTransition: true,
  },
};

export default nextConfig;
