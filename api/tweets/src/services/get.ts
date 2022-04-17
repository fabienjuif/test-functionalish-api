import { compose } from "ramda";
import { withCache } from "@tt/lib-cache";
import { injectLogger, traceCall } from "@tt/lib-logger";

export const get = compose(
  // TODO: rename it withLoggerContext
  injectLogger("tweets-get"),
  traceCall(),
  withCache((id: string) => id, "2d")
)((drivers) => async (id: string) => {
  const res = await drivers.pg.query(
    "select * from tweets where id = $1::text limit 1",
    [id]
  );
  // TODO: handle 404
  return res.rows[0];
});
