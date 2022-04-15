import { createClient } from "redis";

export type DriversWithCacheClient = {
  cacheClient: ReturnType<typeof createClient>;
  [key: string]: any;
};

type WithCacheClientOptions = {
  flushAll?: boolean;
};

export const withCacheClient = ({ flushAll }: WithCacheClientOptions = {}) => {
  let cacheClient: DriversWithCacheClient["cacheClient"];
  const init = async () => {
    if (!cacheClient) {
      cacheClient = await createClient();
      await cacheClient.connect();

      if (flushAll) {
        await cacheClient.flushAll();
      }
    }

    return cacheClient;
  };

  return (
      fn: (drivers: DriversWithCacheClient) => (...args: any[]) => unknown
    ) =>
    (drivers: Partial<Omit<DriversWithCacheClient, "cacheClient">>) =>
    async (...args: any[]) => {
      return fn({
        ...drivers,
        cacheClient: await init(),
      })(...args);
    };
};
