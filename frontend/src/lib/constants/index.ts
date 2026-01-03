export const ENV = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL!,
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
};

export const KY_CONFIG = {
  TIMEOUT: 30_000,
  RETRIES: 2,
};
