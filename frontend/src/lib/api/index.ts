import ky from "ky";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

import { ENV, KY_CONFIG } from "../constants";

export interface BaseApiAttributes {
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export type BaseApiMethods =
  | "get"
  | "patch"
  | "post"
  | "delete"
  | "all"
  | "head"
  | "put"
  | "options";

export const ApiClient = ky.create({
  prefixUrl: ENV.API_BASE_URL,
  credentials: "include",
  timeout: KY_CONFIG.TIMEOUT,
  retry: {
    limit: KY_CONFIG.RETRIES,
    methods: ["get", "head", "options"],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        try {
          const token = await getToken({
            req: request as NextRequest,
            secret: ENV.JWT_SECRET,
          });

          if (token?.accessToken) {
            request.headers.set("Authorization", `Bearer ${token.accessToken}`);
          }
        } catch {
          // Silently continue for public routes - no token needed
        }

        if (
          !request.headers.has("Content-Type") &&
          request.method !== "GET" &&
          request.method !== "HEAD"
        ) {
          request.headers.set("Content-Type", "application/json");
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          window.location.href = "/sign-in";
        }
        return response;
      },
    ],
  },
});

const BaseApiClient = (): {
  [K in BaseApiMethods]: <T>(
    baseApiAttributes: BaseApiAttributes
  ) => Promise<T>;
} => {
  const buildOptions = (attrs: BaseApiAttributes): RequestInit => {
    const { body, headers } = attrs;
    const options: RequestInit = {
      headers: {
        "app-id": "frontend",
        ...headers,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    return options;
  };

  return {
    get: async <T>(attrs: BaseApiAttributes) => {
      const url = attrs.path;
      const response = await ApiClient.get<T>(url, buildOptions(attrs));

      return response as T;
    },
    post: async <T>(attrs: BaseApiAttributes) => {
      const url = attrs.path;
      const response = await ApiClient.post<T>(url, buildOptions(attrs));

      return response as T;
    },
    patch: async <T>(attrs: BaseApiAttributes) => {
      const url = attrs.path;
      const response = await ApiClient.patch<T>(url, buildOptions(attrs));

      return response as T;
    },
    delete: async <T>(attrs: BaseApiAttributes) => {
      const url = attrs.path;
      const response = await ApiClient.delete<T>(url, buildOptions(attrs));

      return response as T;
    },
    all: async <T>() => Promise.resolve() as Promise<T>,
    head: async <T>() => Promise.resolve() as Promise<T>,
    put: async <T>() => Promise.resolve() as Promise<T>,
    options: async <T>() => Promise.resolve() as Promise<T>,
  };
};

export const BaseApi = BaseApiClient();
