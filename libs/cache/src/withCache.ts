type DriversWithCache = {
  cache: {
    set: (key: string, data: any) => Promise<void>;
  };
  [key: string]: any;
};

export const withCache =
  (keyResolver: (...args: any[]) => string, ttl: string) =>
  (fn: (drivers: DriversWithCache) => (...args: any[]) => unknown) =>
  (drivers: Partial<Omit<DriversWithCache, "cache">>) => {
    const driversWithCache = {
      ...drivers,
      cache: drivers.cacheClient,
    };

    return async (...args: any[]): Promise<any> => {
      const key = keyResolver(...args);

      console.log("[cache] looking for", key);

      const o = await driversWithCache.cache.get(key);
      if (o) {
        console.log("[cache] HIT!", key);
        try {
          return JSON.parse(o);
        } catch {
          await driversWithCache.cache.del([key]);
        }
      }

      console.log("[cache] not hit", key);

      const res = await fn(driversWithCache)(...args);

      if (res) {
        await driversWithCache.cache.set(key, JSON.stringify(res));
      }

      return res;
    };
  };
