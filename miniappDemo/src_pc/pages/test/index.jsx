import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { Text, View, Button } from '@tarojs/components';


@connect((store) => {
    return store.tradeDetailReducer;
})

class Test extends Component {

    constructor (props) {
        super(props);
    }

    onClick = () => {
        my.qn.navigateToQAP({
            url: 'https://www.taobao.com',
            query: {
                id: 123,
                name: "xxx",
            },
            success: (res) => {
                console.log(res); // {success: true}
            },
            fail: (res) => {
                console.log(res); // {"error":4,"errorMessage":"no permission"}
            },
        });
    }

    render () {
        return (
            <Button onClick={this.onClick}>测试</Button>
        )
        // return <web-view src="https://render.alipay.com/p/s/web-view/index" onMessage="onmessage"></web-view>;
    }
}

export default Test;

