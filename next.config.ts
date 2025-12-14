import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  webpack: function (config, options) {
    config.experiments = {
      asyncWebAssembly: true,
      topLevelAwait: true,
      layers: true,
    };
    
    // 解决浏览器 API 和 React Native 依赖问题
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve("crypto-browserify"),
      // 忽略 React Native 相关依赖
      "@react-native-async-storage/async-storage": false,
      "react-native": false,
      "react-native-webview": false,
      // 浏览器 API fallback
      fs: false,
      net: false,
      tls: false,
    };
    
    // 忽略某些模块的警告
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /Can't resolve '@react-native-async-storage\/async-storage'/,
    ];
    
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
