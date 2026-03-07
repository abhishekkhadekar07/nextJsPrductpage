import React from 'react';
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import {
  cacheLifeMock,
  cacheTagMock,
  getCookie,
  getParams,
  getPathname,
  getSearchParams,
  mockRouter,
  notFoundMock,
  redirectMock,
  revalidateTagMock,
  resetNextMocks,
} from './mocks/next';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) =>
    React.createElement('a', { href, ...props }, children),
}));

vi.mock('next/image', () => ({
  default: ({
    alt = '',
    src = '',
    ...props
  }: {
    alt?: string;
    src?: string;
    unoptimized?: boolean;
  }) => {
    const { unoptimized, ...imageProps } = props;
    void unoptimized;
    return React.createElement('img', { alt, src, ...imageProps });
  },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => getPathname(),
  useSearchParams: () => getSearchParams(),
  useParams: () => getParams(),
  redirect: redirectMock,
  notFound: notFoundMock,
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({
    get: (name: string) => getCookie(name),
  })),
}));

vi.mock('next/cache', () => ({
  revalidateTag: revalidateTagMock,
  cacheTag: cacheTagMock,
  cacheLife: cacheLifeMock,
}));

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono' }),
}));

afterEach(() => {
  resetNextMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
