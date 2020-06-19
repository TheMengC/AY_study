import { REFUND_CHANGE } from "./config";


let initState = {
    searchVal: '',
    activeTabKey: 'ALL',
    tradeCounts: {},
    pageSize: 20,
    pageNo: 1,
    list:[],
    isLoading: true,
};


export function refundListReducer (state = initState, action) {
    switch (action.type) {
        case REFUND_CHANGE:
            return Object.assign({},state,action.data)
        default:
            return state;
    }
}
