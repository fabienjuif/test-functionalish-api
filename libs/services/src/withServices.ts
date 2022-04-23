export const withServices =
  (services: Record<string, any>) =>
  (fn: (drivers: any) => (...args: any[]) => Promise<any>) =>
  (drivers: any) => {
    console.log('Inject services', Object.keys(services));
    return fn({
      ...drivers,
      services: Object.entries(services).reduce(
        (acc, [key, service]) => ({
          ...acc,
          [key]: service(drivers),
        }),
        {},
      ),
    });
  };
