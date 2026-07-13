import type {AuthTokenPair} from "./types";

const ACCESS_TOKEN_KEY = "easecook.accessToken";
const REFRESH_TOKEN_KEY = "easecook.refreshToken";

function getStorage(): Storage | null {
  if (typeof globalThis.localStorage === "undefined") {
    return null;
  }

  return globalThis.localStorage;
}

export function saveTokens(tokens: AuthTokenPair): void {
  const storage = getStorage();

  storage?.setItem(ACCESS_TOKEN_KEY, tokens.access);
  storage?.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
}

export function getAccessToken(): string | null {
  return getStorage()?.getItem(ACCESS_TOKEN_KEY) ?? null;
}

export function getRefreshToken(): string | null {
  return getStorage()?.getItem(REFRESH_TOKEN_KEY) ?? null;
}

export function clearTokens(): void {
  const storage = getStorage();

  storage?.removeItem(ACCESS_TOKEN_KEY);
  storage?.removeItem(REFRESH_TOKEN_KEY);
}
