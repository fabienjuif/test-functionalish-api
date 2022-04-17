import { createLogger, format, transports } from "winston";

const { combine, timestamp, prettyPrint, simple, colorize } = format;

export const getLogger = () => {
  const logger = createLogger({
    format: combine(timestamp(), prettyPrint({ colorize: true })),
    transports: [
      new transports.Console({
        format: combine(simple(), colorize({ all: true })),
      }),
    ],
  });

  return logger;
};
