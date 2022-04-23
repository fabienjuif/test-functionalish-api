import { Pool, PoolConfig } from "pg";

type PgDriver = {
  query: Pool["query"];
  collection: (tableName: string) => {
    getById: <T>(ids: Record<string, unknown>) => Promise<T | undefined>;
  };
};

type MinimalPgDriver = Omit<PgDriver, "collection">;

type DriversWithPg = {
  pg: PgDriver;
  [key: string]: unknown;
};

const pools: Map<string, Pool> = new Map();

export const close = async () => {
  await Array.from(pools.values()).map((pool) => pool.end());
};

export const getById =
  ({ pg }: Omit<DriversWithPg, "pg"> & { pg: MinimalPgDriver }) =>
  (tableName: string) =>
  async <T>(ids: Record<string, unknown>): Promise<T | undefined> => {
    const idsEntries = Object.entries(ids);
    const where = idsEntries.reduce(
      (acc, [key], index) => `${acc} ${key}=$${index + 1}`,
      ""
    );

    const q = `select * from ${tableName} where ${where}`;
    const res = await pg.query(
      q,
      idsEntries.map(([, value]) => value)
    );

    if (res.rowCount > 1) {
      throw new Error(`[pg] Multiple rows found on getById for where=${where}`);
    }

    if (res.rowCount <= 0) {
      return undefined;
    }

    return res.rows[0] as T;
  };

export const injectPg =
  (config: PoolConfig) =>
  (fn: (drivers: DriversWithPg) => (...args: any[]) => Promise<any>) =>
  (drivers: any) => {
    const key = `${config.user ?? "postgres"}:${config.host ?? "localhost"}:${
      config.port ?? 5432
    }/${config.database ?? ""}`;

    let pool = pools.get(key);
    if (!pool) {
      console.log("[pg] Instanciating pool...");
      pool = new Pool(config);

      pool.on("error", (err, client) => {
        console.error("[pg] Unexpected error on idle client", err);
        process.exit(-1);
      });
    }

    const minimalPgDriver: MinimalPgDriver = {
      query: (async (...args: Parameters<Pool["query"]>) => {
        console.log("[pg]", args[0]);

        if (!pool) {
          throw new Error("[pg] Pool is destroyed");
        }

        return pool.query(...args);
      }) as Pool["query"],
    };

    const pgDriver: PgDriver = {
      ...minimalPgDriver,
      collection: (tableName: string) => {
        const helperDrivers = { ...drivers, pg: minimalPgDriver };

        return {
          getById: getById(helperDrivers)(tableName),
        };
      },
    };

    return fn({
      ...drivers,
      pg: pgDriver,
    });
  };
