import { compose } from "ramda";
import { listenToPath } from "@tt/lib-controllers";
import { withServices } from "@tt/lib-services";
import { get as getTweetService } from "../services";

export const get = compose(
  listenToPath("GET", "/tweets/:id"),
  withServices({ getTweet: getTweetService })
)((drivers) => async (req) => {
  const tweet = await drivers.services.getTweet(req.params.id);
  return tweet;
});
