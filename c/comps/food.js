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
	},
	created: function(){
		this.$http.get(cgis.queryFood.replace('{{start}}', 0).replace('{{count}}', 5)).then(function(res){
			console.log(res);
		}, function(err){
			console.log(err);
		})
	}
}