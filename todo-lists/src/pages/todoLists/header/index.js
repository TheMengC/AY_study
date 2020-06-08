import React, { Component } from 'react'
import './index.css'
import {Link} from 'react-router-dom'

class Header extends Component {
    render() {
        return (
            <div className="header">
                <div className="header-title">TodeLists</div>
                <div className="router">
                    <ul className="router-link">
                        <li>
                            <Link style={{ textDecoration:'none'}} to="/">列表详情</Link>
                        </li>
                        <li>
                            <Link style={{ textDecoration:'none'}} to="/addMsg">添加信息</Link>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Header;