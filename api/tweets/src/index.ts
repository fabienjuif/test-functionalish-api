import createFastify from "fastify";
import { services } from "./services";

const fastify = createFastify({ logger: false });

const drivers = {};

// Declare a route
fastify.get("/tweets/:id", async (request, reply) => {
  const r = await services.get(drivers)((request.params as any).id);
  console.log({ r });
  return r;
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
