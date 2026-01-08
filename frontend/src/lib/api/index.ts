import ky from "ky";
import { Session } from "next-auth";

import { ENV, KY_CONFIG } from "../constants";

export interface BaseApiAttributes {
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
  session?: Session;
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
    const { body, headers, session } = attrs;

    const finalHeaders = { ...headers };

    if (session) {
      finalHeaders.Authorization = `Bearer ${session.accessToken}`;
    }

    const options: RequestInit = { headers: finalHeaders };

    if (body) {
      options.body = JSON.stringify(body);
    }

    return options;
  };

  return {
    get: async <T>(attrs: BaseApiAttributes) => {
      const url = attrs.path;
      const response = await ApiClient.get<T>(url, buildOptions(attrs))
        .then((res) => res.json())
        .catch((e) => e);

      return response;
    },
    post: async <T>(attrs: BaseApiAttributes) => {
      const url = attrs.path;
      const response = await ApiClient.post(url, buildOptions(attrs))
        .then((res) => res.json())
        .catch((e) => e);

      return response as Promise<T>;
    },
    patch: async <T>(attrs: BaseApiAttributes) => {
      const url = attrs.path;
      const response = await ApiClient.patch<T>(url, buildOptions(attrs))
        .then((res) => res.json())
        .catch((e) => e);

      return response as Promise<T>;
    },
    delete: async <T>(attrs: BaseApiAttributes) => {
      const url = attrs.path;
      const response = await ApiClient.delete<T>(url, buildOptions(attrs))
        .then((res) => res.json())
        .catch((e) => e);

      return response as Promise<T>;
    },
    all: async <T>() => Promise.resolve() as Promise<T>,
    head: async <T>() => Promise.resolve() as Promise<T>,
    put: async <T>() => Promise.resolve() as Promise<T>,
    options: async <T>() => Promise.resolve() as Promise<T>,
  };
};

export const BaseApi = BaseApiClient();
