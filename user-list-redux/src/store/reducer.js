import {CHANGE_SHOW_AGE, CHANGE_AGE_VALUE, INIT_USERLISTS_VALUE, GET_PAGELISTS_VALUE, CHANGE_PAGES_LISTS, SET_SEARCH_NAME, GET_SEARCH_LIST, CHANGE_SHOW_VALUE} from './actionTypes'
const defaultState = {
    userLists: [],  //接口请求总数据
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
        case INIT_USERLISTS_VALUE: 
            return Object.assign({}, state, {
                type: INIT_USERLISTS_VALUE,
                userLists : action.userLists,
                pageLists : action.pageLists,
                pages : action.pages
            })
        
        case GET_PAGELISTS_VALUE: 
            return Object.assign({}, state, {
                type: GET_PAGELISTS_VALUE,
                pageLists : action.pageLists,
                pages : action.pages
            })
        
        case CHANGE_PAGES_LISTS: 
            return Object.assign({}, state, {
                type: CHANGE_PAGES_LISTS,
                pageLists : action.pageLists,
                currentPages: action.currentPages
            })

        case SET_SEARCH_NAME:
            return Object.assign({}, state, {
                type: CHANGE_PAGES_LISTS,
                searchName : action.value
            })

        case GET_SEARCH_LIST:
            return Object.assign({}, state, {
                type: CHANGE_PAGES_LISTS,
                pageLists: action.pageLists,
                pages: action.pages,
                currentPages: action.currentPages
            })

        case CHANGE_SHOW_VALUE:
            return Object.assign({}, state, {
                type: CHANGE_SHOW_VALUE,
                show: action.show,
                id: action.id,
                age: action.age
            })

        case CHANGE_AGE_VALUE:
            return Object.assign({}, state, {
                type: CHANGE_SHOW_VALUE,
                age: action.age
            })    

        case CHANGE_SHOW_AGE:
            return Object.assign({}, state, {
                type: CHANGE_SHOW_AGE,
                show:action.show,
                age: action.age
            }) 
        
        default: 
           return state 
    }
}

export default reducer;