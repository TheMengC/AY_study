import qnRouter from "tradePublic/qnRouter";

export function taobaoLogisticsAddressSearch({query,callback,errCallback}){
    qnRouter({
        api: 'taobao.logistics.address.search',
        params: query,
        callback: (rsp) => {
            callback(rsp);
        },
        errCallback: (error) => {
            if (errCallback){
                errCallback(error);
            } else{

            }
        }
    })
}

export function taobaoLogisticsAddressAdd({query,callback,errCallback}){
    qnRouter({
        api: 'taobao.logistics.address.add',
        params: query,
        callback: (rsp) => {
            callback(rsp);
        },
        errCallback: (error) => {
            if (errCallback){
                errCallback(error);
            } else{

            }
        }
    })
}

export function taobaoLogisticsAddressRemove({query,callback,errCallback}){
    qnRouter({
        api: 'taobao.logistics.address.remove',
        params: query,
        callback: (rsp) => {
            callback(rsp);
        },
        errCallback: (error) => {
            if (errCallback){
                errCallback(error);
            } else{

            }
        }
    })
}

export function taobaoLogisticsAddressModify({query,callback,errCallback}){
    qnRouter({
        api: 'taobao.logistics.address.modify',
        params: query,
        callback: (rsp) => {
            callback(rsp);
        },
        errCallback: (error) => {
            if (errCallback){
                errCallback(error);
            } else{

            }
        }
    })
}
