import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

import {ApiError, apiRequest} from "./client";
import {saveTokens} from "./tokenStorage";

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

describe("apiRequest", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("localStorage", createLocalStorage());
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("adds bearer token when auth is enabled", async () => {
    saveTokens({
      access: "access-token",
      refresh: "refresh-token",
    });
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ok: true}), {
        status: 200,
      }),
    );

    await apiRequest<{ ok: boolean }>("/test/");

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Headers;

    expect(headers.get("Authorization")).toBe("Bearer access-token");
  });

  it("throws ApiError for failed requests", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({detail: "Invalid request."}), {
        status: 400,
      }),
    );

    await expect(apiRequest("/bad-request/", {auth: false})).rejects.toEqual(
      new ApiError(400, "API request failed.", {
        detail: "Invalid request.",
      }),
    );
  });
});
