'use strict';

var ua = navigator.userAgent.toLowerCase()
module.exports = {
	isWX: function () {
		return /micromessenger/.test(ua)
	},
	isQQ: function () {
		return /\bqq\b/.test(ua)
	},
	isQQLive: function () {
		return /qqlive/.test(ua)
	},
	isMobile: function () {
		var ua = navigator.userAgent
		if( ua.match(/Android/i)
			|| ua.match(/android/i)
			|| ua.match(/iPhone/i)
			|| ua.match(/iPod/i)
			|| ua.match(/webOS/i)
			|| ua.match(/BlackBerry/i)
			|| ua.match(/BB/i)
			|| ua.match(/Windows Phone/i)
			|| ua.match(/ApacheBench/i)
			|| ua.match(/iPad.*MicroMessenger/i)
			|| ua.match(/IEMobile/i)
			|| ua.match(/spider/i)
			|| ua.match(/bot/i)
			|| ua.match(/curl/i)
		){
		    return true
		}
		else {
		    return false
		}
	},
	isIOS: function () {
		return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
	},
	isTargetClient: function () {
		// 三大客户端
		return this.isWX() || this.isQQ() || this.isQQLive()
	}
}