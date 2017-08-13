var cookie = require('libs/cookie');
var FOOD_TYPE = require('const').food_type;
var cgis = require('const').cgis;
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