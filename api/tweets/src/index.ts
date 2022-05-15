import * as path from 'path';
import { loadConf } from '@tt/lib-conf';

loadConf({ filePath: path.resolve(__dirname, '../env.yaml') })
  .then(() => import('./start'))
  .then((mod: any) => mod.start());
