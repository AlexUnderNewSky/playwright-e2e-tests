import { test, expect } from '@fixtures/api';
import { errorSchema, loginResponseSchema, userSchema } from '@api/schemas';
import { apiUser } from '@data/apiUsers';

test.describe('Auth API', () => {
  test('returns tokens for valid credentials', { tag: '@smoke' }, async ({ authApi }) => {
    const response = await authApi.login(apiUser);

    expect(response.status()).toBe(200);
    const body = loginResponseSchema.parse(await response.json());
    expect(body.username).toBe(apiUser.username);
  });

  test('rejects invalid credentials', async ({ authApi }) => {
    const response = await authApi.login({ ...apiUser, password: 'wrong-password' });

    expect(response.status()).toBe(400);
    const body = errorSchema.parse(await response.json());
    expect(body.message).toBe('Invalid credentials');
  });

  test('returns current user for a valid token', async ({ authApi }) => {
    const login = await authApi.login(apiUser);
    const { accessToken } = loginResponseSchema.parse(await login.json());

    const response = await authApi.me(accessToken);

    expect(response.status()).toBe(200);
    const user = userSchema.parse(await response.json());
    expect(user.username).toBe(apiUser.username);
  });

  test('denies access without a token', async ({ authApi }) => {
    const response = await authApi.me();

    expect(response.status()).toBe(401);
  });

  test('denies access with an invalid token', async ({ authApi }) => {
    test.fail(true, 'Known issue: API responds with 500 instead of 401 for a malformed token');

    const response = await authApi.me('invalid.token.value');

    expect(response.status()).toBe(401);
  });

  test('refreshes access token', async ({ authApi }) => {
    const login = await authApi.login(apiUser);
    const { refreshToken } = loginResponseSchema.parse(await login.json());

    const response = await authApi.refresh(refreshToken);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.accessToken).toEqual(expect.any(String));
    expect(body.refreshToken).toEqual(expect.any(String));
  });
});
