const chalk = require('chalk');
const { log } = require('../../utils');
const config = require('../../config');
const table = require('../store/table');
const translate = require('../youdao/translate');
const errorCode = require('../youdao/errorCode');
const { print, printStore } = require('../youdao/utils');

const { aliCloud } = config;

async function transYouDao(word, target) {
  const res = await translate(word, target);

  if (res.errorCode !== '0') {
    log(chalk.yellow(word), chalk.grey(`(${res.l.replace('2', '->')})`));
    throw new Error(errorCode[res.errorCode]);
  }

  print(res);
  await table.putRow(aliCloud.tableName, word, JSON.stringify(res));
}

async function transTableStore(word, row) {
  const { attributes } = row;
  const rowMap = {};
  attributes.forEach((o) => {
    rowMap[o.columnName] = o.columnValue;
  });

  printStore(rowMap);
  const count = rowMap.count.toNumber() + 1;
  await table.updateRow(aliCloud.tableName, word, count);
}

async function main(word, target) {
  let data;
  if (aliCloud) {
    data = await table.getRow(aliCloud.tableName, word);
  }

  if (data.row.primaryKey) {
    // 已经查询过
    await transTableStore(word, data.row);
  } else {
    // 未查询过
    await transYouDao(word, target);
  }
}

module.exports = main;
