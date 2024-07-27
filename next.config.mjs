/** @type {import('next').NextConfig} */
import withVideos from "next-videos";

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: false,
  assetPrefix: isProd ? "https://tasktis.netlify.app/" : undefined,
};

export default withVideos(nextConfig);
