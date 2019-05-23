/* eslint-disable no-await-in-loop */

const client = require('../../src/store/client');

describe('get table store client', () => {
  it('should get table store clinet', async () => {
    const table = await client.listTable();
    const tableNames = table.table_names;
    for (let i = 0; i < tableNames.length; i++) {
      await client.deleteTable({ tableName: tableNames[i] });

      // if (tableNames[i].indexOf(tablePrefix) === 0) {
      //   await client.deleteTable({ tableName: tableNames[i] });
      // }
    }
  });
});
