var noop = function(){}
module.exports = function(url, method, param, cb){
	if(!method || !~['get', 'post'].indexOf(method)){
		throw new Error("wrong method!");
	}
	if(typeof param == "function"){
		cb = param;
		param = '';
	}
	if(typeof cb != "function"){
		cb = noop;
	}
	if(method == "get"){
		Vue.http.get(url, param).then(function(res){
			if(res.ok && res.body){
				cb(null, res.body);
			} else{
				cb(new Error(res.statusText));				
			}
		}, function(err){
			cb(err);
		})
	}
}