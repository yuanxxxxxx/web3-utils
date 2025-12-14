import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  webpack: function (config, options) {
    config.experiments = {
      asyncWebAssembly: true,
      topLevelAwait: true,
      layers: true,
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve("crypto-browserify"),
    };
    config.module.rules.push({
      test: /\.plutus/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: 'json-loader',
        },
      ],
    })
    return config;
  },
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
