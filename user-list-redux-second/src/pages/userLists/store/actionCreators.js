import * as types from './actionTypes'
import axios from 'axios'


export const  getUserLists = () => {
    return (dispatch) => {
        axios.get('/lists.json')
            .then(res => {
                let userLists = res.data.lists
                let toLists = toPageLists({ userLists: userLists, currentPages: 1, number: 10 })
                let pageLists = toLists.pageLists
                let pages = toLists.pages
                const action = {type: types.INIT_USERLISTS_VALUE,userLists,pageLists,pages}
                dispatch(action)
        })
    }
}

/**
 * @description 对用户信息进行编辑
 * @author SMC
 * @date 2020-05-26
 * @param {*} show 控制弹窗是否展示
 * @param {*} id 编辑数组的id
 * @param {*} age 编辑数组的年龄
 */
export const showWindowValue = (show, id, age) => {

    const action = {type: types.CHANGE_SHOW_VALUE,show,id,age}
    return action
}

/**
 * @description 切换分页展示
 * @author SMC
 * @date 2020-05-26
 * @param {*} userLists 总数组
 * @param {*} item 当前要展示的页数
 * @param {*} number 每页要展示的数组数量
 */
export const changePageValue = (searchName, userLists, item, number) => {
    let {pageLists, currentPages} = toPageLists({ userLists: userLists, currentPages: item, number: number, searchName:searchName})
    const action = { type: types.CHANGE_PAGES_LISTS, pageLists, currentPages }
    return action
}

/**
* @description 记录输入框输入的值
* @author SMC
* @date 2020-05-26
* @param {*} event
*/
export const searchNameValue = (e) => {
    let value = e.target.value
    const action = {type: types.SET_SEARCH_NAME,value}
    return action
}

export const handleSearchList = (userLists, searchName, current, number) => {
    const {pageLists, pages, currentPages} = toPageLists({userLists:userLists, searchName:searchName, currentPages:current, number:number})
    const action = {type: types.GET_SEARCH_LIST,pageLists,pages,currentPages}
    return action
}

/**
 * @description 在输入框输入要更改的年龄
 * @author SMC
 * @date 2020-05-26
 * @param {*} e 
 */
export const setInputAge = (e) => {
    let age = e.target.value
    const action = {type: types.CHANGE_AGE_VALUE,age}
    return action
}

/**
 * @description 关闭弹窗
 * @author SMC
 * @date 2020-05-26
 * @param {*} show 控制弹窗是否展示 boolean
 */
export const closeShowWindow = (show) => {
    const action = {type: types.CHANGE_SHOW_VALUE,show}
    return action
}

/**
 * @description 确认更改用户年龄
 * @author SMC
 * @date 2020-05-26
 * @param {*} userLists 总数组
 * @param {*} id 要更改年龄用户的id
 * @param {*} show 弹窗是否展示
 * @param {*} age 要更改的年龄的值
 */
export const handleSureClick = (userLists, id, show, age) => {
    const action = {type: types.CHANGE_SHOW_AGE,show,age}
    userLists.map(item => {
        if(item.id == id) {
            item.age = age
        }
    })
    return action
}
    




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
    return {pages, pageLists, currentPages}
}