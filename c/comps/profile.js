var cookie = require('libs/cookie');
var FOOD_TYPE = require('const').food_type;
var cgis = require('const').cgis;
var message = require('const').message;
var util = require('modules/util');
module.exports = { 
	template: `<div v-if="!!user">
			<p>{{user.name}}<span v-if="user.type==1">管理员</span>,你好</p>
			<button v-on="{click: addFood}" v-if="user.type==1">录入菜品</button>
			<button v-on="{click: logout}">退出登录</button>
			<div class="food_wrap" v-if="add">
				<div class="food_avatar_wrap" v-if="hasPic"><img class="food_avatar" :src="picture" /></div>
				<label v-if="!hasPic">上传图片: <input type="file" v-on:change="upload" /></label>
				<label>菜品名称：<input type="text" v-model="food.name" /></label><br />
				<label>档口地址：<input type="text" v-model="food.location" /></label><br />
				<label>辣度：
					<button class="btn_small" v-on="{click: reduceP}">-</button>
					<i class="icon pepper" v-for="i in food.pungency"></i>
					<button class="btn_small" v-on="{click: addP}">+</button>
				</label><br />
				<label>菜系：
				<select v-model="food.food_type">
					<option v-for="(item, index) in FOOD_TYPE" :value="index">{{item}}</option>
				</select>
				</label><br />
				<textarea v-model="food.introduce" placeholder="请输入菜品相关描述。如食材、做法等。"></textarea>
				<button class="btn_submit" v-on:click="submit">提交</button>
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
			picture: '',
			hasPic: false,
			add: false,
			user: hasLogin ? user : null,
			food: {
				pic_url: '',
				name: '',
				introduce: '',
				location: '',
				food_type: 0,
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
		},
		upload: function(event){
			var self = this;
			var file = event.target.files[0];
			var formData = new FormData();
			formData.append('file', file);
			this.$http.post(cgis.upload, formData).then(function(res){
				console.log(res);
				if(res.ok){
					self.hasPic = true;
					self.picture = self.food.pic_url = res.body.path;
				}
			}, function(err){
				console.log(err);
			})
		},
		resetFood: function(){
			var tmp = {
				pic_url: '',
				name: '',
				introduce: '',
				location: '',
				food_type: 0,
				pungency: 1
			}
			this.food = tmp;
			this.picture = '';
			this.hasPic = false;
		},
		submit: function(){
			var self = this;
			var test = true;
			for(key in self.food){
				if(self.food[key].length == 0){
					test = false;
					break;
				}
			}
			if(!test) {
				window.alert("信息不能为空!");
				return;
			}
			var cgiParam = 'food=' + JSON.stringify(self.food);
			self.$http.post(cgis.addFood, cgiParam).then(function(res){
				console.log(res);
				if(res.body.iRet == 0){
					window.alert(message.success);
					self.resetFood();
				} else {
					window.alert(message.http_error);
				}
			}, function(err){
				window.alert(message.http_error);
			})
		}
	}
};