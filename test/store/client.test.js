/* eslint-disable no-await-in-loop */
const assert = require('assert');
const TableStore = require('tablestore');
const client = require('../../src/store/client');

const tablePrefix = `test_node_cli_translate_${Date.now()}`;

function getTableParams(tableName) {
  return {
    tableMeta: {
      tableName,
      primaryKey: [
        {
          name: 'word',
          type: 'STRING',
        },
      ],
    },
    reservedThroughput: {
      capacityUnit: {
        read: 0,
        write: 0,
      },
    },
    tableOptions: {
      timeToLive: -1, // 数据的过期时间, 单位秒, -1代表永不过期. 假如设置过期时间为一年, 即为 365 * 24 * 3600.
      maxVersions: 1, // 保存的最大版本数, 设置为1即代表每列上最多保存一个版本(保存最新的版本).
    },
  };
}

beforeEach(() => {
});

afterEach(async () => {
  const table = await client.listTable();
  const tableNames = table.table_names;
  for (let i = 0; i < tableNames.length; i++) {
    if (tableNames[i].indexOf(tablePrefix) === 0) {
      await client.deleteTable({ tableName: tableNames[i] });
    }
  }
});

describe('store/client.js', () => {
  describe('get table store client', () => {
    it('should get table store clinet', () => {
      expect(client).toEqual(expect.any(Object));
    });
  });

  describe('create table', () => {
    it('should create table', async () => {
      const name = `${tablePrefix}_${new Date().getTime()}`;
      const params = getTableParams(name);
      const data = await client.createTable(params);
      expect(data.RequestId).toEqual(expect.any(String));
    });
  });

  describe('delete table', () => {
    const name = `${tablePrefix}_delete_${new Date().getTime()}`;
    beforeEach(async () => {
      const params = getTableParams(name);
      await client.createTable(params);
    });
    it('should delete table', async () => {
      const data = await client.deleteTable({ tableName: name });
      expect(data.RequestId).toEqual(expect.any(String));
    });
  });

  describe('insert row', () => {
    const tableName = `${tablePrefix}_insert_${new Date().getTime()}`;
    beforeEach(async () => {
      const params = getTableParams(tableName);
      await client.createTable(params);
    });
    it('should insert row', async () => {
      const currentTimeStamp = Date.now();
      const params = {
        tableName,
        condition: new TableStore.Condition(
          TableStore.RowExistenceExpectation.IGNORE,
          null,
        ),
        primaryKey: [{ word: 'hello' }],
        attributeColumns: [
          { name: '表格存储' },
          { value: JSON.stringify({ basic: 'xx' }) },
          { createTime: currentTimeStamp },
          { updateTime: TableStore.Long.fromNumber(currentTimeStamp) },
          { frequency: 2 },
        ],
        returnContent: { returnType: TableStore.ReturnType.Primarykey },
      };

      const data = await client.putRow(params);
      console.log('data ', data);
    });
  });

  describe.only('index ', () => {
    it('show get index', async () => {
      await client.createSearchIndex({
        tableName: 'translate_words_youdao', // 设置表名
        indexName: 'testsearchIndex', // 设置索引名
        schema: {
          fieldSchemas: [
            {
              fieldName: 'word',
              fieldType: TableStore.FieldType.KEYWORD, // 设置字段名、类型
              index: true, // 设置开启索引
              enableSortAndAgg: true, // 设置开启排序和统计功能
              store: false,
              isAnArray: false,
            },
            {
              fieldName: 'updateTimeStamp',
              fieldType: TableStore.FieldType.LONG,
              index: true,
              enableSortAndAgg: true,
              store: true,
              isAnArray: false,
            },
            {
              fieldName: 'createTimeStamp',
              fieldType: TableStore.FieldType.LONG,
              index: true,
              enableSortAndAgg: false,
              store: true,
              isAnArray: false,
            },
          ],
        },
      });

      const data = await client.listSearchIndex({
        tableName: 'translate_words_youdao', // 设置表名
      });
      console.log('data ', data);
      const info = await client.describeSearchIndex({
        tableName: 'translate_words_youdao', // 设置表名
        indexName: 'testsearchIndex', // 设置索引名
      });
      console.log('info ', JSON.stringify(info));
    });
  });
});
