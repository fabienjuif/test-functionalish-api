import { Logger } from "winston";

export const traceCall =
  (
    options: {
      name?: string;
      mapArgs?: (...args: any[]) => string;
      level?: string;
    } = {}
  ) =>
  (fn: (drivers: any) => (...args: any[]) => Promise<any>) =>
  (drivers: any) => {
    console.log("Inject trace-call");
    const fnWithDrivers = fn(drivers);

    return async (...args: any[]) => {
      const logger = drivers.logger as Logger;

      if (!logger) {
        throw new Error("Logger is not set, inject one with `injectLogger`");
      }

      logger.log({
        level: options.level ?? "info",
        message: options.mapArgs ? options.mapArgs(...args) : args.join(", "),
        meta: options.name
          ? {
              name: options.name,
            }
          : undefined,
      });

      return fnWithDrivers(...args);
    };
  };
