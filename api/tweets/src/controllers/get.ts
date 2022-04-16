import { compose } from "ramda";
import { withController } from "@tt/lib-controllers";
import { withServices } from "@tt/lib-services";
import { get as getTweetService } from "../services";

export const get = compose(
  withController("GET", "/tweets/:id"),
  withServices({ getTweetService })
)((drivers) => async (req) => {
  const tweet = await drivers.services.getTweetService(req.params.id);
  return tweet;
});
