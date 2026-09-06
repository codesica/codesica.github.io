import type { ThemeConfig } from '@/types'

export const themeConfig: ThemeConfig = {
  site: {
    title: 'Kai',
    subtitle: '写代码，做东西，想清楚。',
    description: 'Kai 的个人博客，记录技术实践、独立开发与思考。',
    i18nTitle: false,
    author: 'Kai',
    url: 'https://codesica.github.io',
    base: '/',
    favicon: '/icons/favicon.svg',
  },
  color: {
    mode: 'auto',
    light: {
      primary: 'oklch(25% 0 0)',
      secondary: 'oklch(43% 0 0)',
      background: 'oklch(99% 0.002 95)',
      highlight: 'oklch(90% 0 0 / 0.6)',
    },
    dark: {
      primary: 'oklch(92% 0 0)',
      secondary: 'oklch(76% 0 0)',
      background: 'oklch(21% 0 0)',
      highlight: 'oklch(45% 0 0 / 0.5)',
    },
  },
  global: {
    locale: 'zh',
    moreLocales: [],
    fontStyle: 'sans',
    dateFormat: 'YYYY-MM-DD',
    toc: true,
    katex: true,
    reduceMotion: true,
  },
  comment: {
    enabled: false,
    giscus: {
      repo: '', repoId: '', category: '', categoryId: '',
      mapping: 'pathname', strict: '0', reactionsEnabled: '0',
      emitMetadata: '0', inputPosition: 'bottom',
    },
    twikoo: { envId: '' },
    waline: { serverURL: '', emoji: [], search: false, imageUploader: false },
  },
  seo: {
    twitterID: '',
    verification: { google: '', bing: '', yandex: '', baidu: '' },
    googleAnalyticsID: '',
    umamiAnalyticsID: '',
    folo: { feedID: '', userID: '' },
    apiflashKey: '',
  },
  footer: {
    links: [
      { name: 'RSS', url: '/atom.xml' },
      { name: 'GitHub', url: 'https://github.com/codesica' },
    ],
    startYear: 2026,
  },
  preload: {
    imageHostURL: '',
    customGoogleAnalyticsJS: '',
    customUmamiAnalyticsJS: '',
  },
}

export const base = themeConfig.site.base === '/' ? '' : themeConfig.site.base.replace(/\/$/, '')
export const defaultLocale = themeConfig.global.locale
export const moreLocales = themeConfig.global.moreLocales
export const allLocales = [defaultLocale, ...moreLocales]
