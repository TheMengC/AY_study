import { NOOP, isEmpty, api } from "tradePolyfills";

export function aiyongItemTmallItemSchemaUpdate({args={},callback = NOOP, errCallback = NOOP}){
    api({
        apiName:'aiyong.item.tmall.item.schema.update',
        args: args,
        callback: (res) => {
            callback && callback(res);
        },
        errCallback: (err) => {
            errCallback && errCallback(err);
        }
    })
}