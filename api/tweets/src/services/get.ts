import * as R from "ramda";
import { withCache } from "@tt/lib-cache";

// fake database method
const fetch = (id: string) => {
  console.log("[db] fetching...", id);

  return {
    id,
    text: "Je suis un tweet",
  };
};

export const get = R.compose(
  // cache
  withCache((id: string) => id, "2d")
)((drivers) => async (id: string) => {
  const tweet = await fetch(id);
  return tweet;
});
