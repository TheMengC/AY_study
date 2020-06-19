import Taro, { Component } from '@tarojs/taro';
import { View, Text, Textarea, Radio } from '@tarojs/components';
import './index.scss';
import '../wwPhrases.scss';
import { WW_RUSH_PAY_CUSTOM_PHRASE_PAYTYPE,
    WW_RUSH_PAY_DEFAULT_PHRASE_MAP,
    WW_RUSH_PAY_PHRASE_GROUP, WW_RUSH_PAY_PHRASE_SPAN } from "tradePublic/customPhrases/consts";
import { getWwRushPayCustomPhrase, getWwRushPayDefaultPhrasePaytype,
    wwRushPayCustomPhraseSet,
    wwRushPayDefaultPhraseSet } from "tradePublic/customPhrases";

class WwRushPayPhrase extends Component {
    constructor (props) {
        super(props);
        this.state = {
            customPhrase:'',
            defaultPaytype:null,
            inputValue:'',
            editModal:false,
        };
    }

    async componentWillMount () {
        let customPhrase = await getWwRushPayCustomPhrase({ refresh:true });
        let defaultPaytype = await getWwRushPayDefaultPhrasePaytype();
        this.setState({ customPhrase, defaultPaytype });
    }

    /**
     * 添加催付标签
     * @param value
     */
    addTextInTextarea (value) {
        let { inputValue } = this.state;
        inputValue += value;
        this.setState({ inputValue });
    }

    /**
     * 催付短语保存
     */
    handleSaveOnClick () {
        let { inputValue } = this.state;
        wwRushPayCustomPhraseSet({
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

    changeDefaultPhrase = (paytype) => {
        wwRushPayDefaultPhraseSet({
            value:paytype,
            callback: () => {
                Taro.showToast({ title:'保存成功' });
                this.setState({ defaultPaytype:paytype });
            },
        });
    }

    render () {
        let { customPhrase, defaultPaytype, editModal, inputValue } = this.state;
        return (
            <View className='ww-rush-pay-phrase-page'>
                <View className='tip'>
                    <Text className='iconfont iconfont-pingjiaduanyu-xinzengduanyu' />
                    <Text>常用短语状态在电脑端、手机端、旺旺插件同步显示，输入框编辑后记得保存哦~</Text>
                </View>
                <View className='phrase-template-list'>
                    <View className='title'>自定义催付模板</View>
                    <View className='content'>
                        <View className='phrase-item'>
                            <View className='phrase-content'>
                                <View className='main-content'>
                                    <Radio checked={WW_RUSH_PAY_CUSTOM_PHRASE_PAYTYPE == defaultPaytype}
                                        onChange={event => this.changeDefaultPhrase(WW_RUSH_PAY_CUSTOM_PHRASE_PAYTYPE)}
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
                                        <View className='edit-buttons'>
                                            <View className='insert-span'>
                                                <Text className='span-title'>文本标签</Text>
                                                <View className='span-list'>
                                                    {
                                                        WW_RUSH_PAY_PHRASE_SPAN.map(
                                                            item =>
                                                                <View className='span' onClick={() => {
                                                                    this.addTextInTextarea(item.key);
                                                                }}
                                                                >
                                                                    <Text className='span-text'>{item.key}</Text>
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
                {
                    Object.keys(WW_RUSH_PAY_PHRASE_GROUP).map(key =>
                        <View className='phrase-template-list'>
                            <View className='title'>{key}</View>
                            <View className='content'>
                                {
                                    WW_RUSH_PAY_PHRASE_GROUP[key].map(paytype =>
                                        <View className='phrase-item'>
                                            <View className='phrase-content'>
                                                <View className='main-content'>
                                                    <Radio checked={paytype == defaultPaytype}
                                                        onChange={event => this.changeDefaultPhrase(paytype)}
                                                    />
                                                    <Text className='main-text'>{WW_RUSH_PAY_DEFAULT_PHRASE_MAP[paytype]}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                }
                            </View>
                        </View>
                    )
                }
            </View>
        );
    }
}

export default WwRushPayPhrase;