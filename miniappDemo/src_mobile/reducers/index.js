import { combineReducers } from 'redux';
import tradeListReducer from "pages/tradeList/reducer";
import tradeDetailReducer from "pages/tradeDetail/reducer";
import customPhraseReducer from "pages/customPhrases/customPhraseReducer";
import logisticsAddressReducer from "pages/logisticsSettings/logisticsAddressReducer";
import { marketingAdInfoReducer } from "mapp_common/marketing/reducer";
import { updateNewUserVillageReducer } from "mapp_common/newUserVillage/reducer";

import batchRateReducer from "pages/batchRate/reducer";

export default combineReducers({
    tradeListReducer,
    tradeDetailReducer,
    customPhraseReducer,
    logisticsAddressReducer,
    marketingAdInfoReducer,
    batchRateReducer,
    updateNewUserVillageReducer,
});
