const translate = require('./translate');
const colors = require('./colors');


const word = process.argv[2];
if (process.argv[0] === 'trans') {
  // 如果使用的是 trans word 这样的命令
  // 则需要翻译的单词是 process.argv[1]
  word = process.argv[1];
}

if (word) {
  // console.log(colors.Reset, colors.fg.Yellow, '需要翻译的文本是: ', word, colors.Reset);
  // console.log('');
  translate.translateByYoudao(word);
} else {
  console.log(colors.Reset, colors.fg.Red, '请输入需要翻译的文本', colors.Reset);
  console.log(colors.Reset, colors.fg.Red, 'For example:', colors.Reset);
  console.log(colors.Reset, colors.fg.Red, '    trans hello', colors.Reset);
}
