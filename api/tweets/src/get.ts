import { compose } from "ramda";
import { listenToPath } from "@tt/lib-controllers";
import { withServices } from "@tt/lib-services";
import * as tweetsService from "@tt/service-tweets";

export const get = compose(
  listenToPath("GET", "/tweets/:id"),
  withServices({ getTweet: tweetsService.get })
)((drivers) => async (req) => {
  const tweet = await drivers.services.getTweet(req.params.id);
  return tweet;
});
