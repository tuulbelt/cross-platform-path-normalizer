import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Cross-Platform Path Normalizer',
  description: 'Convert Windows/Unix paths to consistent format with zero dependencies',
  base: '/tuulbelt/',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/reference' },
      { text: 'GitHub', link: 'https://github.com/tuulbelt/tuulbelt/tree/main/cross-platform-path-normalizer' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is it?', link: '/guide/what-is-it' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' }
          ]
        },
        {
          text: 'Usage',
          items: [
            { text: 'CLI Usage', link: '/guide/cli-usage' },
            { text: 'Library Usage', link: '/guide/library-usage' },
            { text: 'Examples', link: '/guide/examples' }
          ]
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Edge Cases', link: '/guide/edge-cases' },
            { text: 'Best Practices', link: '/guide/best-practices' },
            { text: 'Troubleshooting', link: '/guide/troubleshooting' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/reference' },
            { text: 'normalizePath()', link: '/api/normalize-path' },
            { text: 'normalizeToUnix()', link: '/api/normalize-to-unix' },
            { text: 'normalizeToWindows()', link: '/api/normalize-to-windows' },
            { text: 'detectPathFormat()', link: '/api/detect-path-format' },
            { text: 'Types', link: '/api/types' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tuulbelt/tuulbelt' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Tuulbelt'
    },

    search: {
      provider: 'local'
    }
  }
})
