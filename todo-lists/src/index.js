import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './store'
import { Provider } from 'react-redux'

const Apps = (
    <Provider store={store}>
        <App />
    </Provider>
)
ReactDOM.render(Apps,document.getElementById('root'));
