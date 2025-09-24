import { describe, it, expect } from 'vitest';
import { isSafeHttp } from '@/lib/og.js';

describe('URL Validation', () => {
  it('accepts http urls', () => {
    expect(isSafeHttp('http://example.com')).toBe(true);
  });

  it('accepts https urls', () => {
    expect(isSafeHttp('https://example.com')).toBe(true);
  });

  it('rejects ftp urls', () => {
    expect(isSafeHttp('ftp://example.com')).toBe(false);
  });

  it('rejects file urls', () => {
    expect(isSafeHttp('file:///etc/passwd')).toBe(false);
  });

  it('rejects data urls', () => {
    expect(isSafeHttp('data:text/html,<h1>hello</h1>')).toBe(false);
  });

  it('rejects javascript urls', () => {
    expect(isSafeHttp('javascript:alert(1)')).toBe(false);
  });

  it('rejects invalid urls', () => {
    expect(isSafeHttp('not-a-url')).toBe(false);
    expect(isSafeHttp('')).toBe(false);
  });
});
