export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthTokenPair {
  access: string;
  refresh: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email?: string;
  password: string;
  display_name?: string;
}
