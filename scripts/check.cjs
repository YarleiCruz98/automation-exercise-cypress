const { readdirSync } = require('node:fs');
const { join } = require('node:path');
const { execFileSync } = require('node:child_process');
function check(dir) {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, item.name);
    if (item.isDirectory()) check(file);
    else if (/\.(c?js)$/.test(file)) {
      execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
    }
  }
}
check('cypress');
check('scripts');
execFileSync(process.execPath, ['--check', 'cypress.config.js'], { stdio: 'inherit' });
console.log('Sintaxe validada.');
