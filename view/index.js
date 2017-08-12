'use strict';

window.Zect = window.Zect || require('zect');

Zect.namespace('mini_food');

var App = require('app');
var util = require('modules/util');

window.InitializeApp = function (pg) {
	pg = pg || 'index'

	var query = util.queryParse(location.search)

	var $app = new Zect({
		el: '#app'
	})
	// set for global access
	App.set($app)

	var inited;
	function boot() {
		if (inited) return
		inited = true
		/**
		 * global default share info
		 */
		if (storage.ptag == consts.ptag.qqvip) {
			Share.defaultInfo({
				title: consts.share_text.title.qqvip,
				content: consts.share_text.content.qqvip,
				link: consts.share_info.link + '?ptag=' + consts.ptag.qqvip
			})
		}
		// 隐藏进度条
		switch (pg) {
			case 'index':
				break
			default:
				Progress.hide()
		}
		var $page = new Page({
			// replace: true
		})
		$page.$appendTo($app.$el)
	}
}