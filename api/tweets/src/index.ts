import { startHttpServer } from "@tt/lib-controllers";
import { getCacheClient } from "@tt/lib-cache";
import { getLogger } from "@tt/lib-logger";
import { CONTROLLERS } from "./controllers";

const start = async () =>
  startHttpServer(
    {
      cacheClient: await getCacheClient({ flushAll: true }),
      logger: getLogger(),
    },
    CONTROLLERS
  );

start();
