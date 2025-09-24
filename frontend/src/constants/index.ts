export const PAGINATION = {
  ITEMS_PER_PAGE: 4,
  DEFAULT_PAGE: 1,
} as const;

export const THEME = {
  DEFAULT: 'dark' as const,
  STORAGE_KEY: 'theme',
  CLASS_NAME: 'light-mode',
} as const;


const STATUS_MAP = {
  'QUEUED': 'queued',
  'PROCESSING': 'processing', 
  'COMPLETE': 'complete',
  'NO_OG': 'no image found',
  'FAILED': 'failed'
} as const;

export const API = {
  BASE_URL: 'http://localhost:3000',
  STATUS_MAP,
  convertSubmission: (item: any) => ({
    id: item.id,
    url: item.url,
    status: STATUS_MAP[item.status as keyof typeof STATUS_MAP] || 'failed',
    title: item.ogTitle || null,
    imageUrl: item.ogImageUrl || null,
    error: item.error || null,
    createdAt: new Date(item.createdAt).toISOString()
  })
} as const;

export const EXTERNAL_LINKS = {
  GITHUB: 'https://github.com/V3RS/link-lens',
  PORTFOLIO: 'https://vsingh.dev/',
} as const;

export const STORAGE_KEYS = {
  THEME: 'theme',
} as const;
