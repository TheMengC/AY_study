import Taro, { Component } from '@tarojs/taro';
import { Text, View } from "@tarojs/components";
import './index.scss';
import { checkMystdtemplatesOver, getMystdtemplateByUrl } from 'tradePublic/cainiaoCloudprintMystdtemplatesGet';

const HEAD_ROW_INDEX = -1;

class MyBaseTable extends Component {
    constructor (props) {
        super(props);
    }
    async componentDidMount () {
        await checkMystdtemplatesOver();
    }

    /**
     * 默认单元格样式
     * @param value
     * @returns {*}
     */
    defaultCell (value) {
        return (
            <View className='my-base-table-text-center'>
                <Text>
                    {
                        value
                    }
                </Text>
            </View>
        );
    }

    /**
     * 获取渲染表格单元格的对应方法
     * @param value
     * @param columnIndex
     * @param rowIndex
     * @returns {*}
     */
    tableCellRenderFunction (value, columnIndex, rowIndex) {
        const { tableHead, dataSource } = this.props;

        if (rowIndex == HEAD_ROW_INDEX && tableHead[columnIndex].key == 'index') {
            return (
                <View className='my-base-table-text-center my-base-table-column-index my-base-table-text-color'>
                    <Text>
                        {
                            value
                        }
                    </Text>
                </View>
            );
        }

        if (rowIndex == HEAD_ROW_INDEX) {
            return (
                <View className='my-base-table-text-center my-base-table-text-color'>
                    <Text>
                        {
                            value
                        }
                    </Text>
                </View>
            );
        }


        if (rowIndex != HEAD_ROW_INDEX && tableHead[columnIndex].key == 'index') {
            return (
                <View className='my-base-table-text-center my-base-table-column-index'>
                    <Text>
                        {
                            value
                        }
                    </Text>
                </View>
            );
        }

        if (rowIndex != HEAD_ROW_INDEX && tableHead[columnIndex].key == 'operation') {
            return (
                <View className='my-base-table-text-center'>
                    <View className='my-base-table-column-operation'>
                        <View>预览</View>
                        <View className='right-border'></View>
                        <View>编辑</View>
                        <View className='right-border'></View>
                        <View className='delete-disabled' onClick={() => {
                            console.log('mystdtemplates',getMystdtemplateByUrl('ZJS', 901));
                        }}
                        >删除</View>
                    </View>
                </View>
            );
        }

        if (rowIndex != HEAD_ROW_INDEX) {
            return (
                <View className='my-base-table-text-center'>
                    <Text>
                        {
                            value
                        }
                    </Text>
                </View>
            );
        }
    }

    /**
     * 渲染表格的一行
     * @param rowIndex
     * @param rowValue
     * @returns {*}
     */
    tableRowRender (rowIndex, rowValue) {
        const { tableHead, dataSource } = this.props;

        return (
            <View className={rowIndex == HEAD_ROW_INDEX ? 'my-base-table-head' : 'my-base-table-body-row'}>
                {
                    tableHead.map((value, columnIndex) => {
                        let style = {};
                        let classContent = 'flex-auto-width';
                        let cellValue = rowIndex == HEAD_ROW_INDEX ? value.name : rowValue[value.key];

                        if (value.width) {
                            style.width = value.width;
                            classContent = 'flex-fix-width';
                        }

                        return (
                            <View style={style} className={classContent}>
                                {
                                    this.tableCellRenderFunction(cellValue, columnIndex, rowIndex, dataSource)
                                }
                            </View>
                        );
                    })
                }
            </View>
        );
    }


    render () {
        const { dataSource } = this.props;

        return (
            <View className='my-base-table-container'>
                {
                    this.tableRowRender(HEAD_ROW_INDEX)
                }
                <View className='my-base-table-body'>
                    {
                        dataSource.map((rowValue, rowIndex) => this.tableRowRender(rowIndex, rowValue))
                    }
                </View>
            </View>
        );
    }
}

export default MyBaseTable;
