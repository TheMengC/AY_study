import { REFUND_CHANGE } from "./config";

let defalutStates = {
    searchVal: '',
    activeTabKey: 'WAIT_BUYER_PAY',
    tradeCounts: {},
    pageSize: 20,
    pageNo: 1,
    list:[],
    isLoading: true,
}

export function orderListReducer (state = defalutStates, action) {
    switch (action.type) {
        case REFUND_CHANGE:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}