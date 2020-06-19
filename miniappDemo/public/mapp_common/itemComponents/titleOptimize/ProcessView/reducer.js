const INITIAL_STATE = {
    hideProcess: true, // 是否隐藏进度页面
    number: '0', // 检测进度
    process1: "",
    process2: "",
    process3: "",
    process4: "",
    process5: "",
    process6: "",
};

export default function titleOptimizeProcessViewReducer(state = INITIAL_STATE, action){
    const { type, data } = action;
    switch (type) {
        case 'UPDATE_TITLE_OPTIMIZE_PROCESS_INFO':
            return Object.assign({}, state, data);
        default:
            return state;
    }
};
