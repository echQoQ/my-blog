import { defineUserConfig } from "vuepress";
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "sky-blog",
  description: "我的博客",

  plugins: [
    mdEnhancePlugin({
      katex: true,
    }),
  ],

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
