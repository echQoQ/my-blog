import { defineUserConfig } from "vuepress";
import { searchProPlugin } from "vuepress-plugin-search-pro";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/my-blog/",

  lang: "zh-CN",
  title: "Mr.Liu",
  description: "我的博客",

  theme,

  plugins: [
    searchProPlugin({
      // your options
    }),
  ],

  // 和 PWA 一起启用
  // shouldPrefetch: false,


});
