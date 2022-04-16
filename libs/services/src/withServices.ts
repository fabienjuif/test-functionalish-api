export const withServices =
  (services: Record<string, any>) =>
  (fn: (drivers: any) => (...args: any[]) => Promise<any>) =>
  (drivers: any) => {
    const driversWithServices = {
      services: Object.entries(services).reduce(
        (acc, [key, service]) => ({
          ...acc,
          [key]: service(drivers),
        }),
        {}
      ),
    };

    return (...args: any[]) => fn(driversWithServices)(...args);
  };
