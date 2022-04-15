import { get } from "./get";
import { withCacheClient } from "@tt/lib-cache";

export const services = {
  get: withCacheClient({ flushAll: true })(get),
};
