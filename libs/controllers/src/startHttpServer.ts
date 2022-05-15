import createFastify from 'fastify';

export const startHttpServer = async (
  controllers: ((drivers: any) => any)[],
  close?: () => Promise<any>[],
) => {
  const fastify = createFastify({ logger: false });

  const driversWithFastify = {
    fastify,
  };

  controllers.forEach((controller) => {
    controller(driversWithFastify);
  });

  const interrupt = (sigName: string) => async () => {
    console.warn('caught interrupt signal', sigName);

    console.debug('closing all sockets ...');
    await Promise.all([fastify.close()].concat(close ? close() : []));
  };

  ['SIGUSR1', 'SIGINT', 'SIGTERM', 'SIGPIPE', 'SIGHUP', 'SIGBREAK'].forEach(
    (sigName) => {
      process.on(sigName, interrupt(sigName));
    },
  );

  try {
    const port = process.env.PORT ?? 3000;
    const host = process.env.HOST ?? '0.0.0.0';
    await fastify.listen(port, host);
    console.log('[fastify] Listening to', { host, port });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
