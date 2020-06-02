import * as types from './actionTypes'
const defaultState = {
    userLists: [],  //接口请求总数据
    searchLists: [], // 搜索后的数组
    pageLists: [],  // 当前页展示的数组
    pages: [],  // 分页器的数组
    number: 10,  // 每页要展示的信息数量
    currentPages: 1, // 当前页数
    searchName: '',  // 搜索的名字
    show: false,    //弹窗是否展示
    id: '' ,        // 更改年龄的id
    age: ''         // 更改的年龄
}

function reducer (state = defaultState, action) {
    switch(action.type) {
        case types.INIT_USERLISTS_VALUE: 
            return Object.assign({}, state, {
                type: types.INIT_USERLISTS_VALUE,
                userLists : action.userLists,
                pageLists : action.pageLists,
                pages : action.pages
            })
        
        case types.GET_PAGELISTS_VALUE: 
            return Object.assign({}, state, {
                type: types.GET_PAGELISTS_VALUE,
                pageLists : action.pageLists,
                pages : action.pages
            })
        
        case types.CHANGE_PAGES_LISTS: 
            return Object.assign({}, state, {
                type: types.CHANGE_PAGES_LISTS,
                pageLists : action.pageLists,
                currentPages: action.currentPages
            })

        case types.SET_SEARCH_NAME:
            return Object.assign({}, state, {
                type: types.CHANGE_PAGES_LISTS,
                searchName : action.value
            })

        case types.GET_SEARCH_LIST:
            return Object.assign({}, state, {
                type: types.CHANGE_PAGES_LISTS,
                pageLists: action.pageLists,
                pages: action.pages,
                currentPages: action.currentPages
            })

        case types.CHANGE_SHOW_VALUE:
            return Object.assign({}, state, {
                type: types.CHANGE_SHOW_VALUE,
                show: action.show,
                id: action.id,
                age: action.age
            })

        case types.CHANGE_AGE_VALUE:
            return Object.assign({}, state, {
                type: types.CHANGE_SHOW_VALUE,
                age: action.age
            })    

        case types.CHANGE_SHOW_AGE:
            return Object.assign({}, state, {
                type: types.CHANGE_SHOW_AGE,
                show:action.show,
                age: action.age
            }) 
        
        default: 
           return state 
    }
}

export default reducer;