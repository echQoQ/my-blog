import { hopeTheme } from "vuepress-theme-hope";


import navbar from "./navbar.js";
//import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "https://echqoq.github.io/my-blog",

  author: {
    name: "Fancxx",
    url: "https://github.com/fancxx",
  },

  favicon: "/logo.ico",

  iconAssets: "fontawesome-with-brands",

  logo: "/logo.svg",

  repo: "fancxx/my-blog",

  docsDir: "src",

  // 导航栏
  navbar,

  // 侧边栏
  //sidebar,

  // 页脚
  footer: "青青子衿，悠悠我心",
  displayFooter: true,

  // 博客相关
  blog: {
    description: "一个人",
    //intro: "/intro.html",
    medias: {
      VuePressThemeHope: {
        icon: "https://theme-hope-assets.vuejs.press/logo.svg",
        link: "https://theme-hope.vuejs.press",
      },
    },
    articleInfo: [
      "Author",
      "Category",
      'Date',
      'Tag'
    ]
  },

  // 加密配置
  //encrypt: {
  //  config: {
  //    "/demo/encrypt.html": ["1234"],
  //  },
  //},

  // 多语言配置
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  // hotReload: true,

  // 在这里配置主题提供的插件
  plugins: {
    blog: true,

    comment: {
      provider: "Waline",
      serverURL: "https://my-waline-tan.vercel.app",
    },

    components: {
      components: ["Badge", "VPCard", "PDF", "BiliBili", "FontIcon", "Share", "SiteInfo", "CodePen"],
    },

    searchPro: true,

    mdEnhance: {
      align: true,
      attrs: true,
      component: true,
      demo: true,
      include: true,
      mark: true,
      plantuml: true,
      spoiler: true,
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tasklist: true,
      vPre: true,
    },
  }
});
