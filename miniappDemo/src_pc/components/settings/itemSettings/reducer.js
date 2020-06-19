const INITIAL_STATE = { 
    itemShortTitleMap:{},
    itemCostPriceMap:{},
    itemWeightMap:{},
};


function itemSettingsReducer (state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'ITEM_SHORT_TITLE_MAP_CHANGE':
            return Object.assign({}, state, { itemShortTitleMap: { ...action.itemShortTitleMap } });
        case 'ITEM_COST_PRICE_MAP_CHANGE':
            return Object.assign({}, state, { itemCostPriceMap: { ...action.itemCostPriceMap } });
        case 'ITEM_WEIGHT_MAP_CHANGE':
            return Object.assign({}, state, { itemWeightMap: { ...action.itemWeightMap } });
        default:
            return state;
    }
}

export default itemSettingsReducer;