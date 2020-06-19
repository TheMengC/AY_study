import Taro,{Component} from '@tarojs/taro'
import {View,Button,Text} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import routerInit from 'pcComponents/miniapp-router/lib/router'
import {add,minus,asyncAdd} from '../../actions/counter'
import {AtButton,AtTabs, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import './index.scss'


export function showTestDialog(){

}
class TestDialog extends Component{

    constructor(props){
        super(props);

    }

    initState(){

    }

    componentWillMount(){

    }

    componentDidMount(){
    }

    componentWillUnmount(){ }

    componentDidShow(){ }

    componentDidHide(){ }

    onClose=()=>{
        this.props.onClose();
    }
    render(){
        return <AtModal isOpened>
            <AtModalHeader>
                哈哈哈
            </AtModalHeader>
            <AtModalContent>
                {this.props.text}
            </AtModalContent>
            <AtModalAction>
                <Button onClick={this.onClose}>
                    关闭
                </Button>
            </AtModalAction>
        </AtModal>
    }
}

export default TestDialog;
