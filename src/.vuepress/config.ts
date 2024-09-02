import { defineUserConfig } from "vuepress";
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/my-blog/",

  lang: "zh-CN",
  title: "sky-blog",
  description: "我的博客",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
