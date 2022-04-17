import { FastifyInstance, HTTPMethods } from "fastify";

export const listenToPath =
  (method: HTTPMethods, path: string) =>
  (fn: (drivers: any) => (...args: any[]) => Promise<any>) =>
  (drivers: { fastify: FastifyInstance }) => {
    const { fastify, ...otherDrivers } = drivers;

    fastify.route({
      method,
      url: path,
      // remove fastify from drivers
      handler: fn(otherDrivers),
    });

    console.log("Listen", method, path);
  };
