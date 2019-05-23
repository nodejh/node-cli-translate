const TableStore = require('tablestore');
const client = require('./client');


async function listTable() {
  const data = await client.listTable();
  return data;
}


async function describeTable(tableName) {
  const data = await client.describeTable({ tableName });
  return data;
}

async function checkTableExist(tableName) {
  const tables = await listTable();
  const tableNames = tables.table_names;
  return tableNames.includes(tableName);
}

async function createTable(tableName) {
  const params = {
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
  await client.createTable(params);
  // 创建索引
  await client.createSearchIndex({
    tableName, // 设置表名
    indexName: 'searchIndex', // 设置索引名
    schema: {
      fieldSchemas: [
        {
          fieldName: 'word',
          fieldType: TableStore.FieldType.KEYWORD, // 设置字段名、类型
          index: true, // 设置开启索引
          enableSortAndAgg: true, // 设置开启排序和统计功能
          store: true,
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
          fieldName: 'count',
          fieldType: TableStore.FieldType.LONG,
          index: true,
          enableSortAndAgg: true,
          store: true,
          isAnArray: false,
        },
      ],
    },
  });
}

async function getRow(tableName, word) {
  const params = {
    tableName,
    primaryKey: [{ word }],
    maxVersions: 1, // 最多可读取的版本数，设置为2即代表最多可读取2个版本。
  };

  const data = await client.getRow(params);
  return data;
}

async function putRow(tableName, word, data) {
  const currentTimeStamp = Date.now();
  const params = {
    tableName,
    condition: new TableStore.Condition(TableStore.RowExistenceExpectation.EXPECT_NOT_EXIST, null),
    primaryKey: [{ word }],
    attributeColumns: [
      { data },
      { count: TableStore.Long.fromNumber(1) },
      { createTimeStamp: TableStore.Long.fromNumber(currentTimeStamp) },
      { updateTimeStamp: TableStore.Long.fromNumber(currentTimeStamp) },
    ],
    returnContent: { returnType: TableStore.ReturnType.Primarykey },
  };

  const res = await client.putRow(params);
  return res;
}

async function updateRow(tableName, word, count) {
  const currentTimeStamp = Date.now();
  const params = {
    tableName,
    condition: new TableStore.Condition(TableStore.RowExistenceExpectation.EXPECT_EXIST, null),
    primaryKey: [{ word }],
    updateOfAttributeColumns: [
      {
        PUT: [
          { count: TableStore.Long.fromNumber(count) },
          { updateTimeStamp: TableStore.Long.fromNumber(currentTimeStamp) },
        ],
      },

    ],
  };

  const data = await client.updateRow(params);
  return data;
}

async function search(tableName, offset, limit, sortFieldName = 'updateTimeStamp') {
  const params = {
    tableName,
    indexName: 'searchIndex',
    searchQuery: {
      offset,
      limit,
      query: {
        queryType: TableStore.QueryType.MATCH_ALL_QUERY,
      },
      sort: {
        sorters: [
          {
            fieldSort: {
              fieldName: sortFieldName,
              order: TableStore.SortOrder.SORT_ORDER_DESC,
            },
          },
        ],
      },
      getTotalCount: true,
    },
    columnToGet: {
      returnType: TableStore.ColumnReturnType.RETURN_ALL,
    },
  };
  const data = await client.search(params);
  return data;
}


module.exports = {
  listTable,
  describeTable,
  createTable,
  checkTableExist,
  getRow,
  putRow,
  updateRow,
  search,
};
