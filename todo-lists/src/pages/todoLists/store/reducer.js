import * as types from './actionTypes'
const defaultState = {
    allLists: [],  // 总数组
    todoLists: [],  // 要展示的数组
    searchValue: "", // 列表详情页搜索框的值
    addValue: "",  // 列表详情页添加框的值
    valueOne: "",  // 添加信息页第一个输入框的值
    valueTwo: "",  // 添加信息页第二个输入框的值
    valueThree: "",  // 添加信息页第三个输入框的值
    show: false, // 弹窗是否出现
    id: "",  // 编辑的那条信息的id
    item: "", // 修改的那条信息的新的值
}

function reducer (state = defaultState, action) {
    switch(action.type) {

        case types.SET_SEARCH_NAME:
            return {...state,searchValue: action.value}
        
        case types.SET_LIST_VALUE:
            return {...state, addValue: action.value}

        case types.HANDLE_ADD_VALUE:
            return { ...state, todoLists: action.lists,allLists:action.lists, addValue: action.addValue }
        
        case types.SET_VALUE_ONE:
            return { ...state, valueOne: action.value }
        
        case types.SET_VALUE_TWO:
        return { ...state, valueTwo: action.value }
    
        case types.SET_VALUE_THREE:
            return { ...state, valueThree: action.value }
        
        case types.HANDLE_THREE_MSG:
            return { ...state, valueOne: action.one, valueTwo:action.two, valueThree: action.three, todoLists: action.arrList, allLists: action.arrList}
        
        case types.HANDLE_SEARCH_VALUE:
            return { ...state , todoLists:action.pageLists}
        
        case types.HANDLE_CHANGE_ITEM:
            return {...state, show:action.show, id: action.id}

        case types.CLOSE_SHOW_WINDOW:
            return {...state, show:action.show}
        
        case types.SET_INPUT_ITEM:
            return {...state, item: action.value}

        case types.HANDLE_SURE_ITEM:
            return{...state, todoLists: action.todoLists, allLists: action.todoLists, show:action.show}

        case types.HANDLE_CLICK_OVER:
            return{...state, allLists: action.all, todoLists: action.todo}

        case types.HANDLE_DELETE_ITEM:
            return{...state, allLists: action.all, todoLists:action.todo}

        default: 
           return state
    }
}

export default reducer;