/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false };
    }
    return config;
  },
};

module.exports = {
  reactStrictMode: true,
  webpack(config, { dev }) {
    if (dev) {
      config.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        loader: "babel-loader",
        options: {
          plugins: ["react-refresh/babel"],
        },
      });
    }
    return config;
  },
};
