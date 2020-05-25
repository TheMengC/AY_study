import React, { Component } from 'react';
import axios from 'axios'
import './index.css';
import Header from '../header/index.js';
import Search from '../search/index.js';
import Content from '../content/index.js';
import ShowWindow from '../showWindow/index.js'
import Paging from '../paging/index.js'

class UserLists extends Component {

    constructor(props) {
        super(props)
        this.state = {
            userLists: [],
            totalPages: [],
            pageLists: [],
            show:false,
            pages: '',
            id: ''
        }

        this.get = this.get.bind(this)
        this.handlePages = this.handlePages.bind(this)
        this.Show = this.Show.bind(this)
        this.Unshow = this.Unshow.bind(this)
        this.SearchName = this.SearchName.bind(this)
        this.ChangeAge = this.ChangeAge.bind(this)
        this.sendId = this.sendId.bind(this)
        this.ChangeAge = this.ChangeAge.bind(this)
    }

    componentDidMount () {
        this.get ()
    }

    // 数据请求
    get() {
        axios.get('/lists.json')
            .then(res => {
                // console.log(res)
                if (res.status == 200) {
                    let pages = Math.ceil(res.data.lists.length / 10)
                    let pageArr = []
                    for(let i = 0 ; i < pages ; i ++) {
                        pageArr.push(i)
                    }
                    let pageLists = res.data.lists.slice(0, 10)
                    // console.log(res.data.lists)
                    // console.log(this.state.userLists)
                    // console.log(pages)
                    this.setState({
                        userLists: res.data.lists,
                        totalPages: pageArr,
                        pageLists: pageLists,
                        pages: pages
                    })
                    // console.log(this.state.pages)
                };
        })
    }

    // 将数组进行分页
    handlePages(pages, lists, totalPages) {
        let pageListsArr = []
        if (pages < totalPages) {
            pageListsArr = lists.slice(pages * 10, pages * 10 + 10)
        } else {
            pageListsArr = lists.slice(pages * 10)
        }
        this.setState({pageLists: pageListsArr})
    }

    Show(data) {
        this.setState({show: data})
    }

    Unshow(data) {
        this.setState({show: data})
    }

    // 搜索查找
    SearchName(name) {
        let searchList = []
        this.state.userLists.map( item => {
            if(item.name.indexOf(name) > -1) {
                searchList.push(item)
            }
        })
        console.log(searchList)
        // this.setState({UserLists: searchList})
        // console.log(this.state.searchList)
        if(searchList.length > 0) {
            let page = Math.ceil(searchList.length / 10)
            let arr = []
            for(let i = 0 ; i < page ; i ++) {
                arr.push(i)
            }
            let pageLists = searchList.slice(0, 10)
            this.setState({
                totalPages: arr,
                pages: page,
                userLists: searchList,
                pageLists: pageLists
            })
        }
    }

    //  将id保存到父组件的state中
    sendId(id) {
        this.setState({
            id: id
        })
    }
    
    // 更改年龄
    ChangeAge(age) {
        for(let i = 0; i < this.state.pageLists.length; i++) {
            if(this.state.id == this.state.pageLists[i].id) {
                this.state.pageLists[i].age = age
            }
        }
        
    }

    render() {
        return (
            <div className="user-lists">
                <Header></Header>
                <Search get={this.get} SearchName = {this.SearchName}></Search>
                <Content sendId={this.sendId} userLists={this.state.userLists} totalPages={this.state.totalPages} pageLists={this.state.pageLists}  data={this.Show}></Content>
                <Paging pages={this.state.pages} totalPages={this.state.totalPages} AddPages={this.AddPages} handlePages={this.handlePages} userLists={this.state.userLists}></Paging>
                {this.state.show ? <ShowWindow ChangeAge={this.ChangeAge} data={this.Unshow} /> : ""}
            </div>
            
        )
    }
    
}

export default UserLists;