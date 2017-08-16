var TYPE_TXT = {
	'0': "广东菜",
	'1': "湘菜"
}
var cgis = require('const').cgis
var cookie = require('libs/cookie')
module.exports = {
	template: `<div class="info_wrap">
					<div v-if="errMsg" class="detailErr">
					 	{{errMsg}}
					</div>
					<div v-else> 
						<div v-if="!errMsg" class="detail">
							<img :src="food.url" :alt="food.name" />
							<h3>{{food.name}}</h3>
							<p>{{food.introduce}}</p>
							<p><span>菜系：</span>{{TYPE_TXT[food.food_type]}}<p>
							<p><span>辣度：</span><i v-for="i in food.pungency" class="icon pepper"></i></p>
							<p><span>位置：</span>{{food.location}}</p>
						</div>
						<div  class="praise_oppose">
						  <div class="praise_oppose_center">
						 	<div class="praise" v-on:click.once="toggle('praise')">
								<span class="praise_img"><img src="/praise.png" /></span>
								<span class="praise_txt">1000</span>
								<span class="add_num"><em>+1</em></span>
							</div>
							<div class="oppose" v-on:click.once="toggle">
								<span class="oppose_img"><img src="/oppose.png" /></span>
								<span class="oppose_txt">{{opposeNum}}</span>
								<span class="reduce_num"><em>+1</em></span>
							</div>
						   </div>
				        </div>
			        </div>
			  </div>`,
	data: function(){
		return {
			TYPE_TXT: TYPE_TXT,
			food: '',
			errMsg:"loading...",
			praiseNum:"",
			opposeNum:""
		}
	},
	created: function(){
		var self=this
		console.log(self.$route.params.id);
		self.$http.get(cgis.detailFood.replace(/{{}}/g,function(a,b){
			return self.$route.params.id
		})).then(function(data){
			data=data.body
			if(data.jsResult&&data.jsResult.length>0){
				self.errMsg=""
				self.food=data.jsResult[0]
			}else{
				self.errMsg="获取数据失败"
			}
		},function(err){
			self.errMsg="网络似乎出了点问题"
		})
	},
	methods:{
		toggle:function(msg){
			var self=this
			var status=msg?2:3
			var user_session=cookie.get('user_session_key')
			var id=self.$route.params.id
			var res=[status,user_session,id],i=0;
			self.$http.post(cgis.comFood.replace(/{{}}/g,function(){
				return res[i++]
			})).then(function(){
				msg?++self.praiseNum:++self.opposeNum
			},function(){
				//fail
			})
		}
	}
}