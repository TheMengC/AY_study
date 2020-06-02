import { combineReducers } from 'redux'  // 用来合并每个页面的reducer
import { reducer as userListsReducer } from 'pages/userLists/store'

const reducer = combineReducers({
    userLists: userListsReducer
})

export default reducer;