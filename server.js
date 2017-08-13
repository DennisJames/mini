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
app.use(express.static(path.join(__dirname, 'release')))
/**
 * proxy
 */
app.use('/cgi-bin', proxy({target: 'http://115.159.200.162', changeOrigin: true}));
/**
 *  server and port
 **/
var port = process.env.PORT || 8998
app.listen(port, function () {
    console.log('Server is listen on port', port)
})