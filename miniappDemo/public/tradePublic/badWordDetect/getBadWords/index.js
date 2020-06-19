import {isEmpty ,api,localStorage} from 'tradePolyfills';
/**
 * 获取违规词公共方法
 * @param {*} callback 
 */
const getBadWords=(callback)=>{
    let tbtime = new Date().getTime();
    const res= localStorage.getItemSync("badword")
    const date=new Date(res.gettime).getTime()
    let  timeminus=tbtime - date
    let day=Math.floor(timeminus/(24*3600*1000))  
    if(  isEmpty(res.data) ||day> 1){
        api({
            apiName:"aiyong.item.badword.get",
            args:{
                mode:"json"
            },
            callback:(data)=>{
                localStorage.setItem("badword",{data,gettime:new Date()})
                callback(data)
            }
        })
    }else{
        callback(res.data)
    }
}
export { getBadWords };