const translate = require('./translate');
const colors = require('./colors');


function trans() {
  // 如果使用的是 node index.js world 这样的命令
  // 则需要翻译的单词是 process.argv[2]
  let word = process.argv[2];

  if (process.argv[0] === 'trans') {
    // 如果使用的是 trans word 这样的命令
    // 则 process.argv[0] 是 trans
    // 需要翻译的单词是 process.argv[1]
    word = process.argv[1];
  }

  if (word) {
    translate.translateByYoudao(word);
  } else {
    console.log(colors.Reset, colors.fg.Red, '请输入需要翻译的文本', colors.Reset);
    console.log(colors.Reset, colors.fg.Red, 'For example:', colors.Reset);
    console.log(colors.Reset, colors.fg.Red, '    trans hello', colors.Reset);
  }

  process.on('uncaughtException', function (err) {
    return console.log(colors.Reset, colors.fg.Red, '\n网络异常\n', colors.Reset);
  });
}


module.exports = trans;
