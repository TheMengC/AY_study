import { storage } from "mapp_common/utils/storage";
import { Logger } from "mapp_common/utils/logger";

let _userInfo = {
    showVipTime: '加载中',
    vipFlag: 0,
    showPayBtn: '升级',
    //  userNick: '赵东昊的测试店铺',

    // avatar:'http://wwc.alicdn.com/avatar/getAvatar.do?userIdStr=MHkyP8xYvm8LOFc0MmPHMkPIv88LPF*zM88yOmxGXFgT&width=80&height=80&type=sns'
};

export const getUserInfo = () => {
    return _userInfo || {};
};

export const saveUserInfo = () => {
    let cacheKeys = [
        'vipFlag'//, 'userNick','user_id',
    ];
    let cache = {};
    cacheKeys.map(key => {
        if (_userInfo[key] !== undefined) {
            cache[key] = _userInfo[key];
        }
    });
    if (Object.keys(cache).length != 0) {
        storage.setItem('userInfo', cache);
    }
};

export const setUserInfo = (newUserInfo) => {
    Logger.log('setUserInfo',newUserInfo);
    _userInfo = { ..._userInfo, ...newUserInfo };
    saveUserInfo();
    return _userInfo;
};
