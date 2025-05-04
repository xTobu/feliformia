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
      { name: "viewport", content: "width=device-width, initial-scale=1, user-scalable=no, maximum-scale=1.0" },
      { name: "description", hid: "description", content: "志工輪值表" },
      {
        hid: "og:title",
        property: "og:title",
        content: "吾等與貓毛 Feliformia",
      },
      { property: "og:description", content: "志工輪值表" },
      { property: "og:site_name", content: "吾等與貓毛 Feliformia" },
      { hid: "og:type", property: "og:type", content: "website" },
      {
        hid: "og:url",
        property: "og:url",
        content: "https://catswith.vercel.app/",
      },
      {
        hid: "og:image",
        property: "og:image",
        content: "/share.jpeg",
      },
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
  css: ["element-ui/lib/theme-chalk/index.css", "animate.css/animate.min.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/element-ui/element-ui",
    {
      src: "~/plugins/axios",
      ssr: true,
    },
    {
      src: "~/plugins/supabase.client.js",
      mode: "client",
      ssr: false,
    },
    // { src: '~/static/js/media.js',
    //   mode: 'client',
    //   defer: true
    // }
  ],
  publicRuntimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabasePublicKey: process.env.SUPABASE_PUBLIC_KEY,
  },

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/axios", "@nuxtjs/dayjs", "vue-sweetalert2/nuxt"],

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
    ],
  },

  // env using in Nuxt
  env: {
    releaseDate: process.env.RELEASE_DATE,
    disabledDays: process.env.DISABLED_DAYS,
    deploySite: process.env.DEPLOY_SITE,
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
