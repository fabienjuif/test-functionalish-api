import { createLogger, format, Logger, transports } from "winston";

const { combine, timestamp, prettyPrint, simple, colorize } = format;

let baseLogger: Logger;
const loggers: Map<string, Logger> = new Map();

export const injectLogger =
  (name: string) =>
  (fn: (drivers: any) => (...args: any[]) => Promise<any>) =>
  (drivers: any) => {
    if (!baseLogger) {
      baseLogger = createLogger({
        format: combine(timestamp(), prettyPrint({ colorize: true })),
        transports: [
          new transports.Console({
            format: combine(simple(), colorize({ all: true })),
          }),
        ],
      });
    }

    let logger = loggers.get(name);
    if (!logger) {
      console.log("[logger] create logger", name);
      logger = baseLogger.child({ service: name });
      loggers.set(name, logger);
    }

    console.log("[logger] inject", name);

    return fn({
      ...drivers,
      logger,
    });
  };
