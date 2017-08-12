'use strict';

var $app = null;

function App() {
	return $app;
}
App.set = function(a) {
	$app = a;
}
module.exports = App;