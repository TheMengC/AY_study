import { NOOP } from "mapp_common/utils";
import showDialog from "pcComponents/dialogManager/api";

/**
 * 显示确认对话框
 * @param title 对话框标题 不传则没有
 * @param content  内容
 * @param confirmText 确认按钮文字
 * @param cancelText 取消按钮文字
 * @param onOk 确认回调
 * @param onCancel 取消回调
 * @param onClose 关闭回调
 * @param showCancel 是否显示取消按钮
 */
export function showConfirmDialog ({
    title = '温馨提示',
    content,
    confirmText = '确认',
    cancelText = '取消',
    onOk = NOOP,
    onCancel = NOOP,
    onClose = NOOP,
    showCancel = true,
}) {
    showDialog({
        name:'ConfirmDialog',
        props:{ title, content, confirmText, cancelText, onOk, onCancel, showCancel, onClose },
    });
}

/**
 * 显示对话框 返回promise 支持用await等待
 * @param title 对话框标题 不传则没有
 * @param content 内容
 * @param confirmText 取消按钮文字
 * @param cancelText 确认按钮文字
 * @param showCancel 是否显示取消按钮
 * @returns {Promise<unknown>}
 */
export function showConfirmDialogAsync ({
    title = '温馨提示',
    content,
    confirmText = '确认',
    cancelText = '取消',
    showCancel = true,
}) {
    return new Promise(resolve => {
        showConfirmDialog({
            title,
            content,
            confirmText,
            cancelText,
            onOk:() => {
                resolve(true);
            },
            onCancel:() => {
                resolve(false);
            },
            showCancel,
        });
    });
}

/**
 * 显示确认对话框，可输入一个input
 * @param title 对话框标题 不传则没有
 * @param labelName input 框前解释内容
 * @param placeholder input 内默认内容
 * @param confirmText 确认按钮文字
 * @param cancelText 取消按钮文字
 * @param width 弹框宽度
 * @param onOk 确认回调
 * @param onCancel 取消回调
 * @param showCancel 是否显示取消按钮
 */
export function showInputDialog({
    title = '温馨提示',
    labelName = NOOP,
    placeholder = NOOP,
    confirmText = '确认',
    cancelText = '取消',
    width = 345,
    onOk = NOOP,
    onCancel = NOOP,
    showCancel = true,
}) {
    showDialog({
        name: 'InputDialog',
        props: {
            title, labelName, placeholder, confirmText, cancelText, width, onOk, onCancel, showCancel
        },
    });
}

/**
 * 显示确认对话框，可输入一个input
 * @param title 对话框标题 不传则没有
 * @param labelName input 框前解释内容
 * @param placeholder input 内默认内容
 * @param confirmText 确认按钮文字
 * @param cancelText 取消按钮文字
 * @param width 弹框宽度
 * @param showCancel 是否显示取消按钮
 */
export function showInputDialogAsync({
    title = '温馨提示',
    labelName = NOOP,
    placeholder = NOOP,
    confirmText = '确认',
    cancelText = '取消',
    width = 345,
    showCancel = true,
}) {
    return new Promise(resolve => {
        showInputDialog({
            title,
            labelName,
            placeholder,
            confirmText,
            cancelText,
            width,
            showCancel,
            onOk:(val) => {
                resolve(val);
            },
            onCancel:() => {
                resolve(false);
            },
        });
    });
}