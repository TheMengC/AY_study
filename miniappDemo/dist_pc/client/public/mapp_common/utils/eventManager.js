'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var commonEvents = {
  showDialog: {},
  reloadRatePhrases: {}, // 加载评价短语
  userInfoCallback: {}, // 获取用户信息后的回调
  apiDied: {},
  changeNeedSyncStatus: {},
  apiRespawned: {},
  routerChanged: {},
  onSearchReset: {},
  onSearchExternal: {}
};

var events = exports.events = _extends({}, commonEvents, {
  subscribe: function subscribe(eventName, callback) {
    var eventItem = events[eventName];
    if (eventItem) {
      eventItem.callbackPool.push(callback);
    }
  },
  subscribeOnce: function subscribeOnce(eventName, callback) {
    var eventItem = events[eventName];
    if (eventItem) {
      eventItem.callbackOnce = callback;
    }
  },
  unsubscribe: function unsubscribe(eventName, callback) {
    var eventItem = events[eventName];
    if (eventItem) {
      var index = eventItem.callbackPool.findIndex(callback);
      eventItem.callbackPool.splice(index, 1);
    }
  },
  emit: function emit(eventName, args) {
    var eventItem = events[eventName];
    if (eventItem) {
      eventItem.beforeEmit && eventItem.beforeEmit();
      typeof eventItem.callbackOnce === 'function' && eventItem.callbackOnce(args);
      eventItem.callbackPool.map(function (callback) {
        callback(args);
      });
      eventItem.afterEmit && eventItem.afterEmit();
    }
  }
});
/**
 * 初始化eventManager 把上面的对象一个一个的添加上
 * subscribe 订阅事件
 * subscribeOnce 订阅且只订阅一次
 * emit 触发事件
 * unsubscribe 取消订阅事件
 这几个方法
 */
Object.keys(events).map(function (key) {
  var eventItem = events[key];
  eventItem.callbackPool = [];
  eventItem.subscribe = events.subscribe.bind(eventItem, key);
  eventItem.subscribeOnce = events.subscribeOnce.bind(eventItem, key);
  eventItem.unsubscribe = events.unsubscribe.bind(eventItem, key);
  eventItem.emit = events.emit.bind(eventItem, key);
});