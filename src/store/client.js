const TableStore = require('tablestore');
const config = require('../../config');

const client = new TableStore.Client({
  accessKeyId: config.aliCloud.accessKey,
  secretAccessKey: config.aliCloud.secretKey,
  endpoint: config.aliCloud.endpoint,
  instancename: config.aliCloud.instancename,
});

module.exports = client;
