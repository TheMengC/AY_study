# 爱用-小程序相关文档

> 请大家勤于更新哦~

## taro里不得不说的坑

1. taro中不可以使用jsx变量（使用函数可以解决这个问题）

1. ~~jsx中不可以写箭头函数（函数可以解决这个问题，使用`this.function.bind(this,xxx)`调参）~~ 更正，匿名函数在 `Taro v1.2.9` 之后开始支持，但是比使用 bind 进行事件传参占用更大的内存，速度也会更慢

## 小程序里不得不说的坑

## 开发中不得不说的坑

1. 为了大家良好的开发体验，请大家使用 `webstorm` 进行开发

1. 有的时候会莫名出现找不到模块的情况，可能是因为真的没有安装，也有可能是模拟器有问题，尝试重启一下模拟器吧

1. `真机调试` 和 `预览` 模式都可以使用手机扫码调试，但是都不能热加载，更改文件之后需要重新刷新一下二维码哦

## top请求数据结构差异

小程序的top请求中 类似与交易中子订单列表的数组 由pc端的top请求如下格式 
```js
let trade={
    orders:{
        order:[
            {},
            {}
        ]
    }
}
```
变为
```js
let trade={
    orders:[
        {},
        {}
    ]
}
```
即少了一层orders对象的包裹 需要做兼容处理 在代码中 有一个函数叫`getArrayByKey` 专门用来处理这种情况

由其延伸出的 `getOrders` `getTrades` 可以兼容上述两种数据结构

若要兼容其他数据结构 可仿写如下函数
```js
export const getTrades = getArrayByKey.bind(null,'trade');
```

另外 小程序端类似于taobao_trades_sold_get_response 的响应包裹也没有了
