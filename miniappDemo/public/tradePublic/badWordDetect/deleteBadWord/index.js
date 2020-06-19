import {UpdateText,UpdateTitleNew} from "tradePublic/updateBaby"
import {isEmpty,consoleLogger} from 'tradePolyfills';
import  {select} from "tradePublic/badWordDetect/detectword";

// 定义一个总个数
let  totalNum=0
//   删除关键字
/***
 * data  宝贝的数据
 * sellerType  买家类型
 *  callback  成功回调
 *  errCallback  错误回调
 */
export  const deleteBadWord=({data,sellerType,callback,errCallback})=>{
    //  定义一个总详的promsie 
    let asyncPromise=[]
    totalNum=0
    //   循环遍历选中宝贝  
    new Promise(resolve=>{
        data.map((elem,index)=>{
            let  badword=elem.badword
            // 如果当前选中的是详情
            if(elem.descChecked&&!elem.titleChecked){
                //  这时候返回的是一个数组
                asyncPromise.push(select(`SELECT id, desc,num_iid ,badword from  BadWordDetection  where type=3 and badword='${badword}'`)) 
            }
            //  如果选中的是标题
            if(elem.titleChecked&&!elem.descChecked){
                asyncPromise.push(select(`SELECT id, title,num_iid,badword from  BadWordDetection  where type=1 and badword='${badword}'`))
            }
            // 如果当前标题 和详情都选中 
            if(elem.titleChecked&&elem.descChecked){
                asyncPromise.push(select(`SELECT id, title,num_iid,badword,desc  from  BadWordDetection  where  badword='${badword}'`))
            }
            // 如果当前下标 和数组的长度-1 相等 表示以及遍历结束
            if(index==data.length-1){
                Promise.all(asyncPromise).then(res=>{
                    //  数组扁平化
                    let arr=res.flat(1)
                    //  过滤出 标题和详情  和过滤出 既有标题也有详情的
                    let  title=[]
                    let  desc=[]
                    let  all=[]
                    arr.forEach(elem=>{
                        if(!isEmpty(elem.title)&&isEmpty(elem.desc)){
                            title.push(elem)
                        }else if(!isEmpty(elem.desc)&&isEmpty(elem.title)){
                            desc.push(elem)
                        }else{
                            all.push(elem)
                        }
                    })
                    // 遍历当前数组 
                    let titles= concactId(title)
                    let descs=concactId(desc)
                    let alls=concactId(all)
                    resolve({
                        titles,descs,alls
                    })
                })
            }
        })
    }).then((total)=>{
        const  {titles,descs,alls}=total
        for(let item of titles ){
            updateuncle(item,sellerType,callback,errCallback,"0")
        }
        for(let item of descs ){
            updateuncle(item,sellerType,callback,errCallback,"1")
        }
        for(let item of alls){
            updateuncle(item,sellerType,callback,errCallback,"2")
        }

        
    })
}


//  将同一个宝贝多个关键词 合并在一起  还有数据库中id 
export  function  concactId(arr){
    let concatArr=[]
    arr.map(info=>{
        // 用标记当前宝贝是不是有新的违规词 
        let  flag=false
        //  定义关键词 和id 集合
        info.badwords=[]
        info.ids=[]
        concatArr.forEach(elem=>{
            // 如果遍历的宝贝 和已经存在的宝贝 num_iid 相等 
            if(elem.num_iid==info.num_iid){
                //  那么就是在原有的基础上加上多一个关键词  和id
                flag=true
                elem.badwords.push(info.badword)
                elem.ids.push(info.id)
            }    
        })
        if(!flag){
            info.badwords.push(info.badword)
            info.ids.push(info.id)
            concatArr.push(info)
        }
    })
    return concatArr

}

/***
 * title   接受的标题还是关键词
 * badwords  关键词数组  
 */
function  replaceBadWord({title="xx",desc="xx",badwords}){
    let newbadwords=[...new Set(badwords)]
    for(let i in newbadwords){
        if (newbadwords[i]=="**之王") {
            title=title.replace(/之王/g,'');
            desc=desc.replace(/之王/g,'');
        }
        else if (newbadwords[i] == '100%') {
            title=title.replace(/([(width)|(height)]\s*[:|=]\s*['|"]?\s*(calc\(\s*)?)?100\.?\d*%/g, function($0, $1){
                return $1 ? $0 : '';
            });
            desc=desc.replace(/([(width)|(height)]\s*[:|=]\s*['|"]?\s*(calc\(\s*)?)?100\.?\d*%/g, function($0, $1){
                return $1 ? $0 : '';
            });
        } else {
            let reg=new RegExp(newbadwords[i],"g")
            title=title.replace(reg,'');
            desc=desc.replace(reg,"")
        }
    }
    return  {title,desc}
}
/**
* 删除单个违规词
* @author WZF
* items  商品信息
* type   0  表示标题  1 表示详情  2 表示标题和详情都更新
*/


export  function updateuncle(items,sellerType,callback,errCallback,type){
    totalNum++
    //  去除关键词后的信息
    let  updateText=""
    switch (type) {
    case "0":
        updateText=replaceBadWord({title:items.title,badwords:items.badwords}).title
        break;
    case "1":
        updateText=replaceBadWord({desc:items.desc,badwords:items.badwords}).desc
        break
    default:
        updateText=replaceBadWord({desc:items.desc,badwords:items.badwords,title:items.title})
        break;
    }
    let num_iid=items.num_iid;
    if(type!=2){
        UpdateText({
            type:isEmpty(items.desc)?1:3,
            update_text:updateText,
            seller_type:sellerType,
            num_iid:num_iid,
            callback: (res)=>{
                select(`delete from BadWordDetection where id in (${items.ids.join(",")})`).then(res=>{
                    callback({items,totalNum})
                })
            },
            errCallback:(error)=>{
                errCallback({items,error,updateText,totalNum})
            }
        });
    }else{
        consoleLogger.log(items,"查看既有标题也有商品的")
        UpdateTitleNew({
            title:updateText.title,
            desc:updateText.desc, 
            num_iid, 
            callback:()=>{
                select(`delete from BadWordDetection where id in (${items.ids.join(",")})`).then(res=>{
                    callback({items,totalNum})
                })
            },
            errCallback:(error)=>{
                errCallback({items,error,updateText,totalNum})
            }
        })
    }
    
}