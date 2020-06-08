import React, { Component } from 'react'
import './index.css'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Header from './header'
import ListDetail from './listDetail'
import AddMsg from './addMsg'

class TodeLists extends Component {

    render() {
        return (
            <Router>
                <div className="todo-lists">
                    <Header />
                    
                    <Route path="/" exact component={ListDetail}></Route>
                    <Route path="/addMsg" component={AddMsg}></Route>
                </div>
            </Router>
            
        )
    }
}

export default TodeLists