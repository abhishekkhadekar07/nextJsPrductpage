import { vi } from 'vitest';

type CookieMap = Record<string, string>;

export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

export const redirectMock = vi.fn((destination: string) => {
  throw new Error(`NEXT_REDIRECT:${destination}`);
});

export const notFoundMock = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND');
});

export const revalidateTagMock = vi.fn();
export const cacheTagMock = vi.fn();
export const cacheLifeMock = vi.fn();

const state = {
  pathname: '/',
  searchParams: new URLSearchParams(),
  params: {} as Record<string, string>,
  cookies: {} as CookieMap,
};

export function setPathname(pathname: string) {
  state.pathname = pathname;
}

export function setSearchParams(input?: Record<string, string> | URLSearchParams) {
  if (!input) {
    state.searchParams = new URLSearchParams();
    return;
  }
  state.searchParams = input instanceof URLSearchParams ? input : new URLSearchParams(input);
}

export function setParams(params: Record<string, string>) {
  state.params = { ...params };
}

export function setCookies(cookies: CookieMap) {
  state.cookies = { ...cookies };
}

export function getPathname() {
  return state.pathname;
}

export function getSearchParams() {
  return state.searchParams;
}

export function getParams() {
  return state.params;
}

export function getCookie(name: string) {
  if (Object.prototype.hasOwnProperty.call(state.cookies, name)) {
    return { name, value: state.cookies[name] };
  }
  return undefined;
}

export function resetNextMocks() {
  setPathname('/');
  setSearchParams();
  setParams({});
  setCookies({});

  mockRouter.push.mockReset();
  mockRouter.replace.mockReset();
  mockRouter.refresh.mockReset();
  mockRouter.prefetch.mockReset();

  redirectMock.mockReset();
  redirectMock.mockImplementation((destination: string) => {
    throw new Error(`NEXT_REDIRECT:${destination}`);
  });

  notFoundMock.mockReset();
  notFoundMock.mockImplementation(() => {
    throw new Error('NEXT_NOT_FOUND');
  });

  revalidateTagMock.mockReset();
  cacheTagMock.mockReset();
  cacheLifeMock.mockReset();
}
