'use strict';

var express = require('express');
var path = require('path');
var app = express();
var proxy = require("http-proxy-middleware");

var compression = require('compression')
app.use(compression())
/**
 *  static folder
 **/
app.use(express.static(path.join(__dirname, 'release')));
/**
 * proxy
 */
app.use('/cgi-bin', proxy({target: 'http://115.159.200.162', changeOrigin: true}));
/**
 * router
 */
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
router.post('/', function(req, res){
	var _tmp = 'release/tmp';
	fs.exists(_tmp, function(exist){
		if(!exist) fs.mkdirSync(_tmp);
	})
	var form = new formidable.IncomingForm();
	form.uploadDir = _tmp;
	form.parse(req, function(err, data, files) {
	    if (err) throw err;
	    var tmp_path = files.file.path;
	    data.filetype = files.file.type.split('/')[0];
	    var time = new Date().getTime();
	    data.filename = time + '.' + files.file.name.split('.').pop();
	    var new_path = 'release/.static/' + data.filetype + '/';
	    fs.exists(new_path, function(exist) {
	        if (!exist) {
	            fs.mkdirSync(new_path);
	        }
	    });
        var new_name = new_path + data.filename;
        fs.renameSync(tmp_path, new_name);
        res.end(JSON.stringify({path: '/' + new_name.replace('release/', '')}));
	});
});
app.use('/upload-pic', router);
/**
 *  server and port
 **/
var port = process.env.PORT || 8998
app.listen(port, function () {
    console.log('Server is listen on port', port)
})