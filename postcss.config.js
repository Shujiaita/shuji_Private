// postcss.config.js
module.exports = {
  plugins: {
    // Tailwind の PostCSS プラグインはこのパッケージを使う
    "@tailwindcss/postcss": {},
    // 引き続き autoprefixer は有効
    autoprefixer: {},
  },
};
