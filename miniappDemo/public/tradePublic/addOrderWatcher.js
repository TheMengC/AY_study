import { getUserInfo, isEmpty, storage } from 'tradePolyfills';
import qnRouter from "tradePublic/qnRouter";

const QIMEN_MAP = {
    'QIMEN_CP_NOTIFY': 'QIMEN_CP_OUT',
    'QIMEN_ERP_TRANSFER': 'QIMEN_ERP_CHECK'
};
/**
 * 为订单增加链路状态
 * @Author ZW
 * @date   2018-07-18T17:03:01+0800
 * @param  {array}                  tids            订单号数组
 * @param  {String}                 eventStatus     链路中状态
 * @return {}
 */
export const addOrderWatcher = (tids, eventStatus) => {
    // 考虑合单情况，把tid拆开，并且过滤已经有状态的订单
     storage.getItem('orderWatcher' + getUserInfo().userNick).then((orderWatcherStr)=>{
         if (!orderWatcherStr) {
             console.log('用户没有加入到链路系统');
             return;
         }
         let orderWatcher = JSON.parse(orderWatcherStr);
         if (orderWatcher){
             if (Object.keys(orderWatcher).length > 10000){
                 orderWatcher={};
             }
         }
         let tidNeedSend = [];
         for (let tid of tids) {
             if (eventStatus == 'QIMEN_CP_NOTIFY' || eventStatus == 'QIMEN_CP_OUT' || orderWatcher[tid] == undefined) {
                 tidNeedSend.push(tid);
             }
         }
         // 批量请求出去
         let args = [];
         if (!isEmpty(tidNeedSend)) {
             for (let tid of tidNeedSend) {
                 args.push({
                     event: {
                         tid: tid,
                         status: eventStatus
                     }
                 });
                 // 一起走的额外状态 转单绑定审单，配货绑定出库
                 let additionalEvent = QIMEN_MAP[eventStatus];
                 if (additionalEvent){
                     args.push({
                         event: {
                             tid: tid,
                             status: additionalEvent
                         }
                     });
                 }

             }

             // 待发送请求
             console.log('-----订单全链路待发送请求-----', args);

             qnRouter({
                 api: 'taobao.qimen.events.produce',
                 params: {
                     messages: JSON.stringify(args)
                 },
                 callback: (rsp) => {
                     console.log('批量添加订单链路rsp', rsp);
                     if (eventStatus == 'QIMEN_ERP_TRANSFER' || eventStatus == 'QIMEN_ERP_CHECK') {
                         // 修改缓存
                         for (let tid of tidNeedSend) {
                             orderWatcher[tid] = 1;
                         }
                         storage.setItem('orderWatcher' + getUserInfo().userNick, JSON.stringify(orderWatcher));
                     }
                 },
                 errCallback: (err) => {
                     console.error('批量添加订单链路发生错误', err);
                 }
             });
         } else {
             console.log('没有需要增加到链路的订单~');
         }
    });

}
