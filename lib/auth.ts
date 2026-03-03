export const AUTH_COOKIE_NAME = 'productpage_auth';
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const USERNAME_PATTERN = /^[a-z0-9._-]+$/;

export type AuthUser = {
  username: string;
};

export type SignupValidationResult =
  | {
    valid: true;
    username: string;
  }
  | {
    valid: false;
    message: string;
  };

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

function validateSignupInput(username: string, password: string): SignupValidationResult {
  const normalizedUsername = normalizeUsername(username);

  if (!normalizedUsername) {
    return { valid: false, message: 'Username is required' as const };
  }

  if (normalizedUsername.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters long' as const };
  }

  if (normalizedUsername.length > 30) {
    return { valid: false, message: 'Username must be at most 30 characters long' as const };
  }

  if (!USERNAME_PATTERN.test(normalizedUsername)) {
    return {
      valid: false,
      message: 'Username may only contain letters, numbers, dots, underscores, and dashes' as const,
    };
  }

  if (!password) {
    return { valid: false, message: 'Password is required' as const };
  }

  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' as const };
  }

  if (password.length > 100) {
    return { valid: false, message: 'Password must be at most 100 characters long' as const };
  }

  return { valid: true, username: normalizedUsername };
}

export { validateSignupInput };

export function createAuthCookieValue(username: string) {
  return encodeURIComponent(username);
}

export function parseAuthCookieValue(value: string | undefined): AuthUser | null {
  if (!value) return null;
  try {
    const username = decodeURIComponent(value);
    return username ? { username } : null;
  } catch {
    return null;
  }
}

export function isSafeRedirect(target?: string): target is string {
  if (!target) return false;
  if (typeof target !== 'string') return false;
  if (!target.startsWith('/')) return false;
  if (target.startsWith('//')) return false;
  return true;
}

export function resolveRedirect(target: string | undefined, fallback = '/products'): string {
  return isSafeRedirect(target) ? target : fallback;
}
