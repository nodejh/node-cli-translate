/**
 * 有道翻译
 */
const axios = require('axios');
const { getInput, sha256 } = require('./utils');
const { log } = require('../../utils');
const config = require('../../config');


async function translate(text, target) {
  // https://ai.youdao.com/docs/doc-trans-api.s#p04
  const appKey = config.youDao.appId;
  const key = config.youDao.appSecret; // 注意：暴露appSecret，有被盗用造成损失的风险
  const salt = new Date().getTime();
  const curtime = Math.round(new Date().getTime() / 1000);

  const api = 'https://openapi.youdao.com/api';
  const query = text;
  // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
  const from = 'auto';
  const to = target || 'auto';
  const str1 = appKey + getInput(query) + salt + curtime + key;
  const sign = sha256(str1);
  const params = {
    q: query,
    appKey,
    salt,
    from,
    to,
    curtime,
    sign,
    signType: 'v3',
  };

  const res = await axios.get(api, { params });
  return res.data;
}

module.exports = translate;
