import { events } from "mapp_common/utils/eventManager";
import { isObject } from "mapp_common/utils";


/**
 * 显示对话框的api
 * @param args
 */
export function showDialog (...args) {
    if (isObject(args[0])) {
        events.showDialog.emit(args[0]);
    } else {
        events.showDialog.emit({
            name: args[0],
            props: args[1],
        });
    }
}

export default showDialog;
