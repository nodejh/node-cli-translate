const crypto = require('crypto');
const chalk = require('chalk');
const { log } = require('../../utils');

/**
 * 获取 input
 * @param {string} input - 需要查询的文本
 */
function getInput(input) {
  if (input.length === 0) {
    return null;
  }
  let result;
  const len = input.length;
  if (len <= 20) {
    result = input;
  } else {
    const startStr = input.substring(0, 10);
    const endStr = input.substring(len - 10, len);
    result = startStr + len + endStr;
  }
  return result;
}

/**
 * sha256
 * @param {string} text - input text
 * @return {string} result
 */
function sha256(text) {
  return crypto
    .createHash('sha256')
    .update(text)
    .digest('hex');
}

function print(data) {
  log(chalk.yellow(data.query), chalk.grey(`(${data.l.replace('-', '->')})`));

  const usPhonetic = data.basic && data.basic['us-phonetic'];
  const ukPhonetic = data.basic && data.basic['uk-phonetic'];
  log(
    ukPhonetic ? chalk.yellow(`[${data.basic['uk-phonetic']}]`) : '',
    ukPhonetic ? chalk.grey('uk') : '',
    usPhonetic ? chalk.yellow(`[${data.basic['us-phonetic']}]`) : '',
    usPhonetic ? chalk.grey('us') : '',
  );

  const [translation] = data.translation;
  log();
  log('[TRANSLATION]');
  log(chalk.greenBright(translation));

  if (data.basic) {
    log();
    log('[BASIC]');
    data.basic.explains.forEach((o) => {
      log(chalk.greenBright(o));
    });

    if (data.basic.wfs) {
      log();
      data.basic.wfs.forEach((o) => {
        if (o.wf) {
          log(chalk.cyan(`${o.wf.name}: ${o.wf.value}`));
        }
      });
    }
  }


  if (data.web) {
    log();
    log('[WEB]');
    data.web.forEach((o) => {
      log(chalk.green(`${o.key}  ${o.value.join(', ')}`));
    });
  }
}

/**
 * print row from table store
 * @param {object} row - row from table store
 */
function printStore(row) {
  print(JSON.parse(row.data));

  log();
  log(
    chalk.grey('Times:'),
    chalk.yellow(row.count),
    ' ',
    chalk.grey('Latest:'),
    chalk.yellow(new Date(row.updateTimeStamp.toNumber()).toLocaleString()),
  );
}

function printList(data) {
  log();
  data.rows.forEach((row) => {
    const { attributes } = row;
    const rowMap = {};
    attributes.forEach((o) => {
      rowMap[o.columnName] = o.columnValue;
    });
    rowMap.data = JSON.parse(rowMap.data);
    const [translation] = rowMap.data.translation;
    log(
      chalk.green(rowMap.data.query),
      chalk.grey('=>'),
      chalk.yellow(translation),
      '         ',
      chalk.grey(new Date(rowMap.updateTimeStamp.toNumber()).toLocaleString()),
      chalk.grey('|'),
      chalk.grey(rowMap.count),
    );
  });

  log();
  log(chalk.grey('Total: '), chalk.yellow(data.totalCounts));
}

module.exports = {
  getInput,
  sha256,
  print,
  printStore,
  printList,
};
