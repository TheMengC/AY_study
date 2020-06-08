import * as types from './actionTypes'

/**
* @description 记录输入框输入的值
* @author SMC
* @date 2020-05-26
* @param {*} event
*/
export const searchNameValue = (e) => {
    let value = e.target.value
    return {type: types.SET_SEARCH_NAME,value}
}

/**
* @description 搜索功能
* @author SMC
* @date 2020-05-26
* @param {*} searchValue 搜索的名字
* @param {*} todoLists  展示的数组
*/
export const handleSearchValue = (searchValue, allLists) => {
    let pageLists = []
    if (searchValue) {
        pageLists = allLists.filter(item => {
            if (item.title.indexOf(searchValue) > -1) {
                return item
            }   
        })
    } else {
        pageLists = allLists
    }
    return {type: types.HANDLE_SEARCH_VALUE, pageLists}
}

/**
* @description 记录输入框输入的值
* @author SMC
* @date 2020-05-26
* @param {*} event
*/
export const setListValue = (e) => {
    let value = e.target.value
    return {type: types.SET_LIST_VALUE,value}
}

/**
* @description 将输入框的值添加到数组中
* @author SMC
* @date 2020-05-26
* @param {*} addValue 输入框的值
* @param {*} todoLists 总数组
*/
export const handleAddValue = (addValue, todoLists, over) => {
    let lists = []
    if (addValue) {
        lists = [...todoLists, {title:addValue, over: over}]
        addValue = ""
    }
    return {type: types.HANDLE_ADD_VALUE, lists, addValue}
}

/**
* @description 记录第一个输入框输入的值
* @author SMC
* @date 2020-05-26
* @param {*} event
*/
export const setValueOne = (e) => {
    let value = e.target.value
    return {type: types.SET_VALUE_ONE, value}
}

/**
* @description 记录第二个输入框输入的值
* @author SMC
* @date 2020-05-26
* @param {*} event
*/
export const setValueTwo = (e) => {
    let value = e.target.value
    return {type: types.SET_VALUE_TWO, value}
}

/**
* @description 记录第三个输入框输入的值
* @author SMC
* @date 2020-05-26
* @param {*} event
*/
export const setValueThree = (e) => {
    let value = e.target.value
    return {type: types.SET_VALUE_THREE, value}
}

/**
* @description 将输入框的值添加到数组中
* @author SMC
* @date 2020-05-26
* @param {*} one 第一个输入框的值
* @param {*} two 第二个输入框的值
* @param {*} three 第三个输入框的值
* @param {*} todoLists 要展示的数组
*/
export const handleThreeMsg = (one, two, three, todoLists, over) => {
    console.log(one, two, three)
    let list = []
    if (one) {
        list = [...list, {title:one, over: over}]
        one = "";
    }
    if (two) {
        list = [...list, {title:two, over: over}];
        two = "";
    }
    if (three) {
        list = [...list, {title:three, over: over}];
        three = ""
    }
    console.log(list)
    let arrList = [...todoLists, ...list]
    return {type: types.HANDLE_THREE_MSG, one, two, three, arrList}
}

/**
* @description 控制弹窗的出现
* @author SMC
* @date 2020-05-26
* @param {*} id 编辑的那条信息的id
* @param {*} show 弹窗的出现和消失
* @param {*} todoLists 要展示的数组
*/
export const handleChangeItem = (id, show, todoLists) => {
    if (todoLists[id].over) {
        show = false
    } else {
        show = true
    }
    return {type: types.HANDLE_CHANGE_ITEM, id, show}
}

/**
* @description 控制弹窗的消失
* @author SMC
* @date 2020-05-26
* @param {*} show 弹窗的出现和消失
*/
export const closeShowWindow = (show) => {
    return {type: types.CLOSE_SHOW_WINDOW, show}
}

/**
* @description 记录弹窗input框的值
* @author SMC
* @date 2020-05-26
* @param {*} show 弹窗的出现和消失
*/
export const setInputItem = (e) => {
    let value = e.target.value
    return {type: types.SET_INPUT_ITEM, value}
}

/**
* @description 更改信息
* @author SMC
* @date 2020-05-26
* @param {*} todeLists 展示的数组
* @param {*} allLists 总数组
* @param {*} items 更改的新信息
* @param {*} id 编辑信息的id
* @param {*} show 弹窗的出现和消失
*/
export const handleSureItem = (todoLists, allLists,items, id, show) => {
    todoLists.splice(id, 1, {title:items, over:false})
    allLists.splice(id, 1, {title:items, over:false})
    return {type: types.HANDLE_SURE_ITEM, todoLists, allLists, show}
}

/**
* @description 完成
* @author SMC
* @date 2020-05-26
* @param {*} todeLists 展示的数组
* @param {*} allLists 总数组
* @param {*} over 是否完成
* @param {*} index 编辑信息的id
*/
export const handleClickOver = (over, index,todoLists, allLists) => {
    let todo = [...todoLists]
    let all = [...allLists]
    todo[index].over = over
    all[index].over = over
    return {type: types.HANDLE_CLICK_OVER, todo, all}
}

/**
* @description 删除信息
* @author SMC
* @date 2020-05-26
* @param {*} todeLists 展示的数组
* @param {*} allLists 总数组
* @param {*} index 编辑信息的id
*/
export const handleDeleteItem = (index,todoLists, allLists) => {
    let todo = [...todoLists]
    let all = [...allLists]
    todo.splice(index, 1)
    all.splice(index, 1)
    return {type: types.HANDLE_DELETE_ITEM, todo, all, index}
}