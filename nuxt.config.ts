// import colors from 'vuetify/es5/util/colors'
import { resolve } from 'path'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - jmt-blog',
    title: 'jmt-blog',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/content-format.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
    // https://purgecss.com/guides/nuxt.html
    // 'nuxt-purgecss'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content'
  ],

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  /*
  content: {
    markdown: {
      remarkPlugins: [
        ['~/plugins/unified-plugin-reimport', { module: 'remark-math' }],
        ['~/plugins/unified-plugin-reimport', { module: 'remark-mermaid' }],
        ['~/plugins/unified-plugin-reimport', { module: 'remark-gfm' }],
        ['~/plugins/unified-plugin-reimport', { module: 'remark-github' }],
        ['~/plugins/unified-plugin-reimport', { module: 'remark-behead', options: { depth: 1 } }]
      ],
      rehypePlugins: [
        ['~/plugins/unified-plugin-reimport', { module: 'rehype-mathjax' }]

      ]
    }
  },
  */

  hooks: {
    'content:options' (options: any) {
      async function pushDepRemark (opts: any, name: string, pluginOptions: any, targetFun: any = (m:any) => m.default) {
        const instance = targetFun((await import(name)))
        opts.markdown.remarkPlugins.push({ instance, name, options: pluginOptions })
      }
      async function pushDepRehype (opts: any, name: string, pluginOptions: any, targetFun: any = (m:any) => m.default) {
        const instance = targetFun((await import(name)))
        opts.markdown.rehypePlugins.push({ instance, name, options: pluginOptions })
      }

      // Remark
      pushDepRemark(options, 'remark-math', undefined)
      options.markdown.remarkPlugins.push({
        instance: require(resolve(__dirname, 'plugins/remark-shitty-mermaid')),
        name: 'remark-shitty-mermaid',
        options: undefined
      })
      pushDepRemark(options, 'remark-github', undefined)
      pushDepRemark(options, 'remark-behead', { depth: 1 })
      pushDepRemark(options, 'remark-gfm', { singleTilde: false })
      // Rehype
      pushDepRehype(options, 'rehype-mathjax', undefined)
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      options: {
        customProperties: true
      },
      dark: true
      /*
      themes: {
        dark: {
          primary: `#607d8b`,
          secondary: `#3f51b5`,
          accent: `#673ab7`,
          error: `#f44336`,
          warning: `#ffc107`,
          info: `#03a9f4`,
          success: `#4caf50`
        }
      }
      */
    }
  },

  /*
  // https://nuxtjs.org/docs/features/configuration/#postcss-plugins
  postcss: {
    plugins: {
      'postcss-import': true,
    }
  },
  */

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true,
    optimizeCSS: true,
    quiet: false,
    // standalone: true,
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
        minifyURLs: true,
        removeComments: true,
        removeEmptyElements: true
      }
    },
    optimization: {
      mangleWasmImports: true,
      mergeDuplicateChunks: true,
      usedExports: true,
      minimize: true,
      splitChunks: {
        chunks: 'all',
        maxSize: 100000
        /*
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(css|vue)$/,
            chunks: 'all',
            enforce: true
          }
        }
        */
      }
    }
  },

  // https://nuxtjs.org/docs/configuration-glossary/configuration-generate
  generate: {
    async routes () {
      interface contentStub {
        slug: string
      }
      const { $content } = require('@nuxt/content')
      const blogs = await $content('blog').only(['slug']).fetch() as [contentStub]
      const blogRoutes = blogs.map(page => 'blog/' + page.slug)
      return blogRoutes
    }
  }
}
