import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/my-blog/",

  lang: "zh-CN",
  title: "Mr.Liu",
  description: "我的博客",

  theme,

  plugins: [
  ],

  // 和 PWA 一起启用
  // shouldPrefetch: false,


});
