import React, { Component } from 'react';
import Header from './header'
import Content from './content'
import Paging from './paging'
import Search from './search'
import ShowWindow from './showWindow'
import './index.css'

import { connect } from 'react-redux'
import { getUserLists } from './store/actionCreators'

class UserLists extends Component {

    componentDidMount() {
    /**
     * @description 接口请求
     * @author SMC
     * @date 2020-05-26
     */
       this.props.getUserLists()
    }


    render() {
        const {show} = this.props
        return (
            <div className="user-lists">
                <Header />
                <Search />
                <Content />
                <Paging />
                {show ? <ShowWindow /> : ''}
            </div>
        )
    }
}


export default connect((state) => {
    return {
         userLists: state.userLists.useLists,
         show: state.userLists.show
    }
}, {
    getUserLists

})(UserLists)