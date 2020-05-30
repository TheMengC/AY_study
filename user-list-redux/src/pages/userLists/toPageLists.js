    /**
     * @description 对总数组进行处理
     * @author SMC
     * @date 2020-05-26
     * @param {*} userLists 总数组
     * @param {*} searchName 搜索的名字
     * @param {*} number 每页要展示的数组数量
     * @param {*} currentPages 点击的页数
     */
const toPageLists = ({ userLists,currentPages, number, searchName }) => {
    let lists = userLists
    let searchLists = lists.filter(item => { 
        if (searchName && item.name.indexOf(searchName) > -1) {
            return item
        }
    })
    if (searchLists.length > 0) {
        lists = searchLists
    }
    let page = Math.ceil(lists.length / number)
    if(currentPages < 1) {
        currentPages = 1
    } else if (currentPages > page) {
        currentPages = page
    } 
    let pageLists = lists.slice((currentPages - 1) * number, currentPages * number)
    let pages = new Array(page).fill('').map((item, index) => { return (index + 1) });
    console.log(pages, pageLists, currentPages)
    return {pages, pageLists, currentPages}
}

export default toPageLists