// eslint-disable-next-line import/no-commonjs
const  path = require('path');

// eslint-disable-next-line import/no-commonjs

let trade_public = path.resolve(__dirname,'..','public/tradePublic');
let polyfill = path.resolve(__dirname,'..','public/tradePolyfills');
console.warn(trade_public);
//throw new Error("123");

module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  weapp: {},
  h5: {},

}
