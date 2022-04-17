import { FastifyInstance, HTTPMethods } from "fastify";

export const listenToPath =
  (method: HTTPMethods, path: string) =>
  (fn: (drivers: any) => (...args: any[]) => Promise<any>) =>
  (drivers: { fastify: FastifyInstance }) => {
    const fnWithDrivers = fn(drivers);

    console.log(method, path);

    drivers.fastify.route({
      method,
      url: path,
      handler: async (req, res) => {
        return fnWithDrivers(req, res);
      },
    });
  };
