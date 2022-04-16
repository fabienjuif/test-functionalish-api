import { FastifyInstance, HTTPMethods } from "fastify";

export const withController =
  (method: HTTPMethods, path: string) =>
  (fn: (drivers: any) => (...args: any[]) => Promise<any>) =>
  (drivers: { fastify: FastifyInstance }) => {
    drivers.fastify.route({
      method,
      url: path,
      handler: async (req, res) => {
        return fn(drivers)(req, res);
      },
    });
  };
