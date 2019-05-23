const chalk = require('chalk');
const { log } = require('../../utils');
const languages = require('../youdao/languages');

function main() {
  languages.forEach((o) => {
    log(chalk.green(o.value), chalk.grey(`(${o.title})`));
  });
}

module.exports = main;
