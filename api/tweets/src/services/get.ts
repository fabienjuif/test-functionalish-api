import { compose } from "ramda";
import { withCache } from "@tt/lib-cache";
import { injectLogger, traceCall } from "@tt/lib-logger";

// fake database method
// FIXME: make it a driver
const fetch = (id: string) => {
  console.log("[db] fetching...", id);

  return {
    id,
    text: "Je suis un tweet",
  };
};

export const get = compose(
  injectLogger("tweets-get"),
  traceCall(),
  withCache((id: string) => id, "2d")
)((drivers) => async (id: string) => {
  const tweet = await fetch(id);
  return tweet;
});
