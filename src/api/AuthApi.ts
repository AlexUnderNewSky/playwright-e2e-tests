import { type APIRequestContext } from '@playwright/test';

export interface Credentials {
  username: string;
  password: string;
}

export class AuthApi {
  constructor(private readonly request: APIRequestContext) {}

  login(credentials: Credentials, expiresInMins = 30) {
    return this.request.post('/auth/login', {
      data: { ...credentials, expiresInMins },
    });
  }

  me(accessToken?: string) {
    return this.request.get('/auth/me', {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
  }

  refresh(refreshToken: string) {
    return this.request.post('/auth/refresh', {
      data: { refreshToken },
    });
  }
}
