/**
 *  获取当前时间离指定时间还有多少天多少小时多少分
 **/
const GetDateDiff= function(enddate){
	if (!enddate) {
		return '';
	}
	var date2 = new Date(Date.parse(enddate.replace(/-/g, "/")));
    var s2 = date2.getTime();
    var date1 = new Date();
    var s1 = date1.getTime();
    var ms=s2 - s1;
    var h = Math.floor(ms / (3600 * 1000 * 24));
    var m = Math.floor((ms - h * 3600 * 1000 * 24) / (3600 * 1000));
    var s = Math.floor((ms - h * 3600 * 1000 * 24 - m * 3600 * 1000) / 60000);
    return '剩' + h + "天" + m + "小时" + s + '分';
}
export { GetDateDiff };