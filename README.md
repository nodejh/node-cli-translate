## 使用 Node.js 开发的终端翻译程序

目前实现了基本的翻译需求，待持续完善...


## Useage

在 [http://fanyi.youdao.com/openapi?path=data-mode](http://fanyi.youdao.com/openapi?path=data-mode) 申请一个有道词典的 `API key` 和 `keyfrom`，然后填写到 `config.js` 里面。

```
$ git clone https://github.com/nodejh/node-dictionary.git
$ cd node-dictionary
$ cp config.example.js config.js
# 修改 config.js 中的 keyfrom 和 apiKey
$ npm link
# trans
```

## API

目前仅使用了有道词典的 API：

+ `http://fanyi.youdao.com/openapi.do?keyfrom=shell11&key=2057738320&type=data&doctype=<doctype>&version=1.1&q=要翻译的文本`
