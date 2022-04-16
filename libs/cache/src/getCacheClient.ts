import { createClient } from "redis";

export type DriversWithCacheClient = {
  cacheClient: ReturnType<typeof createClient>;
  [key: string]: any;
};

type WithCacheClientOptions = {
  flushAll?: boolean;
};

export const getCacheClient = async ({
  flushAll,
}: WithCacheClientOptions = {}) => {
  const cacheClient = await createClient();
  await cacheClient.connect();

  if (flushAll) {
    await cacheClient.flushAll();
  }

  return cacheClient;
};
