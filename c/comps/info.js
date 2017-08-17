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
							<div class="food_avatar_wrap"><img :src="food.pic_url" :alt="food.name" /></div>
							<h3>{{food.name}}</h3>
							<p>{{food.introduce}}</p>
							<p><span>菜系：</span>{{TYPE_TXT[food.food_type]}}<p>
							<p><span>辣度：</span><i v-for="i in food.pungency" class="icon pepper"></i></p>
							<p><span>位置：</span>{{food.location}}</p>
						</div>
						<div  class="praise_oppose">
						  <div class="praise_oppose_center">
						 	<div class="praise" v-on:click="toggle('praise')">
								<span class="praise_img"><img src="/praise.png" /></span>
								<span class="praise_txt">{{food.like_cnt}}</span>
								<span class="add_num"><em>+1</em></span>
							</div>
							<div class="oppose" v-on:click="toggle">
								<span class="oppose_img"><img src="/oppose.png" /></span>
								<span class="oppose_txt">{{food.unlike_cnt}}</span>
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
			errMsg:"loading..."
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
				self.food.like_cnt=self.food.like_cnt||0
				self.food.unlike_cnt=self.food.unlike_cnt||0
			}else{
				self.errMsg="获取数据失败"
			}
		},function(err){
			self.errMsg="网络似乎出了点问题"
		})
	},
	methods:{
		toggle:function(msg,e){
			var self=this
			var el
			if(msg=='praise'){
				status=1
				el=$('.add_num')
			}else{
				status=2
				el=$('.reduce_num')
			}
			if(el.data('isClicked')){
				self.animation(el,'clicked')
				return 
			}
			var id=self.$route.params.id
			var res=[status,id],i=0;
			self.$http.post(cgis.comFood.replace(/{{}}/g,function(){
				return res[i++]
			})).then(function(data){
				if(msg=='praise'){
					++self.food.like_cnt
				}else{
					++self.food.unlike_cnt
				}
				el.data('isClicked',1)
				self.animation(el,'+1')
			},function(){
				//fail
			})
		},
		animation:function($el,txt){
			var top;
			$el.find("em").text(txt)
			$el.css('display','inline-block')
			var timer=setInterval(function(){
				top=parseInt($el.css('top'))
				if(top<=-100){
					clearInterval(timer)
					$el.css({'display':'none',
							  'top':0})
				}else{
					$el.css('top',top-20)
				}
			},100)
		}
	}
}