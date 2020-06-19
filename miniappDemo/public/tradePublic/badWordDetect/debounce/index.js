import {isEmpty,consoleLogger} from 'tradePolyfills';

// 防抖函数处理 
/***
 * fn  需要处理的函数
 * delay  延迟几秒钟
 */
export  function debounce(fn,delay){
    let timer
    if(timer){
        clearInterval(timer)
    }
    timer=setTimeout(()=>{
        fn.apply(this)
        clearInterval(timer)
    },delay)
}