var cgis = require('const').cgis;
var util = require('modules/util');
var cookie = require('libs/cookie');
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