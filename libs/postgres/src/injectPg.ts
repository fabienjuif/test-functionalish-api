import { Pool, PoolConfig } from "pg";

const pools: Map<string, Pool> = new Map();

export const close = async () => {
  await Array.from(pools.values()).map((pool) => pool.end());
};

export const injectPg =
  (config: PoolConfig) =>
  (fn: (drivers: any) => (...args: any[]) => Promise<any>) =>
  (drivers: any) => {
    const key = `${config.user ?? "postgres"}:${config.host ?? "localhost"}:${
      config.port ?? 5432
    }/${config.database ?? ""}`;

    let pool = pools.get(key);
    if (!pool) {
      console.log("[pg] Instanciating pool...");
      pool = new Pool(config);

      pool.on("error", (err, client) => {
        console.error("Unexpected error on idle client", err);
        process.exit(-1);
      });
    }

    return fn({
      ...drivers,
      pg: {
        query: async (...args: Parameters<Pool["query"]>) => {
          console.log("[pg]", args[0]);

          if (!pool) {
            throw new Error("[pg] Pool is destroyed");
          }

          return pool.query(...args);
        },
      },
    });
  };
