import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

import {login} from "./auth";
import {getAccessToken, getRefreshToken} from "./tokenStorage";

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

describe("auth API helpers", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("localStorage", createLocalStorage());
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("saves tokens after login", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          access: "access-token",
          refresh: "refresh-token",
        }),
        {
          status: 200,
        },
      ),
    );

    const tokens = await login({
      username: "demo_user",
      password: "Strong-test-pass-123",
    });

    expect(tokens.access).toBe("access-token");
    expect(tokens.refresh).toBe("refresh-token");
    expect(getAccessToken()).toBe("access-token");
    expect(getRefreshToken()).toBe("refresh-token");
  });
});
