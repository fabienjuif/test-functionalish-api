import { startHttpServer } from "@tt/lib-controllers";
import { getPg } from "@tt/lib-postgres";
import { CONTROLLERS } from "./controllers";

const start = async () => {
  const pg = getPg({ user: "postgres", password: "coucou" });

  await startHttpServer(
    {
      // TODO: lazy pg instanciation
      pg,
    },
    CONTROLLERS,
    // TODO: event emitter for drivers ?
    () => [pg.close()]
  );
};

start();
