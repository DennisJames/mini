'use strict';

/**
 * @require views/lib/qqapi.custom.uncompressed.js
 */
var App = require('app')
var detection = require('modules/detection')
var util = require('modules/util')
var qqlive = require('modules/qqlive')
var message = require('libs/message')
var consts = require('consts')
var _commonShareInfo = consts.share_info
var _shareInfo

function noop () {}

function getWXShareInfo() {
	var info = util.extend({link: location.href}, _commonShareInfo, _shareInfo)
	return {
		appid : consts.appid,
		img_url : info.img || '',
		img_width : "120",
		img_height : "90",
		link : info.link || '',
		desc : info.content || '',
		title : info.title
	}
}
function getCallback() {
	return (_shareInfo || {}).callback || noop
}
document.addEventListener('WeixinJSBridgeReady', function () {
	function shareHandler (type) {
		message.emit('share')

		var info = getWXShareInfo()
		var cb = getCallback()
		WeixinJSBridge.invoke(type, info, function(res){
			cb()
			/**
			 * res.err_msg share_timeline:cancel
			 */
		})
	}
	window.WeixinJSBridge.on('menu:share:timeline', shareHandler.bind(null, 'shareTimeline'))
	window.WeixinJSBridge.on('menu:share:appmessage', shareHandler.bind(null, 'sendAppMessage'))
	window.WeixinJSBridge.on('menu:share:qq', shareHandler.bind(null, 'shareQQ'))
	window.WeixinJSBridge.on('menu:share:weiboApp', shareHandler.bind(null, 'shareWeiboApp'))
	window.WeixinJSBridge.on('menu:share:QZone', shareHandler.bind(null, 'shareQZone'))
})

function getVideoShareInfo () {
	var info = util.extend({link: location.href}, _commonShareInfo, _shareInfo)
	return {
		"title": info.title,
        "subTitle": info.content,
        "singleTitle": "",
        "content": info.content,
        "contentTail": "",
        "imageUrl": info.img,
        "url": info.link || window.location.href,
        "style": 1, //分享为0、弹框分享（不可修改）为1、弹框分享（可修改）为2
        "picList": [] // imgUrl, thumbUrl
	}
}
function getVideoDefaultShareInfo () {
	var info = util.extend({link: location.href}, _commonShareInfo)
	return {
		"title": info.title,
        "subTitle": info.content,
        "singleTitle": "",
        "content": info.content,
        "contentTail": "",
        "imageUrl": info.img,
        "url": info.link || window.location.href,
        "style": 1, //分享为0、弹框分享（不可修改）为1、弹框分享（可修改）为2
        "picList": [] // imgUrl, thumbUrl
	}
}

qqlive.ready(function () {
	setQQLiveDefaultShareInfo()
	window.TenvideoJSBridge.on('onShareFinish', function () {
		setQQLiveDefaultShareInfo()
	})
	/**
	 * iphone4.2/aphone4.3
	 */
	window.TenvideoJSBridge.on('onToolsDialogShow', function () {
		message.emit('share')
	})
	window.TenvideoJSBridge.on('onToolsDialogClose', function () {
		setQQLiveDefaultShareInfo()
	})
})
function setQQLiveDefaultShareInfo(cb) {
	window.TenvideoJSBridge.invoke(
		'setMoreInfo',
		{
			"hasRefresh": true,
			"hasShare": true, 
			"hasFollow": false,
	    	"shareInfo": getVideoDefaultShareInfo()
		}, 
		function () {
			// callback
			cb && cb()
		}
	)
}
function getQQLiveOptions (info) {
	return {
		"hasRefresh": false,
		"hasShare": true, 
		"hasFollow": false,
    	"shareInfo": info
	}
}
function getQQShareInfo (type) {
	var info = util.extend({link: location.href}, _commonShareInfo, _shareInfo)
	return {
		title: info.title,
		desc: info.content,
		share_type: type,
		share_url: info.link,
		image_url: info.img
	}
}
function onQQReady() {
	mqq.ui.setOnShareHandler(function (type) {
		message.emit('share')
		var info = getQQShareInfo(type)
		mqq.ui.shareMessage(getQQShareInfo(type), function () {
			_shareInfo = null
		})	
	})
}

function setQQShareInfo(info) {
	mqq.data.setShareInfo({
		title: _shareInfo.title,
		desc: _shareInfo.content || '',
		share_type: 0,
		share_url: _shareInfo.link,
		image_url: _shareInfo.img || ''
	})
}
var timer
function Share (info, cb) {
	message.emit('share')
	cb = cb || noop

	_shareInfo = util.extend({}, _commonShareInfo, info)
	console.log('share_info', _shareInfo)
	var isCallback
	// once
	_shareInfo.callback = function () {
		if (isCallback) return
		isCallback = true
		_shareInfo = null
		cb.apply(this, arguments)
	}
	if (detection.isQQ()) {
		clearTimeout(timer)
		setQQShareInfo(_shareInfo)
		mqq.ui.showShareMenu()
		// 10s没有响应当作回调
		timer = setTimeout(function () {
			_shareInfo && _shareInfo.callback()
		}, 10*1000)
	} else if (detection.isWX()) {
		App().$refs.sharetip.show()
		var originCb = _shareInfo.callback
		_shareInfo.callback = function () {
			App().$refs.sharetip.hide()
			originCb.apply(this, arguments)
		}
	} else if (detection.isQQLive()) {
		qqlive.ready(function () {
			var info = getVideoShareInfo()
			var bridge = window.TenvideoJSBridge
			bridge.invoke('setMoreInfo', getQQLiveOptions(info), function () {
				var _isCallback = false
				function shareCallback () {
					if (isCallback) return
					_isCallback = true

					/**
					 * 没有分享成功／取消事件，只能采取延时
					 */
					setTimeout(function () {
						_shareInfo && _shareInfo.callback()
					}, 500)
				}
				bridge.invoke('openToolsDialog', undefined, shareCallback)
			})
		})
	}
}
/**
 * 设置默认的分享信息
 */
Share.defaultInfo = function (info) {
	if (info) {
		_commonShareInfo = util.extend({}, _commonShareInfo, info)
		if (detection.isQQLive()) {
			qqlive.ready(function () {
				setQQLiveDefaultShareInfo()
			})
		}
	}
}

onQQReady()
module.exports = Share