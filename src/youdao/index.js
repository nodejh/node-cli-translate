/**
 * 有道翻译
 */
const assert = require('assert');
const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const languages = require('./languages');
const {getInput, sha256} = require('./utils');
const config = require(`${process.env.TRANSLATE_CONFIG}/youdao.json`);

function listLanguages() {
  languages.forEach(o => {
    console.log(chalk.green(o.value),  chalk.grey(`(${o.title})`));
  })
}

function print(data) {
  console.log('\n');

  const usPhonetic = data.basic && data.basic['us-phonetic'];
  const ukPhonetic = data.basic && data.basic['uk-phonetic'];
  console.log(chalk.grey(`(${data.l.replace('-', '->')})`), chalk.green(data.query));
  console.log(
    usPhonetic ? chalk.grey('us') : '',
    usPhonetic ? chalk.yellow(`[${data.basic['us-phonetic']}]`) : '', 
    ukPhonetic ? chalk.grey('uk') : '',
    ukPhonetic ? chalk.yellow(`[${data.basic['uk-phonetic']}]`) : '',
  );
  
  
  console.log();

  if (data.basic) {
    console.log('[BASIC]');
    data.basic.explains.forEach(o => {
      console.log(chalk.greenBright(o));
    })

    if (data.basic.wfs) {
      console.log();
      data.basic.wfs.forEach(o => {
        if (o.wf) {
          console.log(chalk.cyan(`${o.wf.name}: ${o.wf.value}`));
        }
      })
    }
  }


  
  // console.log();
  // console.log('[WEB]');
  
  console.log();
}

async function translate(text, target) {
  const timeStart = new Date();
  const spinner = ora({
    text: chalk.grey('Loading...'),
    spinner: 'hearts',
  }).start();
  
  // https://ai.youdao.com/docs/doc-trans-api.s#p04
  const appKey = config.app_id;
  const key = config.app_secret; //注意：暴露appSecret，有被盗用造成损失的风险
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
    appKey: appKey,
    salt: salt,
    from: from,
    to: to,
    curtime: curtime,
    sign: sign,
    signType: 'v3',
  };

  const res = await axios.get(api, { params });

  if (res.data.errorCode !== '0') {
    spinner.fail(chalk.red(`ERROR ${new Date() - timeStart}ms`));
    return;
  }

  print(res.data);
  spinner.succeed(chalk.grey(`${new Date() - timeStart}ms`));
}

module.exports =  {
  listLanguages,
  translate,
};
