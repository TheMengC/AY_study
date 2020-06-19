import { NOOP } from "mapp_common/utils/api";

let violation = '国家级、世界级、最高级、最佳、最大、第一、唯一、首个、首选、最好、精确、顶级、最高、最低、最具、最便宜、最先进、最大程度、最新技术、最先进科学、国家级产品、填补国内空白、独家、首家、最新、最先进、第一品牌、金牌、名牌、优秀、资深、最赚、超赚、最先、巨星、著名、奢侈、至尊、王者、顶级享受、给他最好的、冠军、独家、全网销量第一、全球首发、全国首家、全网首发、世界领先、顶级工艺、最新科学、最新技术、最先进加工工艺、最时尚、极品、顶级、顶尖、终极、最受欢迎、王牌、**之王、冠军、NO.1、Top1、极致、永久、王牌、掌门人、领袖品牌、独一无二、独家、绝无仅有、前无古人、史无前例等、万能、驰名+商标、销量+冠军、抄底、极端、空前绝后、绝对、巅峰、顶峰、中国+名牌、必备、最、真正、赠品';

/**
 * 检测标题
 */
export const titleDetection = ({item, callback = NOOP, promWord}) => {
    const propnam = renew_propnam(item.props_name.split(';'), item.property_alias.split(';'));
    const detailTitleResult = detailchecktitle(item.title, item.num_iid, propnam, item.props.split(';'), promWord);
    callback({result: detailTitleResult.score, item: item});
};

/**
 * 更新props_name
 * @param propsnamParam 由宝贝的props_name拼接而成的数组
 * @param propsalias  由宝贝的property_alias拼接而成的数组
 * @returns {*}
 */
export const renew_propnam = (propsnamParam, propsalias) => {
    const propsnam = propsnamParam;
    if (propsalias == null || propsalias.length === 0) {
        return propsnam;
    }
    for (let i = 0; i < propsnam.length; i += 1) {
        const arrPropnam = propsnam[i].split(':');
        for (let j = 0; j < propsalias.length; j += 1) {
            const arrPropalias = propsalias[j].split(':');
            if (arrPropnam[0] === arrPropalias[0] && arrPropnam[1] === arrPropalias[1]) {
                // 这里表示有自定义属性了
                propsnam[i] = `${arrPropnam[0]}:${arrPropnam[1]}:${arrPropnam[2]}:${arrPropalias[2]}`;
                break;
            }
        }
    }
    return propsnam;
};

/**
 * 检测标题
 * @param titleval 宝贝的标题
 * @param numid 宝贝的num_iid
 * @param propsnam  宝贝更新后的props_name
 * @param propscal  由宝贝的props拼接而成的数组
 * @param topsales 促销词
 * @returns {{}}
 */
export const detailchecktitle = (titleval, numid, propsnam, propscal, topsales) => {
    //TitleClassCheck.is_need_cuxiaoci = false;
    /* 促销词 */
    let sign1 = true;
    /* 属性词 */
    let sign2 = true;
    /* 违规词 */
    let sign3 = false;
    /* 未满50个字 */
    let sign4 = false;
    /* 三个空格以上 */
    let sign5 = false;
    /* 特殊符号 */
    let sign6 = false;
    /* 重复关键字 */
    let sign7 = false;
    /* 未满60个字符 */
    let sign8 = false;
    /* 优 */
    let sign9 = false;
    /* 特殊字符 */
    let signstr = 'XXX';
    /* 重复字 */
    let morestr = 'XXX';
    /* 违规词 */
    let fivestr = '';
    let lenae = 0;
    for (let i = 0; i < titleval.length; i += 1) {
        if (titleval.charCodeAt(i) < 0x80) {
            lenae += 1;
        } else {
            lenae += 2;
        }
    }
    const titleResult = {};
    titleResult.score = '优';
    titleResult.results = [];
    const violationArr = violation.split('、');
    let violationpin = '';
    for (let i = 0; i < violationArr.length; i += 1) {
        if (titleval.indexOf(violationArr[i]) >= 0) {
            violationpin += `${violationArr[i]}、`;
            sign3 = true;
        }
    }
    fivestr = violationpin.substring(0, violationpin.length - 1);
    if (lenae < 50) {
        sign4 = true;
    }
    if (lenae >= 50 && lenae < 57) {
        sign8 = true;
    }
    // 检测促销关键词
    // for (let i = 0; i < topsales.length; i += 1) {
    for (const i in topsales) {
        if (titleval.indexOf(topsales[i].wordname) >= 0) {
            sign1 = false;
            break;
        }
    }
    if (sign1) {
        //TitleClassCheck.is_need_cuxiaoci = true;
        sign1 = true;
    }
    // 检测属性词
    let log = 0;
    const topcalnam = [];
    let prop;
    // let prop1;
    let prop2;
    if (propsnam && propscal) {
        for (let i = 0; i < propsnam.length; i += 1) {
            for (let j = 0; j < propscal.length; j += 1) {
                prop = `${propsnam[i].split(':')[0]}:${propsnam[i].split(':')[1]}`;
                if (propscal[j] === prop) {
                    // prop1 = propsnam[i].split(':')[2];
                    prop2 = propsnam[i].split(':');
                    const tmp = prop2[3];
                    let long = 0;
                    for (let i = 0; i < tmp.length; i += 1) {
                        if (tmp.charCodeAt(i) < 0x80) {
                            long += 1;
                        } else {
                            long += 2;
                        }
                    }
                    if(long > 3){
                        topcalnam[log] = tmp;
                        log += 1;
                    }
                }
            }
        }
    }
    for (let i = 0; i < topcalnam.length; i += 1) {
        // for (const i in topcalnam) {
        if (titleval.indexOf(topcalnam[i]) >= 0) {
            // 如果含有属性词
            sign2 = false;
            break;
        }
    }
    if (!sign2) {
        sign2 = false;
    }
    // 检测空格和特殊字符
    let kgsign = 0;
    /* 正则匹配，查看标题中是否有特殊字符 */
    const regex = /[`~!@#$^&*()=|{}':;',\\[\].<>/?~！@#￥……&*（）; —|{}【】‘；：”“'。，、？]/g;
    signstr = titleval.match(regex);
    if (signstr !== null) {
        for (let i = 0; i < signstr.length; i += 1) {
            // for (const i in signstr) {
            if (signstr[i] === ' ') {
                kgsign += 1;
            }
        }
    }
    if (kgsign >= 3) {
        sign5 = true;
    }
    if (signstr !== null) {
        for (let i = 0; i < signstr.length; i += 1) {
            // for (const i in signstr) {
            if (signstr[i] !== 'XXX' && signstr[i] != null && signstr[i] !== ' ' && signstr[i] !== '') {
                // 有特殊符号
                sign6 = true;
                break;
            }
        }
    }
    // 有重复关键词
    morestr = topcheckmorekey(titleval);
    if (morestr !== 'XXX' && morestr != null && morestr !== '') {
        sign7 = true;
    }
    let score = '';
    if (!sign1 && !sign2 && !sign3 && !sign4 && !sign5 && !sign6 && !sign8 && !sign7) {
        score = '优';
        sign9 = true;
    } else if (!sign4 && !sign3) {
        score = '良';
    } else if (sign4 || sign3) {
        score = '差';
    }
    titleResult.sign1 = sign1;
    titleResult.sign2 = sign2;
    titleResult.sign3 = sign3;
    titleResult.sign4 = sign4;
    titleResult.sign5 = sign5;
    titleResult.sign6 = sign6;
    titleResult.sign7 = sign7;
    titleResult.sign8 = sign8;
    titleResult.sign9 = sign9;
    titleResult.signstr = signstr;
    titleResult.morestr = morestr;
    titleResult.fivestr = fivestr;
    titleResult.score = score;
    return titleResult;
};

/**
 * 检测是否含有重复词
 * @param str
 * @returns {string}
 */
const topcheckmorekey = (str) => {
    const strarr = str.split('');
    const strlen = strarr.length;
    let morestr = '';
    let str1 = '';
    for (let i = 0; i < strarr.length; i += 1) {
        for (let j = 0; j < strarr.length; j += 1) {
            if (strarr[j] === strarr[i] && i !== j && j < strlen && i < strlen) {
                str1 = strarr[j];
                for (let m = 1; m < strlen; m += 1) {
                    const a = Number(j) + Number(m);
                    const b = Number(i) + Number(m);
                    if (strarr[a] === strarr[b] && strarr[b] !== undefined && strarr[b] !== 'undefined') {
                        str1 += strarr[a];
                        // 避免输入2020时出现重复词20
                        if (strarr[j] == '2' && Math.abs(Number(b) - Number(a)) == 2 && strarr[a] == '0') {
                            str1 = strarr[j];
                        }
                    } else {
                        break;
                    }
                }
                if (str1 === strarr[j]) {
                    //  empty
                } else if (morestr === '') {
                    morestr = str1;
                } else if (morestr.indexOf(str1) === -1) {
                    morestr += `,${str1}`;
                }
            }
        }
    }
    return morestr;
};
