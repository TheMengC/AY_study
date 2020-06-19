export const AD_COMMON_STATE = {
    pid: undefined,
    page: undefined,
    state: undefined,
    lastCloseTime: undefined,
    type: undefined,
};

const INITIAL_STATE = {};

export const marketingAdInfoReducer = (state = INITIAL_STATE, action) => {
    const { type, data } = action;
    switch (type) {
        case 'UPDATE_AD_INFO':
            return Object.assign({}, state, data);
        default:
            return state;
    }
};
