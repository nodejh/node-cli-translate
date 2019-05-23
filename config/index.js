const fs = require('fs');
const chalk = require('chalk');
const { log } = require('../utils');

const { TRANSLATE_CONFIG } = process.env;
const configPath = `${TRANSLATE_CONFIG}/config.json`;

if (!fs.existsSync(configPath)) {
  log(chalk.red('Please config translate config file.'));
  log('For more infomation:', chalk.blue('https://github.com/nodejh/node-cli-translate.'));
  process.exit(1);
}

// eslint-disable-next-line import/no-dynamic-require
module.exports = require(configPath);
