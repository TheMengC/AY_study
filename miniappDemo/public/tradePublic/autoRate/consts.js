export const DEFAULT_AUTO_RATE_DATASOURCE = [
    { ischecked:'0', content:'谢谢，很好的买家！' },
    { ischecked:'0', content:'谢谢，欢迎下次惠顾小店！' },
    { ischecked:'0', content:'谢谢亲的支持！欢迎下次惠顾！' },
    { ischecked:'0', content:'期待您的下次光临，我们会做得更好！' },
    { ischecked:'0', content:'谢谢您的光临，新款随时上请继续关注小店！' },
];

export const DEFAULT_SMS_SWITCH = [
    { name:'smspay', value:false },
    { name:'smssecond', value:false },
    { name:'smssend', value:false },
    { name:'smsgood', value:false },
    { name:'smsbad', value:false },
    { name:'smswl', value:false },
    { name:'smscity', value:false },
    { name:'smsdispatch', value:false },
    { name:'smsurgerate', value:false },
    { name:'smscare', value:false },
];

export const DEFAULT_AUTO_RATE_TABS = {
    SUCCESS_LOG: 'SUCCESS_LOG',
    FAILURE_LOG: 'FAILURE_LOG',
    WAITING_LOG: 'WAITING_LOG',
};
export const DEFAULT_AUTO_RATE_HEAD_TITLE = {
    'SUCCESS_LOG': [
        { title: '买家旺旺', grid: 6, fieldName: 'buyer_nick' },
        { title: '订单编号', grid: 6, fieldName: 'tradeid' },
        { title: '评价时间', grid: 6, fieldName: 'opttime' },
        { title: '评价内容', grid: 6, fieldName: 'content' },
    ],
    'FAILURE_LOG': [
        { title: '买家旺旺', grid: 6, fieldName: 'buyer_nick' },
        { title: '订单编号', grid: 6, fieldName: 'tradeid' },
        { title: '评价时间', grid: 6, fieldName: 'opttime' },
        { title: '失败原因', grid: 6, fieldName: 'content' },
    ],
    'WAITING_LOG': [
        { title: '买家旺旺', grid: 6, fieldName: 'buyer_nick' },
        { title: '订单编号', grid: 6, fieldName: 'tid' },
        { title: '预计评价时间', grid: 6, fieldName: 'optime' },
        { title: '买家确认时间', grid: 6, fieldName: 'end_time' },
    ],
    'BLACK_LIST': [
        { title: '买家旺旺', grid: 6, fieldName: 'blacknick' },
        { title: '拉黑时间', grid: 6, fieldName: 'blacktime' },
        { title: '拉黑原因', grid: 6, fieldName: 'blackreason' },
        { title: '操作', grid: 6, fieldName: '' },
    ],
};
