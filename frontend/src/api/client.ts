import {getAccessToken} from "./tokenStorage";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

interface ApiRequestOptions extends RequestInit {
  auth?: boolean;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function buildApiUrl(path: string): string {
  const baseUrl = API_BASE_URL.replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");

  return `${baseUrl}/${cleanPath}`;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const accessToken = getAccessToken();
  if (options.auth !== false && accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    throw new ApiError(response.status, "API request failed.", data);
  }

  return data as T;
}
