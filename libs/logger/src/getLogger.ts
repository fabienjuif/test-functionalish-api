import { createLogger, format, transports } from "winston";

const { combine, timestamp, prettyPrint, simple, colorize } = format;

export const getLogger = () => {
  return createLogger({
    format: combine(timestamp(), prettyPrint({ colorize: true })),
    transports: [
      new transports.Console({
        format: combine(simple(), colorize({ all: true })),
      }),
    ],
  });
};
