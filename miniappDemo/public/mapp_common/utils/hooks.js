import Taro, { Component, useState, useEffect, useRef, useCallback } from '@tarojs/taro';

/**
 * 使用它替换useState方法，返回前两个参数与原来的useState相同
 * 第三个参数为即时的state值
 * @param initValue
 * @returns {[*, *, *]}
 */
export function useRefState (initValue) {
    let _valueRef = useRef();
    const [_state, _setState] = useState(() => {
        const value = typeof initValue === 'function' ? initValue() : initValue;
        return value;
    });
    _valueRef.current = _state;

    const _setValue = useCallback((value) => {
        if (typeof value === 'function') {
            _setState((prevState) => {
                const newState = value(prevState);
                _valueRef.current = _getRefValue(newState);
                return newState;
            });
        } else {
            _valueRef.current = _getRefValue(value);
            _setState(value);
        }
    }, []);

    const _getRefValue = (value) => {
        if (typeof value === 'object' && value != _state) {
            Object.keys(_state).forEach((key) => {
                _state[key] = value[key];
            });
            return _state;
        } else {
            return value;
        }
    };

    return [
        _state,
        _setValue,
        _valueRef,
    ];
}

