
import { events } from "tradePolyfills";

const apiDied = (args) => {
    events.emit('apiDied', args);
};
const apiRespawned = (args) => {
    events.emit('apiRespawned', args);
};
const changeNeedSyncStatus = (args) => {
    events.emit('changeNeedSyncStatus', args);
};
export {
    apiDied,
    apiRespawned,
    changeNeedSyncStatus,
};
