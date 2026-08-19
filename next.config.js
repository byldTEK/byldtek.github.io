/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: { root: __dirname },
  // This page's scroll-driven sections use imperative refs + setState from a
  // rAF-throttled scroll handler, not React effects — Strict Mode's dev-only
  // double-render appears to leave that state stale mid-scroll (reproduced:
  // scroll math says one thing, the DOM shows another, until it "catches up"
  // later). Production builds don't double-render, so this is dev-only.
  reactStrictMode: false,
};

module.exports = nextConfig;
