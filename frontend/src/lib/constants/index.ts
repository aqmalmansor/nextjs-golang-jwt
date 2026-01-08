export const ENV = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL!,
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
};

export const DEBUG_ENABLED = process.env.NODE_ENV !== "production";

export const KY_CONFIG = {
  TIMEOUT: 30_000,
  RETRIES: 2,
};

export const CATCH_ERROR = {
  COMMON: "Something went wrong!",
};

export const ERROR_NAME = {
  REFRESH_ACCESS_TOKEN: "RefreshAccessTokenError",
};

export const URL_QUERY_KEY = {
  FROM: "from",
};
