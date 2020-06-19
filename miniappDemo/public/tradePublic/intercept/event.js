// 配置严格模式与自定义模式的值
export function setValueArr (mode, dataSource) {
    let valueArr = [];
    Object.keys(dataSource.switchArr).map((item) => {
        let data = dataSource.switchArr[item];
        let type = data.type;
        if (type != 'no') {
            let checked = data.defaultStatus[mode];
            let value = data.value ? ';' + data.value : '';
            let result = checked + value;
            if (item == 'bigmoney') {
                result += ';' + data.isHasPostfeeMore;
            }
            if (item == 'smallmoney') {
                result += ';' + data.isHasPostfeeLess;
            }
            if (item == 'conditions') {
                result = checked + '|Y|' + data.value;
            }
            valueArr.push(result);
        }
    });
    return valueArr;
}

// 设置不同模式下的数据
export function setStateMode (dataSource, keyArr, valueArr) {
    if (Array.isArray(keyArr)) {
        keyArr.map((keyItem, index) => {
            if (keyItem != 'conditions') {
                dataSource.switchArr[keyItem].checked = valueArr[index].indexOf('on') > -1;
            } else {
                dataSource.switchArr[keyItem].checked = valueArr[index].split('|Y|')[0] == 'on';
            }
        });
    }
}

