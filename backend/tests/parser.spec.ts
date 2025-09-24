import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { extractOg } from '@/lib/og.js';

describe('OG Parser', () => {
  const readFixture = (name: string) => {
    return readFileSync(resolve(__dirname, 'fixtures', name), 'utf-8');
  };

  it('finds og:image and og:title', () => {
    const html = readFixture('html-og.html');
    const result = extractOg(html, 'https://site.com');
    
    expect(result).toEqual({
      kind: 'ok',
      imageUrl: 'https://site.com/img/card.png',
      title: 'OG Title'
    });
  });

  it('falls back to twitter:image', () => {
    const html = readFixture('html-twitter.html');
    const result = extractOg(html, 'https://example.com');
    
    expect(result).toEqual({
      kind: 'ok',
      imageUrl: 'https://example.com/twitter-card.png',
      title: 'Twitter Title'
    });
  });

  it('resolves relative image path against base', () => {
    const html = '<html><head><meta property="og:image" content="/relative.png"></head></html>';
    const result = extractOg(html, 'https://test.com');
    
    expect(result).toEqual({
      kind: 'ok',
      imageUrl: 'https://test.com/relative.png',
      title: null
    });
  });

  it('returns no_og when neither exists', () => {
    const html = readFixture('html-no-tags.html');
    const result = extractOg(html, 'https://site.com');
    
    expect(result).toEqual({
      kind: 'no_og'
    });
  });
});
