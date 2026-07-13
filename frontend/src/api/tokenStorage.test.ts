import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

import {clearTokens, getAccessToken, getRefreshToken, saveTokens,} from "./tokenStorage";

function createLocalStorage(): Storage {
  let values: Record<string, string> = {};

  return {
    get length() {
      return Object.keys(values).length;
    },
    clear: () => {
      values = {};
    },
    getItem: (key: string) => values[key] ?? null,
    key: (index: number) => Object.keys(values)[index] ?? null,
    removeItem: (key: string) => {
      delete values[key];
    },
    setItem: (key: string, value: string) => {
      values[key] = value;
    },
  };
}

describe("tokenStorage", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createLocalStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("saves and reads auth tokens", () => {
    saveTokens({
      access: "access-token",
      refresh: "refresh-token",
    });

    expect(getAccessToken()).toBe("access-token");
    expect(getRefreshToken()).toBe("refresh-token");
  });

  it("clears auth tokens", () => {
    saveTokens({
      access: "access-token",
      refresh: "refresh-token",
    });

    clearTokens();

    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });
});
