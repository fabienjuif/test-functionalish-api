import { createClient } from 'redis';

type Cache = ReturnType<typeof createClient>;

type DriversWithCache = {
  getCache: () => Promise<Cache>;
  [key: string]: any;
};

const caches: Map<string, Cache> = new Map();

export const withCache = (
  name: string,
  keyResolver: (...args: any[]) => string,
  { flushAll }: { flushAll?: boolean } = {},
) => {
  const getCache = async () => {
    let cache = caches.get(name);

    if (!cache) {
      console.log('[cache] create cache', name);
      cache = await createClient();
      await cache.connect();
      if (flushAll) {
        await cache.flushAll();
      }
      caches.set(name, cache);
    }

    return cache;
  };

  return (fn: (drivers: DriversWithCache) => (...args: any[]) => unknown) =>
    (drivers: Partial<Omit<DriversWithCache, 'cache'>>) => {
      console.log('[cache] inject');
      const fnDrivers = fn({
        ...drivers,
        getCache,
      });

      return async (...args: any[]): Promise<any> => {
        const cache = await getCache();

        const key = keyResolver(...args);
        const fullKey = `${name}:${key}`;

        console.log('[cache] looking for', fullKey);

        const o = await cache.get(fullKey);
        if (o) {
          console.log('[cache] HIT!', fullKey);
          try {
            return JSON.parse(o);
          } catch {
            await cache.del([fullKey]);
          }
        }

        console.log('[cache] not hit', fullKey);

        const res = await fnDrivers(...args);

        if (res) {
          await cache.set(fullKey, JSON.stringify(res));
        }

        return res;
      };
    };
};
