import { CHANGE_SHOW_AGE,CHANGE_AGE_VALUE, INIT_USERLISTS_VALUE, GET_PAGELISTS_VALUE, CHANGE_PAGES_LISTS, SET_SEARCH_NAME, GET_SEARCH_LIST, CHANGE_SHOW_VALUE} from './actionTypes'
import axios from 'axios'
import toPageLists from 'pages/userLists/toPageLists'

export const inituserListsValue = (userLists, pageLists, pages) => ({
    type: INIT_USERLISTS_VALUE,
    userLists,
    pageLists,
    pages
})

export const  getUserLists = () => {
    return (dispatch) => {
        axios.get('/lists.json')
            .then(res => {
                let userLists = res.data.lists
                let toLists = toPageLists({ userLists: userLists, currentPages: 1, number: 10 })
                let pageLists = toLists.pageLists
                let pages = toLists.pages
                const action = inituserListsValue(userLists, pageLists, pages)
                dispatch(action)
        })
    }
}

export const getPagesLists = (pageLists, pages) => ({
    type: GET_PAGELISTS_VALUE,
    pageLists,
    pages
})

export const changePagesLists = (pageLists, currentPages) => ({
    type: CHANGE_PAGES_LISTS,
    pageLists,
    currentPages
})

export const setSearchName = (value) => ({
    type: SET_SEARCH_NAME,
    value
})

export const getSearchList = (pageLists, pages, currentPages) => ({
    type: GET_SEARCH_LIST,
    pageLists,
    pages,
    currentPages
})

export const changeShowValue = (show, id, age) => ({
    type: CHANGE_SHOW_VALUE,
    show,
    id,
    age
})

export const changeAgeValue = (age) => ({
    type: CHANGE_AGE_VALUE,
    age
})

export const changeShowAge = (show, age) => ({
    type: CHANGE_SHOW_AGE,
    show,
    age
})