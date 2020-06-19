import Taro, { Component } from '@tarojs/taro';
import { View, Button, Text } from '@tarojs/components';

import './pcNoticeBallon.scss';
import { isEmpty } from "mapp_common/utils";
import { goPage } from "mapp_common/marketing/utils/biz";

class NoticeBallon extends Component {

    constructor (props) {
        super(props);

        this.state = {
            hadShown: false,
            showNotice: true,
        };
    }

    componentWillReceiveProps (nextProps) {
        this.setState({ showNotice: nextProps.showNotice });
    }

    componentDidMount () { }

    hideBallon = () => {
        this.setState({ hadShown:true });
        this.props.close();
    }

    onClickNotice = (notice) => {
        if(!isEmpty(notice.adlink)) {
            goPage(notice.adlink);
        }
    }

    render () {
        const { showNotice, hadShown } = this.state;
        const { notice } = this.props;
        return (
            <View>
                <View onClick={this.hideBallon}>
                    公告
                </View>
                {
                    showNotice ?
                        <View className='pc-notice-ballon'>
                            <View className='ballon-header'>
                                <Text className='ballon-header-text'>公告</Text>
                                {
                                    hadShown ? null : <View className='ballon-hide' onClick={this.hideBallon}>收起</View>
                                }
                            </View>
                            <View className='ballon-content' onClick={() => {this.onClickNotice(notice);}}>
                                {notice.content}
                            </View>
                        </View>
                        :
                        null
                }
            </View>
        );
    }
}

export default NoticeBallon;
