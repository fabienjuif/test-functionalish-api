const path = require('path');
const fs = require('fs');
const glob = require('glob');

const rootPackage = require('../../../package.json');

rootPackage.workspaces
  .flatMap((workspacePath) => glob.sync(workspacePath))
  // resolve package.json file
  .map((package) => path.resolve(package, 'package.json'))
  // test it exists
  .filter((file) => fs.existsSync(file))
  // .forEach((file) => {
  //   console.log(path.relative(prettierConfigFile, file));
  // });
  // open and parse it
  .map((file) => ({ file, data: JSON.parse(fs.readFileSync(file, 'utf-8')) }))
  // modify package.json
  .map(({ file, data }) => {
    const prettierRcRelativePath = path.relative(
      path.dirname(file),
      '.prettierrc',
    );

    const prettierIgnoreRelativePath = path.relative(
      path.dirname(file),
      '.prettierignore',
    );

    const swcRcRelativePath = path.relative(path.dirname(file), '.swcrc');

    return {
      file,
      data: {
        ...data,
        scripts: {
          ...data.scripts,
          prettier: `prettier --check . --config ${prettierRcRelativePath} --ignore-path ${prettierIgnoreRelativePath}`,
          build: 'tsc --build',
          buildSwc: `swc src -d dist --config-file ${swcRcRelativePath}`,
          clear: 'rm -Rf node_modules dist .turbo *.log',
        },
      },
    };
  })
  // write back package.json file
  .forEach(({ file, data }) =>
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf-8'),
  );
