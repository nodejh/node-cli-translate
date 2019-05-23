/* eslint-disable no-await-in-loop */
const table = require('../../src/store/table');


describe('store/table.js', () => {
  describe('listTable', () => {
    it('should list table', async () => {
      const data = await table.listTable();
      expect(data).toEqual(expect.any(Object));
      expect(data.table_names).toEqual(expect.any(Array));
    });
  });
  describe('describeTable', () => {
    it('should describe table', async () => {
      const tableName = 'test_insert';
      const data = await table.describeTable(tableName);
      expect(data).toEqual(expect.any(Object));
      expect(data.table_meta.table_name).toBe(tableName);
    });
  });
  describe('checkTableExist', () => {
    it('should check table exist', async () => {
      const tableName = 'test_insert';
      const data = await table.checkTableExist(tableName);
      expect(data).toBe(true);
    });
  });
  describe('getRow', () => {
    it('should get row', async () => {
      const tableName = 'translate_words_youdao';
      const data = await table.getRow(tableName, 'he');
      expect(data).toEqual(expect.any(Object));
      expect(data.row).toEqual(expect.any(Object));
    });
  });
  describe.only('search', () => {
    it('should search row', async () => {
      const tableName = 'translate_words_youdao';
      const data = await table.search(tableName, 0, 10, 'count');
      expect(data).toEqual(expect.any(Object));
      // console.log('data', JSON.stringify(data));
      // expect(data).toEqual(expect.any(Object));
      // expect(data.row).toEqual(expect.any(Object));
    });
  });
});
