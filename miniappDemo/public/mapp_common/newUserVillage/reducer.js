const INITIAL_STATE = {
    checkInData: {},
    tasksData: {},
};


export const updateNewUserVillageReducer = (state = INITIAL_STATE, action) => {
    const { type, data } = action;
    switch (type) {
        case 'UPDATE_CHECKIN_DATA':
            // console.error(JSON.stringify(Object.assign({}, state,{"checkInData": data}))+'3333')
            return Object.assign({}, state, { "checkInData": data });
        case 'UPDATE_NEWUSERTASKS_DATA':
            return Object.assign({}, state, { "tasksData": data });
        default:
            return state;
    }
};
