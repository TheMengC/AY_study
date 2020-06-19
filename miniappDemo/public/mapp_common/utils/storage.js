import Taro from "@tarojs/taro";

export const storage = {
    setItem: (key, value) => {
        return Taro.setStorage({ key, data: value });
    },
    setItemSync: (key, value) => {
        return Taro.setStorageSync(key, value);
    },
    getItem: (key) => {
        return Taro.getStorage({ key }).then(res => res.data);
    },
    getItemSync:(key) => {
        return Taro.getStorageSync(key);
    },
    removeItem: (key) => {
        return Taro.removeStorage({ key });
    },
    clear: () => {
        return Taro.clearStorage();
    },
    getInfo:() => {
        return Taro.getStorageInfo();
    },
    getInfoSync:() => {
        return Taro.getStorageInfoSync();
    },
    getAll:() => {
        let res = Taro.getStorageInfoSync();
        return res.keys.map(this.getItemSync);
    },
};


