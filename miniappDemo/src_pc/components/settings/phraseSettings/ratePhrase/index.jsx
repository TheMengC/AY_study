import Taro, { Component } from '@tarojs/taro';
import { View, Text, Textarea } from '@tarojs/components';
import '../memoOrRatePhrase.scss';
import { getRateCustomPhrases, ratePhraseSet } from "tradePublic/customPhrases";
import { showConfirmModal } from "mapp_common/utils";
import { DEFAULT_RATE_PHRASE } from "tradePublic/customPhrases/consts";

class RatePhrase extends Component {
    constructor (props) {
        super(props);
        this.state = {
            customPhrases: [],
            editIndex: -1,
            inputValue: '',

            insertModal: false,
        };
    }

    async componentWillMount () {
        let customPhrases = await getRateCustomPhrases({ refresh:true });
        this.setState({ customPhrases });
    }

    handleSaveOnClick = (index) => {
        let { customPhrases, inputValue } = this.state;
        if (index === -1) {
            // 新增短语
            customPhrases.push(inputValue);
        }else {
            customPhrases[index] = inputValue;
        }
        ratePhraseSet({
            value: customPhrases,
            callback: () => {
                Taro.showToast({ title: '操作成功' });
                this.setState({
                    customPhrases,
                    editIndex: -1,
                    insertModal:false,
                });
            },
        });
    }

    handleDeleteOnClick = (index) => {
        showConfirmModal({
            content:'确认删除？',
            onConfirm:() => {
                let { customPhrases } = this.state;
                customPhrases.splice(index, 1);
                ratePhraseSet({
                    value:customPhrases,
                    callback: () => {
                        Taro.showToast({ title: '操作成功' });
                        this.setState({ customPhrases });
                    },
                });
            },
        });
    }

    render () {
        let { customPhrases, editIndex, inputValue, insertModal } = this.state;
        return (
            <View className='memo-or-rate-phrase-page'>
                <View className='tip'>
                    <Text className='iconfont iconfont-pingjiaduanyu-xinzengduanyu' />
                    <Text>常用短语状态在电脑端、手机端、旺旺插件同步显示，输入框编辑后记得保存哦~</Text>
                </View>
                <View className='custom-phrase'>
                    <View className='title'>自定义评价短语</View>
                    {
                        insertModal ?
                            <View className='span insert-span'>
                                <View className='span-item'>
                                    <View className='main-text'>
                                        <Textarea autoHeight={{ minRows: 3, maxRows: 10 }} className='textarea' value={inputValue}
                                            onInput={event => this.setState({ inputValue: event.detail.value })}
                                        />
                                    </View>
                                    <View className='buttons'>
                                        <View className='trade-btn-small-normal trade-btn-left'
                                            onClick={() => this.setState({ insertModal: false })}
                                        >取消</View>
                                        <View className='trade-btn-small-primary'
                                            onClick={() => this.handleSaveOnClick(-1)}
                                        >保存</View>
                                    </View>
                                </View>
                            </View>
                            :
                            <View className='insert-btn'
                                onClick={() => this.setState({
                                    insertModal: true,
                                    editIndex: -1,
                                    inputValue: '',
                                })}
                            >
                                <Text className='iconfont' />
                                <Text>新增短语</Text>
                            </View>
                    }
                    <View className='custom-phrases-spans'>
                        {
                            customPhrases.map((value, index) =>
                                <View className='span custom-span'>
                                    <View className='span-item'>
                                        <View className='main-text'>
                                            {
                                                editIndex === index ?
                                                    <Textarea autoHeight={{ minRows: 3, maxRows: 10 }} className='textarea'
                                                        value={inputValue}
                                                        onInput={event => this.setState({ inputValue: event.detail.value })}
                                                    />
                                                    :
                                                    value
                                            }
                                        </View>
                                        {
                                            editIndex === index ?
                                                <View className='buttons'>
                                                    <View className='trade-btn-small-normal trade-btn-left'
                                                        onClick={() =>
                                                            this.setState({
                                                                editIndex: -1,
                                                                inputValue: '',
                                                            })}
                                                    >取消</View>
                                                    <View className='trade-btn-small-primary'
                                                        onClick={() => this.handleSaveOnClick(index)}
                                                    >保存</View>
                                                </View>
                                                :
                                                <View className='buttons'>
                                                    <View className='trade-btn-small-normal trade-btn-left'
                                                        onClick={this.handleDeleteOnClick.bind(this, index)}
                                                    >删除</View>
                                                    <View className='trade-btn-small-normal'
                                                        onClick={() =>
                                                            this.setState({
                                                                editIndex: index,
                                                                inputValue: value,
                                                                insertModal: false,
                                                            })}
                                                    >编辑</View>
                                                </View>
                                        }
                                    </View>
                                </View>
                            )
                        }
                    </View>
                </View>
                <View className='default-phrases'>
                    <View className='title'>默认评价短语</View>
                    <View className='phrases-spans'>
                        {
                            DEFAULT_RATE_PHRASE.map(item =>
                                <View className='span'>
                                    <View className='span-item'>
                                        {item}
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

export default RatePhrase;