import React, { Component } from 'react';
import './index.css';
import axios from 'axios';

import Header from './header/index';
import Search from './search/index';
import Content from './content/index';
import Paging from './paging/index';
import ShowWindow from './showWindow/index';

class UserLists extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userLists: [],  // 接口请求到总数组
            number: 10,    // 每页要展示的数组长度
            currentPages: 1, // 当前被展示的页码数
            allPages: 0,   //总页数
            pages: [],     // 页数的数组
            pageLists: [], // 点击的页数要展示的数组
            name: [],       // 搜索的名字
            show: false,     // 控制弹窗的出现和消失
            age: "",        // 更改的年龄
            id: ""          // 编辑那条数据的id
        }
    }
    /**
     * @description 接口请求
     * @author SMC
     * @date 2020-05-26
     */
    componentDidMount() {
        axios.get('/lists.json')
            .then(res => {
                if (res.status == 200) {
                    // console.log(res.data.lists);
                    this.setState({
                        userLists: res.data.lists
                    });
                    this.toPageLists("", 1);
                }
            })
    }
    
    /**
     * @description 将总数组进行分页切割,获得页数数组和点击页的数组
     * @author SMC
     * @date 2020-05-26
     * @param {*} currentPages 点击的页数
     * @param {*} lists 需要被切割的数组
     */
    sliceLists = (lists, currentPages) => {
        const { number } = this.state;
        let pageLists = [];
        let page = Math.ceil(lists.length / number);
        let pages = new Array(page).fill('').map((item, index) => { return (index + 1) });
        if (currentPages < page) {
            pageLists = lists.slice((currentPages - 1) * number, currentPages * number);
        } else {
            pageLists = lists.slice((currentPages - 1) * number);
        }
        this.setState({
            pageLists: pageLists,
            pages: pages,
            currentPages: currentPages,
            allPages: page
        })
    }

    /**
     * @description 对总数组进行处理
     * @author SMC
     * @date 2020-05-26
     * @param {*} searchName 搜索的名字
     * @param {*} currentPages 点击的页数
     */
    toPageLists = (searchName,currentPages) => {
        let { userLists } = this.state;
        let searchList = [];
        userLists.map(item => {
            if (item.name.indexOf(searchName) > -1) {
                searchList.push(item);
            }
        })
        if (searchList.length > 0) {
            this.sliceLists(searchList, currentPages);
            this.setState({
                name: searchName
            });
        } else {
            this.sliceLists(userLists, currentPages);
        }
    }

    /**
     * @description 控制弹窗的出现和消失
     * @author SMC
     * @date 2020-05-26
     * @param {*} searchName 搜索的名字
     * @param {*} currentPages 点击的页数
     */
    showWindow = (value) => {
        this.setState({
            show: value
        });
    }

    /**
     * @description 记录编辑那条数据的id
     * @author SMC
     * @date 2020-05-26
     * @param {*} age 更改的年龄
     */
    sendId = (id) => {
        this.setState({
            id: id
        })
    }

    /**
     * @description 更改的年龄
     * @author SMC
     * @date 2020-05-26
     * @param {*} age 更改的年龄
     */
    changeAge = (age) => {
        console.log(age)
        const { pageLists, id } = this.state;
        pageLists.map(item => {
            if (item.id == id) {
                item.age = age
            }
        })
    }

    render() {
        const { currentPages, allPages, name, pages, pageLists, show } = this.state;
        return (
            <div className="user-lists">
                <Header />
                <Search toPageLists={this.toPageLists}/>
                <Content sendId={this.sendId} showWindow={this.showWindow} pageLists={pageLists} />
                <Paging currentPages={currentPages} allPages={allPages} name={name} pages={pages} toPageLists={this.toPageLists}/>
                {show ? <ShowWindow showWindow={this.showWindow} changeAge={this.changeAge}/> : " "}
            </div>
        )
    }
}

export default UserLists