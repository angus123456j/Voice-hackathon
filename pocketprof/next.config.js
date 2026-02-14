/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        // Handle PDF.js worker
        config.resolve.alias.canvas = false;
        config.resolve.alias.encoding = false;
        return config;
    },
    async rewrites() {
        return [
            {
                source: '/api/slides/:path*',
                destination: 'http://localhost:5000/api/slides/:path*',
            },
            {
                source: '/api/upload',
                destination: 'http://localhost:5000/api/upload',
            },
            {
                source: '/api/backend/:path*',
                destination: 'http://localhost:5000/api/:path*',
            },
        ];
    },
};

module.exports = nextConfig;
