
# Node.js 命令行翻译工具

为了快速在终端实现翻译需求，所以开发了这个小程序。

比如在写代码的时候，想翻译一个英文单词，但切换到翻译 APP 很麻烦，而一般编辑器或IED都有 Terminal，这个时候只需要在 Terminal 输入 `trans` 命令就可以翻译了。

## 使用方法

```
$ npm install node-cli-translate -g
$ trans hello
```

![trans hello](http://p1.bqimg.com/567571/621e632027f6e297.png)

## Dev

在 [http://fanyi.youdao.com/openapi?path=data-mode](http://fanyi.youdao.com/openapi?path=data-mode) 申请一个有道词典的 `API key` 和 `keyfrom`，然后填写到 `config.js` 里面。

```
$ git clone https://github.com/nodejh/node-cli-translate.git
$ cd node-cli-translate
$ cp config/config.example.js config/config.js
# 然后修改 config.js 中的 keyfrom 和 apiKey
# 再然后 link 该项目到 node_modules
$ npm link
# trans
```

```
$ trans
  请输入需要翻译的文本
  For example:
      translate hello
$ trans hello

  [BASIC]
  n. 表示问候， 惊奇或唤起注意时的用语   int. 喂；哈罗   n. (Hello)人名；(法)埃洛

  [WEB]
  你好   您好   Hello
  凯蒂猫   昵称   匿称
  哈乐哈乐   乐扣乐扣

```

## API

本翻译工具使用的是有道词典的 API：

+ `http://fanyi.youdao.com/openapi.do?keyfrom=shell11&key=2057738320&type=data&doctype=<doctype>&version=1.1&q=要翻译的文本`


## License

[MIT](https://github.com/nodejh/node-cli-translate/blob/master/LICENSE.md)
