import { Submission } from '../types';
import { SAMPLE_IMAGES, MOCK_URLS } from '../constants';
import { getDomainFromUrl, createPastDate } from '../utils';

export const fetchOpenGraphData = async (url: string): Promise<Partial<Submission>> => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  if (url.includes('error') || Math.random() < 0.1) {
    return {
      status: 'failed',
      error: 'Failed to fetch data'
    };
  }
  
  if (url.includes('noimage') || Math.random() < 0.2) {
    return {
      status: 'no image found',
      title: url.includes('nytimes') 
        ? 'The New York Times - Breaking News, US News, World News' 
        : `${getDomainFromUrl(url)} - Website`
    };
  }

  const title = generateTitleFromUrl(url);
  
  return {
    status: 'complete',
    title,
    imageUrl: SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)]
  };
};

function generateTitleFromUrl(url: string): string {
  if (url.includes('getluna.com')) {
    return 'Luna Care: Physical therapy, delivered to you';
  } else if (url.includes('github')) {
    return 'GitHub: Where the world builds software';
  } else if (url.includes('twitter') || url.includes('x.com')) {
    return "X. It's what's happening";
  } else {
    return `${getDomainFromUrl(url)} - Website Title`;
  }
}

export const generateMockData = (): Submission[] => {
  return MOCK_URLS.map((url, index) => {
    const submission: Submission = {
      id: `mock_${Date.now()}_${index}`,
      url,
      status: 'complete',
      createdAt: createPastDate(index * 2)
    };

    if (url.includes('noimage')) {
      submission.status = 'no image found';
      submission.title = `${getDomainFromUrl(url)} - Website`;
    } else if (url.includes('error')) {
      submission.status = 'failed';
      submission.error = 'Failed to fetch data';
    } else if (index === 8) {
      submission.status = 'processing';
    } else if (index === 9) {
      submission.status = 'queued';
    } else {
      submission.status = 'complete';
      submission.imageUrl = SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)];
      submission.title = generateMockTitle(url);
    }

    return submission;
  });
};

function generateMockTitle(url: string): string {
  const titleMap: Record<string, string> = {
    'github': 'GitHub: Where the world builds software',
    'twitter': "X. It's what's happening",
    'netflix': 'Netflix - Watch TV Shows Online, Watch Movies Online',
    'medium': 'Medium – Where good ideas find you',
    'dev.to': 'DEV Community',
    'dribbble': "Dribbble - Discover the World's Top Designers & Creative Professionals",
    'behance': 'Behance :: For You',
    'nytimes': 'The New York Times - Breaking News, US News, World News',
    'spotify': 'Spotify - Web Player: Music for everyone',
    'airbnb': 'Vacation Homes & Condo Rentals - Airbnb',
  };

  for (const [key, title] of Object.entries(titleMap)) {
    if (url.includes(key)) return title;
  }

  return `${getDomainFromUrl(url)} - Website Title`;
}