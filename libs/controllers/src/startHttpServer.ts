import createFastify from "fastify";

export const startHttpServer = async (
  drivers: any,
  controllers: ((drivers: any) => any)[],
  close?: () => Promise<any>[]
) => {
  const fastify = createFastify({ logger: false });

  const driversWithFastify = {
    ...drivers,
    fastify,
  };

  controllers.forEach((controller) => {
    controller(driversWithFastify);
  });

  const interrupt = (sigName: string) => async () => {
    console.warn("caught interrupt signal", sigName);

    console.debug("closing all sockets ...");
    await Promise.all([fastify.close()].concat(close ? close() : []));
  };

  ["SIGUSR1", "SIGINT", "SIGTERM", "SIGPIPE", "SIGHUP", "SIGBREAK"].forEach(
    (sigName) => {
      process.on(sigName, interrupt(sigName));
    }
  );

  try {
    await fastify.listen(process.env.PORT ?? 3000);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
