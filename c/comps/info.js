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