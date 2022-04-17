import { Logger } from "winston";

export const injectLogger =
  (name: string) =>
  (fn: (drivers: any) => (...args: any[]) => Promise<any>) =>
  (drivers: any) => {
    console.log("Inject logger", name);
    const logger = drivers.logger as Logger;

    if (!logger) {
      throw new Error("No logger found create one by calling `getLogger`");
    }

    return fn({
      ...drivers,
      logger: logger.child({ service: name }),
    });
  };
