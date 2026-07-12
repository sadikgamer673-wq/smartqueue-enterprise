export interface ITokenPayload {
  userId: string;
  role: 'customer' | 'worker' | 'admin';
  storeId?: string;
  iat?: number;
  exp?: number;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}
