'use strict';

var Message = require('libs/message')
var util = require('modules/util')
var detection = require('modules/detection')
var message = new Message()

var _isQQLiveReady = false
document.addEventListener('onTenvideoJSBridgeReady', QQLiveReady)
document.addEventListener('WebViewJavascriptBridgeReady', QQLiveReady)
function QQLiveReady () {
	if (_isQQLiveReady) return
	_isQQLiveReady = true

	if (window.WebViewJavascriptBridge) {
		window.TenvideoJSBridge = window.WebViewJavascriptBridge
		window.TenvideoJSBridge.invoke = window.WebViewJavascriptBridge.callHandler
		window.TenvideoJSBridge.on = window.WebViewJavascriptBridge.registerHandler
	}
	message.emit('qqlive:share:ready')
}
window.TenvideoJSBridge && QQLiveReady()
function checkBridge() {
	if (window.TenvideoJSBridge) {
		QQLiveReady()
	} else {
		setTimeout(checkBridge, 200)
	}
}
if (detection.isQQLive()) checkBridge()

function noop () {}
function onReady (cb) {
	if (window.TenvideoJSBridge) return cb(window.TenvideoJSBridge)
	else {
		message.on('qqlive:share:ready', function () {
			cb(window.TenvideoJSBridge)
		})
	}
}
onReady(function (bridge) {
	bridge.on('onActionLoginFinish', function (res) {
		message.emit('qqlive:login:finish', res)
	})
	bridge.on('actionLoginFinish', function (res) {
		message.emit('qqlive:login:finish', res)
	})
	bridge.on('onActionLogoutFinish', function (res) {
		message.emit('qqlive:logout:finish', res)
	})
	bridge.on('actionLogoutFinish', function (res) {
		message.emit('qqlive:logout:finish', res)
	})
})

function once (fn) {
	var called
	return function () {
		if (called) return
		called = true
		fn && fn.apply(this, arguments)
	}
}
module.exports = {
	ready: onReady,
	invoke: function (type, params, callback) {
		window.TenvideoJSBridge.invoke(type, params, function (res) {
			try {
				if (util.type(res) == 'string') {
					res = JSON.parse(res)
				}
			} catch (e) {
				console.log(e)
			}
			callback && callback(res)
		})
	},
	getMainLogin: function (cb) {
		if (detection.isIOS()) {
			this.invoke('getMainLogin', null, cb)
		} else {
			this.invoke('getMainLoginType', null, cb)
		}
	},
	getUserInfo: function (type, cb) {
		if (util.type(type) == 'string') type = [type]
		return this.invoke('getUserInfo', {type: type}, cb)
	},
	getCookie: function (type, cb) {
		if (util.type(type) == 'string') type = [type]
		return this.invoke('getCookie', {type: type}, cb)
	},
	changeAccount: function () {
		var that = this
		message.off('qqlive:logout:finish')

		that.invoke('actionLogin', {type: 'tv'}, function () {})
		var handler = once(function (res) {
			message.off('qqlive:logout:finish', handler)
			// 参数出错：errCode: 1 errMsg: params error 
			// 未知错误：errCode: 1 errMsg: unknown error 
			// 未登录：errCode: 1 errMsg: not login 
			// 登录失败：errCode: 1 errMsg: login fail 
			// 取消登录：errCode: 2 errMsg: login cancel
			// 拒绝分享地理位置：errCode: -1 errMsg: get location fail 
			// 获取地理位置失败：errCode: -2 errMsg: get location fail 
			// if (!res.errCode) {
			that.invoke('actionLogin', {type: 'tv'}, function () {
				location.reload()
			})
			// }
		})
		message.on('qqlive:logout:finish', handler)
	}

}