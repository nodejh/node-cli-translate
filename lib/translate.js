const http = require('http');
const config = require('./../config/config');
const colors = require('./colors');


/**
 * 基于有道词典的翻译
 * @param  {string} word 需要翻译的文本
 * @return {null}        null
 */
function translateByYoudao(word) {
  const youdaoConfig = config.youdao;
  const path = `/openapi.do?keyfrom=${youdaoConfig.keyfrom}` +
    `&key=${youdaoConfig.apiKey}` +
    `&type=data&doctype=json&version=1.1&q=${encodeURI(word)}`;
  // console.log('path: ', path);
  http.get({
    host: youdaoConfig.host,
    path,
  }, function(response) {
    let body = '';
    response.setEncoding('utf8');
    response.on('data', function(d) {
      body += d;
    });

    response.on('end', function() {
      const data = JSON.parse(body);
      if (data.errorCode !== 0) {
        return console.log(colors.Reset, colors.fg.Red, parsed, colors.Reset);
      }
      if (!(data.basic && data.basic.explains)) {
        return console.log(colors.Reset, colors.fg.Red, '\n没有获取到该单词的翻译结果\n', colors.Reset);
      }
      // 基础释译
      const basic = data.basic.explains.join('   ');
      const web = data.web;
      console.log(colors.Reset, colors.fg.Magenta , '[BASIC]', colors.Reset) ;
      console.log(colors.Reset, colors.fg.Green , basic, colors.Reset) ;
      console.log('');
      // Web释译
      console.log(colors.Reset, colors.fg.Magenta , '[WEB]', colors.Reset) ;
      web.map((item) => {
        const value = item.value.join('   ');
        console.log(colors.Reset, colors.fg.Green , value, colors.Reset) ;
      });
      console.log(' ');
    });
  });
}


module.exports = {
  translateByYoudao,
};
