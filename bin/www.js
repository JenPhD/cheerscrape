#!/usr/bin/env node


// Express can launch a www executable to handle certain tasks.
// www goes in bin (sometimes .bin to keep it hidden)

// This way, we can set certain properties here
// rather than having them take up space in server.js.
//Dependencies
var app = require('../server');
var debug = require('debug')('cheerscrape:server');
var http = require('http');

//get port from env, store in express app
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//create http server
var server = http.createServer(app);

//Listen on port, all network interfaces
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

//Normalize a port into a number, string, or false
function normalizePort(val) {
	var port = parseInt(val, 10);

	// Named pipe
	if (isNaN(port))
		return val;

	// Port number
	if (port >= 0)
		return port;

	return false;
}

//Event listener for http server 'error' event
function onError(error) {
	if (error.syscall !== 'listen')
		throw error;

	var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

	// Friendly messages for specific listener errors
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

//Event listener for http server 'listening' event
function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	debug('Listening on ' + bind);
}
