import { compose } from "ramda";
import { withCache } from "@tt/lib-cache";
import { injectLogger, traceCall } from "@tt/lib-logger";
import { injectPg } from "@tt/lib-postgres";

export const get = compose(
  injectLogger("tweets"),
  traceCall({ name: "get" }),
  withCache("tweets", (id: string) => id, { flushAll: true }),
  injectPg({ user: "postgres", password: "coucou" })
)((drivers) => async (id: string) => {
  const collection = drivers.pg.collection("tweets");

  return collection.getById({ id });
});
