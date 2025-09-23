export const PAGINATION = {
  ITEMS_PER_PAGE: 4,
} as const;

export const THEME = {
  DEFAULT: 'dark' as const,
  STORAGE_KEY: 'theme',
  CLASS_NAME: 'light-mode',
} as const;

export const SUBMISSION = {
  ID_PREFIX: 'sub_',
  PROCESSING_DELAY: 1000,
  ERROR_MESSAGE: 'Failed to fetch data. Please try again.',
} as const;

export const EXTERNAL_LINKS = {
  GITHUB: 'https://github.com',
  PORTFOLIO: 'https://vsingh.dev/',
} as const;

export const STORAGE_KEYS = {
  SUBMISSIONS: 'submissions',
  THEME: 'theme',
} as const;

export const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
  'https://images.unsplash.com/photo-1581276879432-15e50529f34b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
] as const;

export const MOCK_URLS = [
  'https://github.com/features',
  'https://netflix.com',
  'https://twitter.com/home',
  'https://noimage.example.com',
  'https://error.example.com',
  'https://medium.com',
  'https://dev.to',
  'https://dribbble.com',
  'https://behance.net',
  'https://nytimes.com',
  'https://spotify.com',
  'https://airbnb.com',
] as const;
