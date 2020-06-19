import Taro from '@tarojs/taro';

export const checkIn_getState = () => {
    let app = Taro.getApp();
    return app.store.getState().updateNewUserVillageReducer.checkInData;
};
/*
 * @Description 更新redux中的签到信息
*/
export const checkIn_dispatch = (data) => {
    let app = Taro.getApp();
    console.log('同步新手村的数据到redux里', data);
    app.store.dispatch({ type: "UPDATE_CHECKIN_DATA", data });
};

// 返回redux里最新的任务数据
export const newUserTasks_getState = () => {
    let app = Taro.getApp();
    return app.store.getState().updateNewUserVillageReducer.tasksData;
};

export const newUserTasks_dispatch = (data) => {
    let app = Taro.getApp();
    console.log('同步新手任务的数据到redux里', data);
    app.store.dispatch({ type: "UPDATE_NEWUSERTASKS_DATA", data });
};


