import { hostname } from 'os';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {remotePatterns:[{hostname: "images.unsplash.com"}]},
    experimental: {
        serverActions:true
    }
};

export default nextConfig;
