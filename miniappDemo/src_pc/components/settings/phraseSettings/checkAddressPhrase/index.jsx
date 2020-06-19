import Taro, { Component } from '@tarojs/taro';
import { View, Text, Textarea, Radio, Image } from '@tarojs/components';
import './index.scss';
import '../wwPhrases.scss';
import { checkAddressCustomPhraseSet, checkAddressDefaultChoiceSet,
    getCheckAddressCustomPhrase,
    getCheckAddressDefaultChoice } from "tradePublic/customPhrases";
import { CHECK_ADDRESS_CUSTOM_PHRASE_CHOICE,
    CHECK_ADDRESS_PHRASE,
    CHECK_ADDRESS_PHRASE_SPAN,
    WW_EMOJI_SPAN } from "tradePublic/customPhrases/consts";

class CheckAddressPhrase extends Component {
    constructor (props) {
        super(props);
        this.state = {
            customPhrase:'',
            defaultChoice:null,
            inputValue:'',
            editModal:false,
        };
    }

    async componentWillMount () {
        let customPhrase = await getCheckAddressCustomPhrase({ refresh:true });
        let defaultChoice = await getCheckAddressDefaultChoice();
        this.setState({ customPhrase, defaultChoice });
    }

    handleSaveOnClick () {
        let { inputValue }  = this.state;
        checkAddressCustomPhraseSet({
            value:inputValue,
            callback:() => {
                Taro.showToast({ title:'保存成功' });
                this.setState({
                    customPhrase:inputValue,
                    editModal:false,
                });
            },
        });
    }

    changeDefaultPhrase = (choice) => {
        checkAddressDefaultChoiceSet({
            value:choice,
            callback:() => {
                Taro.showToast({ title:'保存成功' });
                this.setState({ defaultChoice:choice });
            },
        });
    }

    addTextInTextarea (value) {
        let { inputValue } = this.state;
        inputValue += value;
        this.setState({ inputValue });
    }

    render () {
        let { customPhrase, defaultChoice, editModal, inputValue } = this.state;
        return (
            <View className='check-address-phrase-page'>
                <View className='tip'>
                    <Text className='iconfont iconfont-pingjiaduanyu-xinzengduanyu' />
                    <Text>常用短语状态在电脑端、手机端、旺旺插件同步显示，输入框编辑后记得保存哦~</Text>
                </View>
                <View className='phrase-template-list'>
                    <View className='title'>自定义核对地址模板</View>
                    <View className='content'>
                        <View className='phrase-item'>
                            <View className='phrase-content'>
                                <View className='main-content'>
                                    <Radio checked={CHECK_ADDRESS_CUSTOM_PHRASE_CHOICE == defaultChoice}
                                        onChange={event => this.changeDefaultPhrase(CHECK_ADDRESS_CUSTOM_PHRASE_CHOICE)}
                                    />
                                    {
                                        editModal ?
                                            <Textarea autoHeight={{ minRows: 3, maxRows: 10 }} className='textarea' value={inputValue}
                                                onInput={event => this.setState({ inputValue: event.detail.value })}
                                            />
                                            :
                                            <Text className='main-text'>{customPhrase}</Text>
                                    }
                                </View>
                                {
                                    editModal &&
                                    <View className='tip'>
                                        <Text className='iconfont iconfont-sanjiaoxingjinggao' />
                                        <Text>{'用鼠标在上方选择要插入的位置后，再点击下方<文本标签>就可以插入对应的信息~'}</Text>
                                    </View>
                                }
                                {
                                    editModal ?
                                        <View>
                                            <View className='edit-buttons'>
                                                <View className='insert-span'>
                                                    <Text className='span-title'>文本标签</Text>
                                                    <View className='span-list'>
                                                        {
                                                            CHECK_ADDRESS_PHRASE_SPAN.map(
                                                                item =>
                                                                    <View className='span' onClick={() => {
                                                                        this.addTextInTextarea(item);
                                                                    }}
                                                                    >
                                                                        <Text className='span-text'>{item}</Text>
                                                                    </View>
                                                            )
                                                        }
                                                    </View>
                                                </View>
                                            </View>
                                            <View className='edit-buttons'>
                                                <View className='insert-span'>
                                                    <Text className='span-title'>表情表情</Text>
                                                    <View className='span-list'>
                                                        {
                                                            WW_EMOJI_SPAN.map(
                                                                item =>
                                                                    <View className='span' onClick={() => {
                                                                        this.addTextInTextarea(item.key);
                                                                    }}
                                                                    >
                                                                        <Image className='ww-emoji-span' src={item.image} />
                                                                    </View>
                                                            )
                                                        }
                                                    </View>
                                                </View>
                                                <View className='form-btn'>
                                                    <View className='trade-btn-small-normal trade-btn-left'
                                                        onClick={() => this.setState({ editModal: false })}
                                                    >取消</View>
                                                    <View className='trade-btn-small-primary'
                                                        onClick={this.handleSaveOnClick}
                                                    >保存</View>
                                                </View>
                                            </View>
                                        </View>
                                        :
                                        <View className='extra-button'>
                                            <View className='trade-btn-small-empty'
                                                onClick={() => this.setState({
                                                    editModal: true,
                                                    inputValue: customPhrase,
                                                })}
                                            >编辑</View>
                                        </View>
                                }
                            </View>
                        </View>
                    </View>
                </View>
                <View className='phrase-template-list'>
                    <View className='title'>默认短语</View>
                    <View className='content check-address-content'>
                        {
                            Object.keys(CHECK_ADDRESS_PHRASE).map(choice =>
                                <View className='phrase-item'>
                                    <View className='phrase-content'>
                                        <View className='main-content'>
                                            <Radio checked={choice == defaultChoice}
                                                onChange={event => this.changeDefaultPhrase(choice)}
                                            />
                                            <Text className='main-text'>{CHECK_ADDRESS_PHRASE[choice]}</Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        }
                    </View>
                </View>
            </View>
        );
    }
}

export default CheckAddressPhrase;