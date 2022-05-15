import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import * as yaml from 'js-yaml';

const readFile = promisify(fs.readFile);

const getValOrEnv = (value: string | undefined, name: string): string => {
  if (value) return value;

  const val = process.env[name];
  if (!val) {
    throw new Error(`[conf] ${name} must be defined.`);
  }

  return val;
};

let GLOBAL_CONF: unknown;
export const getGlobalConf = () => {
  if (!GLOBAL_CONF) {
    throw new Error('[conf] Please call loadConf() in your bootstrap');
  }

  return GLOBAL_CONF;
};

export type LoadConfOptions = {
  filePath?: string;
};
export const loadConf = async <T>(options?: LoadConfOptions): Promise<T> => {
  const templatePath =
    process.env.CONF_TEMPLATE_PATH ||
    path.resolve(__dirname, '../template.yaml');
  const filePath = getValOrEnv(options?.filePath, 'CONF_PATH');

  const [template, file] = await Promise.all([
    readFile(templatePath, 'utf-8'),
    readFile(filePath, 'utf-8'),
  ]);

  GLOBAL_CONF = yaml.load(`${template}\n${file}`);

  return GLOBAL_CONF as T;
};
