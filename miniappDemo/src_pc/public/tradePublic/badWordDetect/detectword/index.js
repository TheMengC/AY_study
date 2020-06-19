import { isEmpty,consoleLogger ,sqlHelper} from 'tradePolyfills';
import {taobaoItemsSellerListGet}  from "tradePublic/itemTopApi/taobaoItemsSellerListGet"
import {taobaoItemListGet}  from  "tradePublic/itemTopApi/taobaoItemListGet"
import {getBadWords} from "tradePublic/badWordDetect/getBadWords"
// eslint-disable-next-line import/first
import { NOOP } from "tradePolyfills/index";
import {showModal } from 'tradePublic/itemDetail/common';
//  定义数据库语句
const createSql = 'CREATE TABLE IF NOT EXISTS BadWordDetection(id integer PRIMARY KEY AUTOINCREMENT,num_iid varchar(30),title varchar(200), pic_url  varchar(200) ,badword  varchar(10)  ,type integer, desc varchar(500) )';

/**
 * 创建含有违规词的数据库
 */
export function createTable(){
    return sqlHelper.doSqlAsync({
        sql: createSql,
    });
}

/** 
 * 查询语句封装方法
 */
export function  select(selcetSql){
    return sqlHelper.doSqlAsync({
        sql: selcetSql,
    })
}

/**
 * pageNo  页数
 * status   出售中 仓库中
 * totalItems  是numid 组成的数组 
 */
let  totalItems=[]
export  function  getbabylist({pageNo,status,showCallback}){
    return new Promise(resolve=>{
        function getall({pageNo,status,showCallback}){
            taobaoItemListGet({
                fields:"total_results,num_iid",
                page_no:pageNo, 
                page_size:20, 
                status, 
                callback:(res)=>{
                    const {items,total_results}=res
                    if(pageNo==1){
                        showCallback(total_results)
                    }
                    items.item.map(elem=>{
                        totalItems.push(elem.num_iid)
                    })
                    if(pageNo*20<total_results){
                        pageNo++
                        getall({pageNo,status})
                    }else{
                        resolve(totalItems) 
                    }
                } 
            })
        }
        getall({pageNo:1,status,showCallback})
    }) 
    
}

/**
 *  获取关键词 
 */
function  getbadwords(babyData){
    //  存放关键词的数组
    return  new Promise(resolve=>{
        let badWord=[]
        getBadWords((data)=>{
            badWord=data.split("、");
            badWord.pop()
            badWord.forEach((elem,index)=>{
                let reg=/[+]/
                if(reg.test(elem)){
                    badWord[index]=elem.replace(/[+]/,"[\\u4e00-\\u9fa5_a-zA-Z0-9]{0,}")
                }
                if(elem=="**之王"){
                    badWord[index]="\\*\\*之王"
                }
                if(elem=="NO.1"){
                    badWord[index]="NO\\.1"
                }
            })
            resolve({
                badWord,babyData
            })
        })
    })
}
/**
 * 
 * @param  num_iids 
 */
export  const detectword=(num_iids)=>{
    return  new Promise(resolve=>{
        let total_results=num_iids.length;
        let num=Math.ceil(total_results/20);
        let babyData = [];
        let pageNo=0;
        for(let i=0;i<num;i++){
            let num_iidStr =num_iids.slice(20*i,20*i+20).join(',');
            setTimeout(()=>{
                taobaoItemsSellerListGet({
                    num_iids: num_iidStr,
                    fields:"desc,sell_point,num_iid,title,pic_url",
                    callback: res => {
                        const {items}=res
                        babyData=babyData.concat(items.item) 
                        ++pageNo;
                        if (pageNo*20>=total_results) {
                            resolve(babyData)
                        }
                    },
                    errCallback: (error)=>{
                        ++pageNo;
                        if (pageNo*20>=total_results) {
                            resolve(babyData)
                        }
                    },
                })
            },i*50)
        }
    })    
}

/** 
 * status  出售中还是仓库中
 */
export const  detectbadword=({status,callback,showCallback,finishCallBack=NOOP})=>{
    // 每次掉接口 清空一下全局变量的totalItems
    totalItems=[]
    // 定义一个 存放查询sql的数组 
    let sqls=[]
    getbabylist({pageNo:1,status,showCallback}).then((numIid)=>{
        return detectword(numIid)
    }).then(babyData=>{
        return  getbadwords(babyData)
    }).then((res)=>{
        const {badWord,babyData}=res
        //  定义批量插入的数组 
        let  str=badWord.join("|")
        let  reg=new RegExp(str,"g")
        //  顶一个关键词的总数组 
        let total=[]
        //  解构关键词  宝贝数据
        // 定义多个promise 的数组
        babyData.forEach((elem,index)=>{
            //  匹配出关键词数组标题和详情 
            let badTitle= elem.title.match(reg)
            //  详情的话值匹配  不匹配标签内的内容  
            let  re=new RegExp(/<[^>]+>/g);
            // 匹配出 标签的内容 看一看是不是有标签
            let  text = elem.desc.split(re).join();
            //  如果匹配的不为空
            let  badDesc=[]
            if( !isEmpty(text.match(reg)) ){
                badDesc=text.match(reg)
                
            }
            //  数组去重
            badDesc=[...new Set(badDesc)]
            badTitle=[...new Set(badTitle)]
            elem.badtitle=badTitle;
            elem.badDesc=badDesc ;
            // 如果 不为空 就添加到总数组中
            if(!isEmpty(badTitle)||!isEmpty(badDesc)){
                // 将详情和标题 对应的badword  插入到数据库中   
                sqlInsert(badTitle,elem,1,sqls,elem.desc);
                sqlInsert(badDesc,elem,3,sqls,elem.desc);
                total.push(JSON.stringify(badTitle))
                total.push(JSON.stringify(badDesc))
            }
            callback(index,babyData.length,total);
            //  遍历结束后 
            if(index==babyData.length-1){
                createsqlTable(sqls,status)
                try{
                    finishCallBack(sqls) 
                }catch(err){
                    consoleLogger.log(err)
                }
                
            }
        })
    
    })
}


/**
 *  创建数据库 并从数据中插入数据
 * sqls  批量插入的数据
 * status  出售中还是仓库中
 */
function  createsqlTable(sqls,status){
    if(!isEmpty(sqls)){
        createTable().then(()=>{
            select("delete from BadWordDetection").then( ()=>{
                // 批量插入数据
                my.qn.database({
                    method: "batchSql",
                    sql: sqls,
                    success: (res) => {
                        select("select * from BadWordDetection")
                    },
                    fail: (error) => {
                        showModal({
                            content: `获取${status}数据失败！`+JSON.stringify(error),
                            showCancel: false
                        })
                        return
                    }
                })
            })
        })
    }
}

/**
 * 
 * @param {关键词数组} arr 
 * @param {每个宝贝} elem 
 * @param {1代表标题,3 代表详情} type 
 */
function sqlInsert(arr,elem,type,sqls,newdesc){
    //非空验证  有可能匹配的是null 
    if(!isEmpty(arr)){
        arr.map(bad=>{
            sqls.push(`INSERT INTO BadWordDetection (num_iid,title,pic_url,badword,type,desc)  VALUES (${elem.num_iid},'${elem.title}','${elem.pic_url}','${bad}',${type}, '${newdesc}' )  `)
        })
    }
}