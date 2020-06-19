import Taro, { Component } from '@tarojs/taro';
import { View, Text, Textarea, Radio } from '@tarojs/components';
import { getWwRushRateCustomPhrases,
    getWwRushRateDefaultPhraseChoice, WwRushRateCustomPhrasesModify,
    WwRushRateDefaultPhraseChoiceModify } from "tradePublic/customPhrases";
import { WW_RUSH_RATE_PHRASE, WW_RUSH_RATE_PHRASE_SPAN } from "tradePublic/customPhrases/consts";
import './index.scss';
import '../wwPhrases.scss';
import { showConfirmModal } from "mapp_common/utils";

class WwRushRatePhrase extends Component {
    constructor (props) {
        super(props);
        this.state = {
            customPhrases :{},
            defaultChoice:null,
            inputValue:'',
            editChoice: -1,
            insertModal:false,
        };
    }
    
    async componentWillMount () {
        let customPhrases = await getWwRushRateCustomPhrases({ refresh:true });
        let defaultChoice = await getWwRushRateDefaultPhraseChoice();
        this.setState({ customPhrases, defaultChoice });
    }
    
    changeDefaultPhrase = (choice) => {
        WwRushRateDefaultPhraseChoiceModify({
            choice,
            callback : () => {
                Taro.showToast({ title:'保存成功' });
                this.setState({ defaultChoice:choice });
            },
        });
    }
    
    handleSaveOnClick () {
        let { customPhrases, editChoice, inputValue } = this.state;
        if (editChoice === -1) {
            customPhrases[Math.max(...Object.keys(customPhrases)) + 1] = inputValue;
        }
        else {
            customPhrases[editChoice] = inputValue;
        }
        WwRushRateCustomPhrasesModify({
            customPhrases,
            callback:() => {
                Taro.showToast({ title:'保存成功' });
                this.setState({
                    customPhrases,
                    editChoice: -1,
                    inputValue: '',
                    insertModal:false,
                });
            },
        });
    }

    deleteCustomPhrase = (choice) => {
        showConfirmModal({
            content:'确认删除？',
            onConfirm: () => {
                let { customPhrases } = this.state;
                delete customPhrases[choice];
                WwRushRateCustomPhrasesModify({
                    customPhrases,
                    callback:() => {
                        Taro.showToast({ title:'操作成功' });
                        this.setState({ customPhrases });
                    },
                });
            },
        });
    }

    addTextInTextarea (value) {
        let { inputValue } = this.state;
        inputValue += value;
        this.setState({ inputValue });
    }

    render () {
        let { customPhrases, defaultChoice, editChoice, inputValue, insertModal } = this.state;
        return (
            <View className='ww-rush-rate-phrase-page'>
                <View className='tip'>
                    <Text className='iconfont iconfont-pingjiaduanyu-xinzengduanyu' />
                    <Text>常用短语状态在电脑端、手机端、旺旺插件同步显示，输入框编辑后记得保存哦~</Text>
                </View>
                <View className='phrase-template-list'>
                    <View className='title'>自定义短语</View>
                    <View className='content'>
                        {
                            insertModal ?
                                <View className='phrase-item'>
                                    <View className='phrase-content'>
                                        <View className='main-content'>
                                            <Textarea autoHeight={{ minRows: 3, maxRows: 10 }} className='textarea' value={inputValue}
                                                onInput={event => this.setState({ inputValue: event.detail.value })}
                                            />
                                        </View>
                                        <View className='tip'>
                                            <Text className='iconfont iconfont-sanjiaoxingjinggao' />
                                            <Text>{'用鼠标在上方选择要插入的位置后，再点击下方<文本标签>就可以插入对应的信息~'}</Text>
                                        </View>
                                        <View className='edit-buttons'>
                                            <View className='insert-span'>
                                                <Text className='span-title'>文本标签</Text>
                                                <View className='span-list'>
                                                    {
                                                        WW_RUSH_RATE_PHRASE_SPAN.map(
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
                                            <View className='form-btn'>
                                                <View className='trade-btn-small-normal trade-btn-left'
                                                    onClick={() => this.setState({ insertModal: false })}
                                                >取消</View>
                                                <View className='trade-btn-small-primary'
                                                    onClick={this.handleSaveOnClick}
                                                >保存</View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                :
                                <View className='insert-btn-span'>
                                    <View className='insert-btn'
                                        onClick={() => this.setState({
                                            editChoice: -1,
                                            inputValue: '',
                                            insertModal: true,
                                        })}
                                    >
                                        <Text className='iconfont' />
                                        <Text>新增短语</Text>
                                    </View>
                                </View>
                        }
                        {
                            Object.keys(customPhrases).map(choice =>
                            {
                                let isDefault = choice == defaultChoice;
                                return (
                                    <View className='phrase-item'>
                                        <View className='phrase-content'>
                                            <View className='main-content'>
                                                <Radio checked={isDefault}
                                                    onChange={event => this.changeDefaultPhrase(choice)}
                                                />
                                                {
                                                    editChoice === choice ?
                                                        <Textarea autoHeight={{ minRows: 3, maxRows: 10 }} className='textarea' value={inputValue}
                                                            onInput={event => this.setState({ inputValue: event.detail.value })}
                                                        />
                                                        :
                                                        <Text className='main-text'>{customPhrases[choice]}</Text>
                                                }
                                            </View>
                                            {
                                                editChoice === choice &&
                                                    <View className='tip'>
                                                        <Text className='iconfont' />
                                                        <Text>{'用鼠标在上方选择要插入的位置后，再点击下方<文本标签>就可以插入对应的信息~'}</Text>
                                                    </View>
                                            }
                                            {
                                                editChoice === choice ?
                                                    <View className='edit-buttons'>
                                                        <View className='insert-span'>
                                                            <Text className='span-title'>文本标签</Text>
                                                            <View className='span-list'>
                                                                {
                                                                    WW_RUSH_RATE_PHRASE_SPAN.map(
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
                                                        <View className='form-btn'>
                                                            <View className='trade-btn-small-normal trade-btn-left'
                                                                onClick={() => this.setState({ editChoice: -1 })}
                                                            >取消</View>
                                                            <View className='trade-btn-small-primary'
                                                                onClick={this.handleSaveOnClick}
                                                            >保存</View>
                                                        </View>
                                                    </View>
                                                    :
                                                    <View className='extra-button'>
                                                        <View className='text-btn'
                                                            onClick={() => {
                                                                this.setState({
                                                                    editChoice: choice,
                                                                    inputValue: customPhrases[choice],
                                                                    insertModal: false,
                                                                });
                                                            }}
                                                        >编辑</View>
                                                        <View className='split-line' />
                                                        <View className={`text-btn ${isDefault ? 'text-btn-disable' : ''}`}
                                                            onClick={() => {
                                                                if (isDefault) {
                                                                    Taro.showToast({ title:'默认短语无法删除' });
                                                                    return;
                                                                }
                                                                this.deleteCustomPhrase(choice);
                                                            }}
                                                        >删除</View>
                                                    </View>
                                            }
                                        </View>
                                    </View>
                                );
                            }
                            )
                        }
                    </View>
                </View>
                <View className='phrase-template-list'>
                    <View className='title'>默认短语</View>
                    <View className='content'>
                        {
                            Object.keys(WW_RUSH_RATE_PHRASE).map(choice =>
                                <View className='phrase-item'>
                                    <View className='phrase-content'>
                                        <View className='main-content'>
                                            <Radio checked={choice == defaultChoice}
                                                onChange={event => this.changeDefaultPhrase(choice)}
                                            />
                                            <Text className='main-text'>{WW_RUSH_RATE_PHRASE[choice]}</Text>
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

export default WwRushRatePhrase;