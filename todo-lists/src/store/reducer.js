import { combineReducers } from 'redux'  // 用来合并每个页面的reducer
import { reducer as todoListsReducer } from 'pages/todoLists/store'

const reducer = combineReducers({
    todoLists: todoListsReducer
})

export default reducer;