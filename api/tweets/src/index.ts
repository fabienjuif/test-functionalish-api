import { startHttpServer } from "@tt/lib-controllers";
import { getCacheClient } from "@tt/lib-cache";
import { getPg } from "@tt/lib-postgres";
import { CONTROLLERS } from "./controllers";

const start = async () => {
  const pg = getPg({ user: "postgres", password: "coucou" });

  await startHttpServer(
    {
      // TODO: lazy cache instanciation
      cacheClient: await getCacheClient({ flushAll: true }),
      // TODO: lazy pg instanciation
      pg,
    },
    CONTROLLERS,
    // TODO: event emitter for drivers ?
    () => [pg.close()]
  );
};

start();
