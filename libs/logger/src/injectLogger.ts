import { createLogger, format, Logger, transports } from 'winston';

const { combine, timestamp, prettyPrint, simple, colorize } = format;

let baseLogger: Logger;
const loggers: Map<string, Logger> = new Map();

export const injectLogger =
  (domain: string) =>
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

    let logger = loggers.get(domain);
    if (!logger) {
      console.log('[logger] create logger', domain);
      logger = baseLogger.child({ domain });
      loggers.set(domain, logger);
    }

    console.log('[logger] inject', domain);

    return fn({
      ...drivers,
      logger,
    });
  };
