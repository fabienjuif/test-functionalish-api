import { startHttpServer } from "@tt/lib-controllers";
import { getCacheClient } from "@tt/lib-cache";
import { getLogger } from "@tt/lib-logger";
import { getPg } from "@tt/lib-postgres";
import { CONTROLLERS } from "./controllers";

const start = async () => {
  const pg = getPg({ user: "postgres", password: "coucou" });

  await startHttpServer(
    {
      cacheClient: await getCacheClient({ flushAll: true }),
      logger: getLogger(),
      pg,
    },
    CONTROLLERS,
    () => [pg.close()]
  );
};

start();
