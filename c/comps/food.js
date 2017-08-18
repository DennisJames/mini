var cgis = require('const').cgis;
var message = require('const').message;
var cookie = require('libs/cookie');
var request = require('libs/request');

var PAGE_SIZE = 10;

module.exports = { 
	template: `<ul class="food_list">
				<router-link :to="'/info/'+item.id" v-for="item in list" tag="li" :key="item.id" v-bind:data-id="item.id" class="item" v-on:click.native="report">
					<img v-bind:src="item.pic_url" :alt="item.name" />
					<h3>{{item.name}}</h3><p>{{item.location}}</p><p v-if="item.like_cnt">好评度：{{item.like_cnt == 0 && item.unlike_cnt == 0 ? '100.00' : (100 * item.like_cnt/(item.like_cnt+item.unlike_cnt)).toFixed(2)}}%</p>
					<div class="clearBoth"></div>
				</router-link>
			</ul>`,
	data: function(){
		return {
			list: []
		}
	},
	created: function(){
		var self = this;
		var sessionKey = '';
		if(sessionKey = cookie.get('user_session_key')){
			request(cgis.recommendFood.replace('{{usessionkey}}', sessionKey)
				.replace('{{start}}', 0).replace('{{num}}', 10), 'get', function(err, res){
					console.log(err, res);
					if(err) {window.alert(err.message); return ;}
					var ids = res.food_id;
					request(cgis.queryFoods.replace("{{ids}}", ids.join(',')), 'get', function(err, res){
						console.log(err, res);
						if(err) { window.alert(message.http_error); return ;}
						self.list = res.jsResult;
					})
				})
		}
		else{
			self.allList(1);
		}
	},
	methods: {
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
		},
		report:function(e){
			console.log(e.currentTarget,11111111111111)
            var self=this
			var status=1
			var user_session=cookie.get('user_session_key')
			var id=e.currentTarget.getAttribute('data-id')
			var res=[status,user_session,id],i=0;
			self.$http.post(cgis.reportFood.replace(/{{}}/g,function(){
				return res[i++]
			})).then(function(data){
				//success
			},function(){
				//fail
			})
		}
	}
}