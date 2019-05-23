const table = require('../store/table');

/**
 * 初始化数据库
 * @param {string} tableName - table name
 */
async function main(tableName) {
  const exist = await table.checkTableExist(tableName);
  if (exist) {
    throw new Error(`${tableName} is already exist.`);
  }
  await table.createTable(tableName);
}


module.exports = main;
