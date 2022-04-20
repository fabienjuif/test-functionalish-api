import { startHttpServer } from "@tt/lib-controllers";
import { close as closePg } from "@tt/lib-postgres";
import { get } from "./get";

startHttpServer(
  [get],
  // TODO: event emitter for drivers ?
  () => [closePg()]
);
