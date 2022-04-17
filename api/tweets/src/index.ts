import createFastify from "fastify";
import { getCacheClient } from "@tt/lib-cache";
import { CONTROLLERS } from "./controllers";
import { getLogger } from "@tt/lib-logger";

// Run the server!
let fastify: ReturnType<typeof createFastify>;
const start = async () => {
  fastify = createFastify({ logger: false });

  const drivers = {
    fastify,
    cacheClient: await getCacheClient({ flushAll: true }),
    logger: getLogger(),
  };

  const init = (controllers: ((drivers: any) => any)[]) => {
    controllers.forEach((controller) => {
      controller(drivers);
    });
  };

  init(CONTROLLERS);

  try {
    await drivers.fastify.listen(process.env.PORT ?? 3000);
  } catch (err) {
    drivers.fastify.log.error(err);
    process.exit(1);
  }
};
start();

const interrupt = (sigName: string) => async () => {
  console.warn("caught interrupt signal", sigName);

  console.debug("closing all sockets ...");
  await Promise.all([fastify.close()]);
};

["SIGUSR1", "SIGINT", "SIGTERM", "SIGPIPE", "SIGHUP", "SIGBREAK"].forEach(
  (sigName) => {
    process.on(sigName, interrupt(sigName));
  }
);
