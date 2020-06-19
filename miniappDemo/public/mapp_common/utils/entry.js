import { Logger } from "tradePolyfills/index";

let _entry = 'index';
let _args = {};
let _entry_triggered = false;
export const getEntry = () => {
    return _entry;
};

export const setEntry = (newEntry) => {
    _entry = newEntry;
    return _entry;
};

export const setEntryArgs = (args) => {
    _args = args;
    return _args;
};

export const getEntryArgs = () => {
    return _args;
};

export function setEntryTriggered (val) {
    Logger.log('setEntryTriggered', val);
    _entry_triggered = val;
}

export function getEntryTriggered () {
    Logger.log('getEntryTriggered');
    return _entry_triggered;
}
