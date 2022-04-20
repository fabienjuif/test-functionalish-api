import { compose } from "ramda";
import { withCache } from "@tt/lib-cache";
import { injectLogger, traceCall } from "@tt/lib-logger";
import { injectPg } from "@tt/lib-postgres";

export const get = compose(
  injectLogger("tweets"),
  traceCall({ name: "get" }),
  withCache("tweets", (id: string) => id, { flushAll: true }),
  injectPg({ user: "postgres", password: "coucou" })
)((drivers: any) => async (id: string) => {
  const res = await drivers.pg.query(
    "select * from tweets where id = $1::text limit 1",
    [id]
  );
  // TODO: handle 404
  return res.rows[0];
});
