/* eslint-disable react/jsx-no-duplicate-props */
import Taro,{Component} from '@tarojs/taro'
import { View, Textarea } from '@tarojs/components'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {checkLen} from 'tradePublic/babyDetail/common';
import './index.scss';

/**
 * 
 * @param {*} maxLength 
 * @param {*} textOverflowForbidden 
 */
function getMaxLength (maxLength,textOverflowForbidden) {
    if (!textOverflowForbidden) {
        return maxLength + 500
    }
    return maxLength
}

const ENV = Taro.getEnv()

/**
 * 该组件与官方的差异:
 *      文字的计数方式：一个汉字算2个字符
 *      当前文字数量超过最大值数量时的样式：边框会变红
 */
class AyTextarea extends Component {
    handleInput = (...arg) => this.props.onChange(...arg)

    handleFocus = (...arg) => this.props.onFocus(...arg)

    handleBlur = (...arg) => this.props.onBlur(...arg)

    handleConfirm = (...arg) => this.props.onConfirm(...arg)

    handleLinechange = (...arg) => this.props.onLinechange(...arg)

    render () {
        const {
            customStyle,
            className,
            value,
            cursorSpacing,
            placeholder,
            placeholderStyle,
            placeholderClass,
            maxLength,
            count,
            disabled,
            autoFocus,
            focus,
            showConfirmBar,
            selectionStart,
            selectionEnd,
            fixed,
            textOverflowForbidden,
            height,
        } = this.props

        const _maxLength = parseInt(maxLength)
        const actualMaxLength = getMaxLength(_maxLength, textOverflowForbidden)
        const textareaStyle = height ? `height:${Taro.pxTransform(height)}` : ''
        const rootCls = classNames(
            'at-textarea',
            `at-textarea--${ENV}`,
            {
            'at-textarea--error': _maxLength < checkLen(value)
            }, className
        )
        const placeholderCls = classNames('placeholder', placeholderClass)

        return (
            <View className={rootCls} style={customStyle}>
                <Textarea
                className='at-textarea__textarea'
                style={textareaStyle}
                placeholderStyle={placeholderStyle}
                placeholderClass={placeholderCls}
                cursorSpacing={cursorSpacing}
                value={value}
                confirmType='完成'
                /* 兼容之前的版本 */
                maxLength={actualMaxLength}
                placeholder={placeholder}
                disabled={disabled}
                autoFocus={autoFocus}
                focus={focus}
                showConfirmBar={showConfirmBar}
                selectionStart={selectionStart}
                selectionEnd={selectionEnd}
                fixed={fixed}
                onInput={this.handleInput}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onConfirm={this.handleConfirm}
                onLinechange={this.handleLinechange}
                showCount={false}
                />
                {
                    count && (
                    <View className='at-textarea__counter'>
                        {checkLen(value)}/{_maxLength}
                    </View>
                    )
                }
            </View>
        )
    }
}

AyTextarea.defaultProps = {
    customStyle: '',
    className: '',
    value: '',
    cursorSpacing: 100,
    maxLength: 200,
    placeholder: '',
    disabled: false,
    autoFocus: false,
    focus: false,
    showConfirmBar: false,
    selectionStart: -1,
    selectionEnd: -1,
    count: true,
    fixed: false,
    height: '',
    textOverflowForbidden: true,
    onLinechange: () => {},
    onChange: () => {},
    onFocus: () => {},
    onBlur: () => {},
    onConfirm: () => {},
}

AyTextarea.propTypes = {
    customStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
    ]),
    className: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string
    ]),
    value: PropTypes.string.isRequired,
    cursorSpacing: PropTypes.number,
    maxLength: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    placeholderClass: PropTypes.string,
    placeholderStyle: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    autoFocus: PropTypes.bool,
    focus: PropTypes.bool,
    showConfirmBar: PropTypes.bool,
    selectionStart: PropTypes.number,
    selectionEnd: PropTypes.number,
    count: PropTypes.bool,
    textOverflowForbidden: PropTypes.bool,
    fixed: PropTypes.bool,
    height: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    onLinechange: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onConfirm: PropTypes.func,
}

export default AyTextarea
