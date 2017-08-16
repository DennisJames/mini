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
var cgis = require('const').cgis;
var message = require('const').message;
var cookie = require('libs/cookie');
var request = require('libs/request');

var PAGE_SIZE = 10;

module.exports = { 
	template: `<ul class="food_list">
				<router-link :to="'/info/'+item.id" v-for="item in list" tag="li" :key="item.id" class="item">
					<img v-bind:src="item.pic_url" :alt="item.name" />
					<h3>{{item.name}}</h3><p>{{item.location}}</p>
					<div class="clearBoth"></div>
				</router-link>
			</ul>`,
	data: function(){
		return {
			list: Data
		}
	},
	created: function(){
		var self = this;
		var sessionKey = '';
		if(sessionKey = cookie.get('user_session_key')){
			request(cgis.recommendFood.replace('{{usessionkey}}', sessionKey)
				.replace('{{start}}', 0).replace('{{num}}', 10), 'get', function(err, res){
					console.log(err, res);
					if(err) return ;
					var ids = res.food_recomm.map(function(i){
						return i.food_id;
					});
					console.log(ids.join(','))
					request(cgis.queryFoods.replace("{{ids}}", ids.join(',')), 'get', function(err, res){
						console.log(err, res);
						if(err) { window.alert(message.http_error); }
						self.list = res.jsResult;
					})
				})
		}
	},
	method: {
		allList: function(page){
			this.$http.get(cgis.queryFood.replace('{{start}}', (page-1)*PAGE_SIZE).replace('{{count}}', PAGE_SIZE)).then(function(res){
				console.log(res);
				if(!res.ok || !res.body || res.body.iRet != 0){ 
					window.alert(message.http_error);
					this.list = [];
					return ;
				}
				this.list = res.body.jsResult;
			}, function(err){
				console.log(err);
			});
		},
		countData: function(){
			this.$http.get(cgis.countFood).then(function(res){
				console.log(res.body.jsResult[0].count);
			})
		}
	}
}