import { startHttpServer } from "@tt/lib-controllers";
import { getCacheClient } from "@tt/lib-cache";
import { getPg } from "@tt/lib-postgres";
import { CONTROLLERS } from "./controllers";

const start = async () => {
  const pg = getPg({ user: "postgres", password: "coucou" });

  await startHttpServer(
    {
      cacheClient: await getCacheClient({ flushAll: true }),
      pg,
    },
    CONTROLLERS,
    () => [pg.close()]
  );
};

start();
