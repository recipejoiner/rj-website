const withCSS = require('@zeit/next-css');
const optimizedImages = require('next-optimized-images');
const withPlugins = require('next-compose-plugins');
const webpack = require('webpack');

const nextConfiguration = {
  env: {
    // can put (non private) env variables here
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // require('./scripts/sitemap-generator');
    }

    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }

    return config;
  },
};

const optImgConfiguration = {
  optimizeImagesInDev: true,
  pngquant: true,
  responsive: {
    rules: [
      {
        test: /\.(jpe?g|png)$/i,
        loader: 'responsive-loader',
        options: {
          adapter: require('responsive-loader/sharp'),
        }
      },
    ]
  }
};

module.exports = withPlugins([
  [withCSS, nextConfiguration],
  [optimizedImages, optImgConfiguration],
]);
