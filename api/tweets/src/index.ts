import createFastify from "fastify";
import { getCacheClient } from "@tt/lib-cache";
import { CONTROLLERS } from "./controllers";
import { getLogger } from "@tt/lib-logger";

// Run the server!
const start = async () => {
  const drivers = {
    fastify: createFastify({ logger: false }),
    cacheClient: await getCacheClient({ flushAll: true }),
    logger: getLogger(),
  };

  type Drivers = typeof drivers;

  const init = (controllers: ((drivers: Drivers) => any)[]) => {
    controllers.forEach((controller) => {
      controller(drivers);
    });
  };

  init(CONTROLLERS);

  try {
    await drivers.fastify.listen(3000);
  } catch (err) {
    drivers.fastify.log.error(err);
    process.exit(1);
  }
};
start();
