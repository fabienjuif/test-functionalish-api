import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { get } from 'lodash';
import { getGlobalConf } from './loadConf';

class WithConfValidationError extends Error {
  public path?: string;

  constructor(
    public readonly errors: ReturnType<typeof validateSync>,
    path?: string,
  ) {
    super('Errors while validating configuration');
    this.path = path;
  }
}

export const withConf = <T>(
  path?: string,
  Schema?: Parameters<typeof plainToClass>[0],
): T => {
  console.log('[conf] looking for conf', path);
  const conf = getGlobalConf();

  if (!path) return conf as T;

  const raw = get(conf, path);
  if (!Schema) return raw as T;

  console.log({ p: plainToClass(Schema, raw) });

  const errors = validateSync(plainToClass(Schema, raw) as unknown as object, {
    whitelist: true,
    forbidUnknownValues: true,
  });

  if (errors?.length > 0) {
    throw new WithConfValidationError(errors, path);
  }

  return raw as T;
};
