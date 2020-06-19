let startArr = [
    { level:3, start:0, end:3, next: '1星' },
    { level:10, start:4, end:10, next: '2星' },
    { level:40, start:11, end:40, next: '3星' },
    { level:90, start:41, end:90, next: '4星' },
    { level:150, start:91, end:150, next: '5星' },
    { level:250, start:151, end:250, next: '1钻' },
    { level:500, start:251, end:500, next: '2钻' },
    { level:1000, start:501, end:1000, next: '3钻' },
    { level:2000, start:1001, end:2000, next: '4钻' },
    { level:5000, start:2001, end:5000, next: '5钻' },
    { level:10000, start:5001, end:10000, next: '1皇冠' },
    { level:20000, start:10001, end:20000, next: '2皇冠' },
    { level:50000, start:20001, end:50000, next: '3皇冠' },
    { level:100000, start:50000, end:100000, next: '4皇冠' },
    { level:200000, start:100001, end:200000, next: '5皇冠' },
    { level:500000, start:200001, end:500000, next: '1金冠' },
    { level:1000000, start:500001, end:1000000, next: '2金冠' },
    { level:2000000, start:1000001, end:2000000, next: '3金冠' },
    { level:5000000, start:2000001, end:5000000, next: '4金冠' },
    { level:10000000, start:5000001, end:10000000, next: '5金冠' },
];
/* 等级判断 */
export default function ShopLevel (shop) {
    let obj = {
        exp:'',                     // 等级进度条长度
        need:'',                    // 还差好评数
        next:'',                    // 下一等级
        level_pic_text1:'',         // 左图标下文本
        level_pic_text2:'',         // 右图标下文本
        level_pic_path1:'',         // 左图标路径
        level_pic_path2:'',         // 右图标路径
        level_pic_path_width1:'',   // 左图标宽度
        level_pic_path_width2:'',   // 右图标宽度
    };
    if(!shop) {
        return obj;
    } 
    let level = shop.level;
    let score = shop.score;
    if (score > 10000000) {
        obj = shopLevelSub(10000001, score, 99999999);
        obj.next = '5金冠';
    } else {
        for(let item of startArr) {
            if (score <= item.level) {
                obj = shopLevelSub(item.start, score, item.end);
                obj.next = item.next;
                break;
            }
        };
    }

    obj.level_pic_path1 = { uri:'https://q.aiyongbao.com/trade/web/images/qap_img/mobile/level_s_' + level + '.png' };
    obj.level_pic_path2 = { uri:'https://q.aiyongbao.com/trade/web/images/qap_img/mobile/level_s_' + (level + 1) + '.png' };
    let level_pic_path_width1 = '36rpx';
    let level_pic_path_width2 = '36rpx';
    let pc_level_pic_path_width1 = '16px';
    let pc_level_pic_path_width2 = '16px';
    switch (level % 5) {
        case 1:
            level_pic_path_width1 = '36rpx';
            pc_level_pic_path_width1 = '16px';
            break;
        case 2:
            level_pic_path_width1 = '72rpx';
            pc_level_pic_path_width1 = '32px';
            break;
        case 3:
            level_pic_path_width1 = '108rpx';
            pc_level_pic_path_width1 = '48px';
            break;
        case 4:
            level_pic_path_width1 = '144rpx';
            pc_level_pic_path_width1 = '64px';
            break;
        case 0:
            if (level == 0) {
                level_pic_path_width1 = '36rpx';
                pc_level_pic_path_width1 = '16px';
            } else {
                level_pic_path_width1 = '180rpx';
                pc_level_pic_path_width1 = '80px';
            }
            break;
        default:
            level_pic_path_width1 = '36rpx';
            pc_level_pic_path_width1 = '16px';
    }
    switch ((level + 1) % 5) {
        case 1:
            level_pic_path_width2 = '36rpx';
            pc_level_pic_path_width2 = '16px';
            break;
        case 2:
            level_pic_path_width2 = '72rpx';
            pc_level_pic_path_width2 = '32px';
            break;
        case 3:
            level_pic_path_width2 = '108rpx';
            pc_level_pic_path_width2 = '48px';
            break;
        case 4:
            level_pic_path_width2 = '144rpx';
            pc_level_pic_path_width2 = '64px';
            break;
        case 0:
            if (level == 0) {
                level_pic_path_width2 = '36rpx';
                pc_level_pic_path_width2 = '16px';
            } else {
                level_pic_path_width2 = '180rpx';
                pc_level_pic_path_width2 = '80px';
            }
            break;
        default:
            level_pic_path_width2 = '36rpx';
            pc_level_pic_path_width2 = '16px';
    }
    obj.level_pic_path_width1 = level_pic_path_width1;
    obj.pc_level_pic_path_width1 = pc_level_pic_path_width1;
    obj.level_pic_path_width2 = level_pic_path_width2;
    obj.pc_level_pic_path_width2 = pc_level_pic_path_width2;
    return obj;
}

function shopLevelSub (start, now, end) {
    let obj = {};
    let allNeed = end - start;
    let have = now - start;
    obj.exp = Math.round(have / allNeed * 690) + 'rpx';
    obj.need = end + 1 - now;
    obj.level_pic_text1 = start + '分-' + end + '分';
    obj.level_pic_text2 = end + 1 + '分';
    obj.have = have;
    obj.allNeed = allNeed;
    return obj;
}
