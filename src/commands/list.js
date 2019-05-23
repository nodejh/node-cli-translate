const config = require('../../config');
const table = require('../store/table');
const { printList } = require('../youdao/utils');

const { aliCloud } = config;


async function main(page, limit, sort) {
  const offset = (page - 1) * limit;
  const data = await table.search(aliCloud.tableName, offset, limit, sort);
  printList(data);
}


module.exports = main;
