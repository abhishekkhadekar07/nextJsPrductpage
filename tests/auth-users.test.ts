/* @vitest-environment node */

import { registerUser, validateCredentials } from '@/lib/auth-users';

describe('lib/auth-users.ts', () => {
  it('rejects invalid signup input', async () => {
    const result = await registerUser('ab', '123');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe('validation');
    }
  });

  it('returns false for invalid credentials', async () => {
    await expect(validateCredentials('', '')).resolves.toBe(false);
    await expect(validateCredentials('unknown-user', 'wrong-password')).resolves.toBe(false);
  });
});
