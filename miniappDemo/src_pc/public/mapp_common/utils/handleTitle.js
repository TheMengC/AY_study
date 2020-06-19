import { isEmpty } from "mapp_common/utils";
/**
 * @author ljn
 * @date 2020 2 19
 * @param {*} title 需要转义的标题
 */
const handleTitle = function (title = '') {
    if(isEmpty(title)){
        return '-';
    }
    let text = title.replace(/\&hellip;/g, '…');
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&lsquo;/g, '\‘');
    text = text.replace(/&rsquo;/g, '\’');
    text = text.replace(/&cent;/g, '￠');
    text = text.replace(/&yen;/g, '¥');
    text = text.replace(/&pound;/g, '£');
    text = text.replace(/&euro;/g, '€');
    text = text.replace(/&sect;/g, '§');
    text = text.replace(/&copy;/g, '©');
    text = text.replace(/&reg;/g, '®');
    text = text.replace(/&trade;/g, '™');
    text = text.replace(/&times;/g, '×');
    text = text.replace(/&divide;/g, '÷');
    text = text.replace(/&mdash;/g, '—');
    text = text.replace(/&middot;/g, '·');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&ldquo;/g, '“');
    text = text.replace(/&rdquo;/g, '”');
    text = text.replace(/&quot;/g, '"');
    return text;
};

export { handleTitle };
