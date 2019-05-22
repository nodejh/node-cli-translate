const crypto = require('crypto');

/**
 * 获取 input
 * @param {string} input - 需要查询的文本
 */
function getInput(input) {
  if (input.length == 0) {
    return null;
  }
  let result;
  let len = input.length;
  if (len <= 20) {
    result = input;
  } else {
    const startStr = input.substring(0, 10);
    const endStr = input.substring(len - 10, len);
    result = startStr + len + endStr;
  }
  return result;
}

/**
 * sha256
 * @param {string} text - input text
 * @return {string} result
 */
function sha256(text) {
  return crypto
    .createHash('sha256')
    .update(text)
    .digest('hex');
}

module.exports = {
  getInput,
  sha256,
}