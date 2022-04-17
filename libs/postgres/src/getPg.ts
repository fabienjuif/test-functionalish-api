import { Pool, PoolConfig } from "pg";

export const getPg = (config?: PoolConfig) => {
  console.log("Instanciating pg pool...");
  const pool = new Pool(config);

  pool.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
  });

  const close = async () => {
    await pool.end();
  };

  const query = async (...args: Parameters<Pool["query"]>) => {
    console.log("[pg]", args[0]);
    return pool.query(...args);
  };

  return { pool, close, query };
};
