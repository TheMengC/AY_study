export const getTraceActionInfo = (action) => {
    const TRACE_MAP = {
        TMS_SIGN: {
            name: '您的订单已签收',
            index: 0,
        },
        TMS_DELIVERING: {
            name: '派送中',
            index: 1,
        },
        CONSIGN: {
            name: '已发货',
            index: 2,
        },
        TMS_ACCEPT: {
            name: '已揽件',
            index: 3,
        },
    }
    if (TRACE_MAP[action]) {
        return TRACE_MAP[action];
    } else {
        return {
            name: '运输中',
            index: 4,
        };
    }
};
