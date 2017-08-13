/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	// 2. 定义路由
	// 每个路由应该映射一个组件。 其中"component" 可以是
	// 通过 Vue.extend() 创建的组件构造器，
	// 或者，只是一个组件配置对象。
	const routes = [{
		path: '/',
		redirect: '/food'
	}, {
		path: '/food',
		component: __webpack_require__(1)
	}, {
		path: '/profile',
		component: __webpack_require__(2)
	}, {
		path: '/login',
		component: __webpack_require__(5)
	}, {
		path: '/info/:id',
		component: __webpack_require__(7)
	}];

	// 3. 创建 router 实例，然后传 `routes` 配置
	// 你还可以传别的配置参数, 不过先这么简单着吧。
	window.router = new VueRouter({
		routes // （缩写）相当于 routes: routes
	});

	// 4. 创建和挂载根实例。
	// 记得要通过 router 配置参数注入路由，
	// 从而让整个应用都有路由功能
	const app = new Vue({
		el: '#app',
		router: router
	});

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	var Data = [
		{
			id: 1,
			name: "青椒炒肉",
			pic: "/img/pic1.jpg",
			address: "腾大12楼自选窗口"
		},
		{
			id: 2,
			name: "三极地",
			pic: "/img/pic1.jpg",
			address: "腾大12楼1号窗口"
		},
		{
			id: 3,
			name: "汤面",
			pic: "/img/pic1.jpg",
			address: "腾大12楼2号窗口"
		}
	];

	module.exports = { 
		template: `<ul>
					<router-link :to="'/info/'+item.id" v-for="item in list" tag="li" :key="item.id">
						<img v-bind:src="item.pic" :alt="item.name" />
						<h3>{{item.name}}</h3><p>{{item.address}}</p>
					</router-link>
				</ul>`,
		data: function(){
			return {
				list: Data
			}
		}
	}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var cookie = __webpack_require__(3);
	var FOOD_TYPE = __webpack_require__(4).food_type;
	var cgis = __webpack_require__(4).cgis;
	module.exports = { 
		template: `<div v-if="!!user">
				<p>{{user.name}}<span v-if="user.type==1">管理员</span>,你好</p>
				<button v-on="{click: addFood}" v-if="user.type==1">录入菜品</button>
				<button v-on="{click: logout}">退出登录</button>
				<div v-if="add">
					<label>菜品名称：<input type="text" v-model="food.name" /></label><br />
					<label>档口地址：<input type="text" v-model="food.location" /></label><br />
					<label>辣度：
						<button v-on="{click: reduceP}">-</button>
						<i class="icon pepper" v-for="i in food.pungency"></i>
						<button v-on="{click: addP}">+</button>
					</label><br />
					<select v-model="food.type">
						<option value="">请选择菜系</option>
						<option v-for="(item, index) in FOOD_TYPE" :value="index">{{item}}</option>
					</select><br />
					<textarea v-model="food.desc"></textarea>
				</div>
			</div>
			<div v-else>
				<router-link to="/login">请先登录</router-link>
			</div>`,
		data: function() {
			var name = cookie.get('username');
			var type = cookie.get('type');
			var user = {
				name: name,
				type: type
			};
			var hasLogin = !!cookie.get('user_session_key') || !!cookie.get('admin_session_key');
			return {
				FOOD_TYPE: FOOD_TYPE,
				add: false,
				user: hasLogin ? user : null,
				food: {
					name: '',
					desc: '',
					location: '',
					type: 0,
					pungency: 1
				}
			}
		},
		methods: {
			logout: function(){
				console.log(this.type)
				this.$http.get(this.user.type == 0 ? cgis.userLogout : cgis.adminLogout);
				this.user = null;
				cookie.del('username');
				cookie.del('user_session_key');
				cookie.del('admin_session_key');
				cookie.del('type');
			},
			addP: function(){
				this.food.pungency < 5 && this.food.pungency ++;
			},
			reduceP: function(){
				this.food.pungency > 1 && this.food.pungency --;
			},
			addFood: function(){
				this.add = true;
			}
		}
	};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';

	module.exports = {
		/**
		 * 设置一个cookie
		 * @param {String}
		 *          name cookie名称
		 * @param {String}
		 *          value cookie值
		 * @param {String}
		 *          domain 所在域名 默认为window.location.host的值
		 * @param {String}
		 *          path 所在路径 默认为是"\"
		 * @param {Number}
		 *          hour 存活时间，单位:小时
		 * @return {Boolean} 是否成功
		 */
		set : function(name, value, domain, path, hour) {
			if (hour) {
				var today = new Date();
				var expire = new Date();
				expire.setTime(today.getTime() + 3600000 * hour);
			}
			document.cookie = name + "=" + value + "; " + (hour ? ("expires=" + expire.toGMTString() + "; ") : "") + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + window.location.host + ";"));
			return true;
		},

		/**
		 * 获取指定名称的cookie值
		 *
		 * @param {String}
		 *          name cookie名称
		 * @return {String} 获取到的cookie值
		 */
		get : function(name) {
			var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)");
			var m = document.cookie.match(r);
			return (!m ? "" : m[1]);
		},

		/**
		 * 删除指定cookie,复写为过期
		 *
		 * @param {String}
		 *          name cookie名称
		 * @param {String}
		 *          domain 所在域 默认为 window.location.host的值
		 * @param {String}
		 *          path 所在路径 默认为是"\"
		 */
		del : function(name, domain, path) {
			var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			document.cookie = name + "=; expires=" + exp.toGMTString() + ";" + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + window.location.host + ";"));
		}
	}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';
	var USE_PROXY = true;
	var cgiHost = USE_PROXY ? "http://127.0.0.1" : "http://115.159.200.162";
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
			userLogin: cgiHost + "/cgi-bin/UserLogin",  // post
			userLogout: cgiHost + "/cgi-bin/userLogout",
			adminLogin: cgiHost + "/cgi-bin/AdminLogin", // post
			adminLogout: cgiHost + "/cgi-bin/AdminLogout"
		},
		food_type: ["粤菜", "川菜", "鲁菜", "苏菜", "浙菜", "闽菜", "湘菜", "徽菜"]
	};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var cgis = __webpack_require__(4).cgis;
	var util = __webpack_require__(6);
	var cookie = __webpack_require__(3);
	module.exports = {
		template: `<div>
			username:<input type="text" v-model="name" /><br />
			password:<input type="password" v-model="password" /><br />
			<label><input type="radio" name="type" v-model="type" value="0" />普通用户</label>
			<label><input type="radio" name="type" v-model="type" value="1" />管理员</label>
			<button v-on="{click: submit}">登录</button>
		</div>`,
		data: function(){
			return {
				type: 0,
				name: 'user233',
				password: 'user233'
			}
		},
		methods: {
			submit: function(){
				console.log(this.type);
				var self = this;
				var param = {
					username: self.name,
					password: self.password
				};
				this.$http.post(this.type == 0 ? cgis.userLogin : cgis.adminLogin, util.queryStringify(param)).then(function(res){
					if(!res.ok || !res.body) return;
					if(res.body.retCode != 0) {
						window.alert('登录失败，用户名或密码错误，请重试。');
						return;
					}
					if(self.type == 0){
						cookie.set('user_session_key', res.body.user_session_key);
					} else {
						cookie.set('admin_session_key', res.body.admin_session_key);					
					}
					cookie.set('type', self.type);
					cookie.set('username', res.body.realname);
					router.push('/profile');
				}, function(err){
					window.alert('登录失败，网络错误。');
				})
			}
		}
	}

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';

	module.exports = {
		/**
		 * 扩展对象
		 */
		extend: function(obj) {
	        if (this.type(obj) != 'object') return obj;
	        var source, prop;
	        for (var i = 1, length = arguments.length; i < length; i++) {
	            source = arguments[i];
	            for (prop in source) {
	                obj[prop] = source[prop];
	            }
	        }
	        return obj;
	    },
	    /**
	     * 返回对象的类型
	     */
	    type: function (obj) {
	        return /\[object (\w+)\]/.exec(Object.prototype.toString.call(obj))[1].toLowerCase()
	    },
	    /**
	     *  获取 query 参数
	     */
	    queryParse: function(search, spliter) {
	        if (!search) return {};

	        spliter = spliter || '&';

	        var query = search.replace(/^\?/, ''),
	            queries = {},
	            splits = query ? query.split(spliter) : null;

	        if (splits && splits.length > 0) {
	            splits.forEach(function(item) {
	                item = item.split('=');
	                var key = item.splice(0, 1),
	                    value = item.join('=');
	                queries[key] = value;
	            });
	        }
	        return queries;
	    },
	    /**
	     * 将对象转换成url参数
	     */
	    queryStringify: function (params, spliter) {
	        if (!params) return ''
	        return Object.keys(params).map(function (k) {
	            return k + '=' + encodeURIComponent(params[k])
	        }).join(spliter || '&')
	    }
	}

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	var TYPE_TXT = {
		'0': "广东菜",
		'1': "湘菜"
	}
	module.exports = {
		template: `<div class="info_wrap">
			<img :src="food.pic" :alt="food.name" />
			<h3>{{food.name}}</h3>
			<p>{{food.desc}}</p>
			<p><span>菜系：</span>{{TYPE_TXT[food.type]}}<p>
			<p><span>辣度：</span><i v-for="i in food.pungency" class="icon pepper"></i></p>
			<p><span>位置：</span>{{food.location}}</p>
		</div>`,
		data: function(){
			return {
				TYPE_TXT: TYPE_TXT,
				food: {
					pic: '',
					name: '菜品名称',
					desc: '菜品描述',
					location: '',
					type: 0,
					pungency: 2
				}
			}
		},
		created: function(){
			console.log(this.$route.params.id);
		}
	}

/***/ })
/******/ ]);