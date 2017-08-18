'use strict';
var USE_PROXY = true;
var cgiHost = USE_PROXY ? 'http://' + window.location.host : "http://115.159.200.162";
var share_text = {
	content: {
		'user': '无论在不在现场，V.I.P永远站在BIGBANG身旁，购买礼包支持他们，有机会获赠签名周边哦~',
		'default': '无论在不在现场，V.I.P永远站在BIGBANG身旁，购买礼包支持他们，有机会获赠签名周边哦~',
		'open': '抢明星生日徽章号，获赠限量版熊公仔，你是下一个幸运儿吗？',
		'show': '我是V.I.P，我骄傲，购买BB礼包，为自己喜欢的男神加油～',
		'qqvip': '购买礼包支持 BB,即使不在现场,仍有机会获赠签名周边哦~'
	},
	title: {
		'user': '我购买了{score}个BIGBANG数字礼包，全球排名第{rank}位',
		'default': '奔走相告，BIGBANG官方授权数字礼包酷炫来袭~',
		'open': '我的礼包徽章号{no}，一起为BIGBANG加油',
		'show': '我是BIGBANG礼包第{num}位支持者，全球排名第{rank}位',
		'qqvip': 'BIGBANG 官方授权大礼包,QQ 会员购买 8 折优惠'
	}
};
module.exports = {
	share_text: share_text,
	cgis: {
		upload: cgiHost + "/upload-pic", // post

		userLogin: cgiHost + "/cgi-bin/UserLogin",  // post
		userLogout: cgiHost + "/cgi-bin/userLogout",
		adminLogin: cgiHost + "/cgi-bin/AdminLogin", // post
		adminLogout: cgiHost + "/cgi-bin/AdminLogout",

		countFood: cgiHost + "/cgi-bin/query_food?task=food&action=getCount",
		queryFood: cgiHost + "/cgi-bin/query_food?task=food&action=queryList&start={{start}}&count={{count}}",
		queryFoods: cgiHost + "/cgi-bin/query_food?task=food&action=queryIds&id={{ids}}",
		addFood: cgiHost + "/cgi-bin/query_food?task=food&action=addFood", // post
		reportFood:cgiHost+'/cgi-bin/UserRecord.exe?click_type={{}}&user_key={{}}&food_id={{}}',
		comFood: cgiHost + "/cgi-bin/query_food?task=food&action=likeOrNot&type={{}}&&id={{}}",
		detailFood:cgiHost+'/cgi-bin/query_food?task=food&action=queryInfo&id={{}}',
		recommendFood: cgiHost + '/cgi-bin/UserRecomm?user_session_key={{usessionkey}}&recommend_food_start={{start}}&recommend_food_num={{num}}'
	},
	food_type: ["粤菜", "川菜", "鲁菜", "苏菜", "浙菜", "闽菜", "湘菜", "徽菜"],
	message: {
		http_error: "网络请求错误！",
		success: "操作成功！"
	}
};