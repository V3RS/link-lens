import { request } from 'undici';
import { parse } from 'node-html-parser';

export function isSafeHttp(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function fetchHtml(url: string): Promise<string> {
  const { body } = await request(url, {
    headers: {
      'user-agent': 'OGPreviewerBot/1.0',
    },
    bodyTimeout: 7000,
    headersTimeout: 7000,
    maxRedirections: 2,
  });

  return body.text();
}

export function extractOg(html: string, baseUrl: string): 
  | { kind: 'ok'; imageUrl: string; title: string | null }
  | { kind: 'no_og' } {
  const root = parse(html);
  
  let imageUrl: string | null = null;
  let title: string | null = null;

  const ogImage = root.querySelector('meta[property="og:image"]');
  if (ogImage) {
    imageUrl = ogImage.getAttribute('content');
  }

  if (!imageUrl) {
    const twitterImage = root.querySelector('meta[name="twitter:image"]');
    if (twitterImage) {
      imageUrl = twitterImage.getAttribute('content');
    }
  }

  if (!imageUrl) {
    return { kind: 'no_og' };
  }

  if (imageUrl.startsWith('/')) {
    const base = new URL(baseUrl);
    imageUrl = `${base.protocol}//${base.host}${imageUrl}`;
  }

  const ogTitle = root.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    title = ogTitle.getAttribute('content');
  } else {
    const titleElement = root.querySelector('title');
    if (titleElement) {
      title = titleElement.text;
    }
  }

  return {
    kind: 'ok',
    imageUrl,
    title,
  };
}
