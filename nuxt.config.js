export default {
  serverMiddleware: [
    { path: "/api", handler: "~/server-middleware/api/index.js" },
  ],
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "%s | Feliformia",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "description", hid: "description", content: "吾等貓毛輪值表" },
      { property: "og:description", content: "吾等貓毛輪值表" },
      { property: "og:type", content: "website" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Noto+Sans+TC:400,500,700|Oswald:500&display=swap",
      },
    ],
    script: [
      {
        // src: "/js/media.js",
        // mode: 'client',
        // defer: true,
      },
    ],
  },
  noscript: [
    {
      innerHTML:
        '<img src="https://d5nxst8fruw4z.cloudfront.net/atrk.gif?account=IH0Jm1akKd60T3" style="display:none" height="1" width="1" alt="" />',
    },
  ],
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: ["element-ui/lib/theme-chalk/index.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/element-ui/element-ui",
    {
      src: "~/plugins/axios",
      ssr: true,
    },
    // { src: '~/static/js/media.js',
    //   mode: 'client',
    //   defer: true
    // }
  ],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/axios", "@nuxtjs/dayjs"],

  /**
   * @nuxtjs/axios 設定預設
   */
  axios: {
    baseUrl: process.env.BASE_URL || "/api",
  },

  /**
   * @nuxtjs/dayjs 設定預設
   */
  dayjs: {
    locales: ["zh-tw", "en"],
    defaultLocale: "en",
    defaultTimeZone: "Asia/Taipei",
    plugins: [
      "utc", // import 'dayjs/plugin/utc'
      "timezone", // import 'dayjs/plugin/timezone'
    ], // Your Day.js plugin
  },

  // env using in Nuxt
  env: {
    releaseDate: process.env.RELEASE_DATE,
  },

  /*
   ** Build configuration
   */
  build: {
    vendor: ["axios", "qs"],
    /*
     ** You can extend webpack config here
     */
    extend(config, { isDev }) {
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/,
        });
      }
    },
    vendor: ["element-ui"],
  },
};
