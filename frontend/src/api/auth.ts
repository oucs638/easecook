import {apiRequest} from "./client";
import {clearTokens, saveTokens} from "./tokenStorage";
import type {AuthTokenPair, LoginPayload, RegisterPayload, User} from "./types";

export async function registerUser(payload: RegisterPayload): Promise<User> {
  return apiRequest<User>("/auth/register/", {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload),
  });
}

export async function login(payload: LoginPayload): Promise<AuthTokenPair> {
  const tokens = await apiRequest<AuthTokenPair>("/auth/token/", {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload),
  });

  saveTokens(tokens);
  return tokens;
}

export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>("/auth/me/");
}

export function logout(): void {
  clearTokens();
}
