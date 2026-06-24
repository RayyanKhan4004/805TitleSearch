import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: require.resolve("@svgr/webpack"),
            options: {
              icon: true,
            },
          },
        ],
        as: "*.js",
      },
    },
  },
  output: 'standalone',
};

export default nextConfig;
