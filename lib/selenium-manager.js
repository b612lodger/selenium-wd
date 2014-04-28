'use strict';


var path = require('path');
var EventEmitter = require('events').EventEmitter;
var spawn = require('child_process').spawn;
var fs = require('fs');
var async = require('async');
require('colors');


/**
 * selenium server jar path.
 *
 * @constant
 * @private
 * @type {*|String}
 */
var DEFAULT_SELENIUM_JAR = path.resolve(__dirname, '../external-lib/selenium-server-standalone-2.41.0.jar');

/**
 * selenium internet explorer 32bit driver path.
 * @constant
 * @private
 * @type {*|String}
 */
var DEFAULT_IE32_DRIVER = path.resolve(__dirname, '../external-lib/IEDriverServer_Win32_2.41.0.exe');

/**
 * selenium internet explorer 64bit driver path.
 *
 * @constant
 * @private
 * @type {*|String}
 */
var DEFAULT_IE64_DRIVER = path.resolve(__dirname, '../external-lib/IEDriverServer_x64_2.41.0.exe');

/**
 * default selenium port
 *
 * @type {number}
 */
var DEFAULT_PORT = 4444;




/**
 * response events code and message.
 *
 * @private
 * @param code
 * @param message
 * @constructor
 */
function Response(code, message) {
	this.code = code;
	this.message = message;
}

/**
 * response events code and message.
 *
 * @constant
 * @type {{0: string, 1: string, 2: string}}
 */
var RESPONSES = {
	OK: new Response(0, 'selenium started ok.'),
	ERROR_JAVA_NOT_FOUND: new Response(1, 'failed to start selenium. java not found. system can not find java. ' +
		'selenium-manager needs java installed. if java already has been installed, please set java_home or' +
		'make sure java interpreter can be found in path environment.' +
		'alternatively you can pass java interpreter path when you initiate SeleniumManager object' +
		'ex) var seleniumManager = new SeleniumManager(\'usr/bin/java\');'),
	ERROR_PORT_UNAVAILABLE: new Response(2, 'failed to start selenium. port unavailable. ' +
		'the port you pass is taken by another process or selenium is already running.'),
	ERROR_DRIVER_NOT_FOUND: new Response(3, 'failed to start selenium. driver not found.'),
	ERROR_UNKNOWN: new Response(999, 'failed to start selenium. unknown error.')
};




/**
 * SeleniumManager constructor
 *
 * @param {string} javaPath it can be omitted. SeleniumManager will use java in javaPath supplies. if it is omitted, \
 * javahome or path environment will be used.
 * @param {boolean} verboseLog if set true, console out selenium server logs.
 * @constructor
 */
function SeleniumManager (javaPath, verboseLog) {
	if (!(this instanceof SeleniumManager)) {
		return new SeleniumManager(javaPath);
	}

	if (process.env.JAVA_HOME) {
		this._javaInterpreter = path.resolve(process.env.JAVA_HOME, 'bin/java');
	}

	this._verboseLog = verboseLog || false;
	this._javaInterpreter = javaPath || this._javaInterpreter;
}






/**
 * by default java interpreter will be executed by calling 'java' in command line.
 * SeleniumManager constructor can replace it.
 *
 * @private
 * @type {string}
 */
SeleniumManager.prototype._javaInterpreter = 'java';


/**
 * verbose log turn on flag
 *
 * @type {boolean}
 * @private
 */
SeleniumManager.prototype._verboseLog = false;


/**
 * Event Emitter
 *
 * @type {EventEmitter}
 */
SeleniumManager.prototype._emitter = null;




/**
 * start callback
 *
 * @callback startCallback
 * @param {Response} response
 */

/**
 * starts selenium server.
 *
 * @param {startCallback} callback
 * @param {{serverJar: string, port: number, ieDriver: string, useIE64: boolean}} option to be added when it starts selenium server
 */
SeleniumManager.prototype.start = function (callback, option) {
	option = option || {};
	var serverJar = option.serverJar || DEFAULT_SELENIUM_JAR;
	var ieDriver = option.ieDriver || (option.useIE64 ? DEFAULT_IE64_DRIVER : DEFAULT_IE32_DRIVER);
	var port = option.port || DEFAULT_PORT;

	async.map([serverJar, ieDriver], fs.stat, function (err) {
		if (err) {
			callback(RESPONSES.ERROR_DRIVER_NOT_FOUND);
			return;
		}

		this._commands.seleniumHub = spawn(this._javaInterpreter, ['-jar', serverJar, '-role', 'hub', '-port', port]);
		this._commands.seleniumNode = spawn(this._javaInterpreter, ['-jar', serverJar, '-role', 'node', '-hub', 'http://localhost:' + port, '-Dwebdriver.ie.driver=', '"' + ieDriver + '"']);
//		this._commands.phantomJsNode = spawn(this._javaInterpreter, ['-jar', serverJar, '-Dwebdriver.ie.driver=', '"' + ieDriver + '"', '-port', port]);
		for (var key in this._commands){
			if (this._commands.hasOwnProperty(key) && this._commands[key]) {
				this._commands[key].stdout.setEncoding('utf8');
				this._commands[key].stderr.setEncoding('utf8');
			}
		}

		var statuses = {hub: null, node: null, phantomjs: null};
		var emitter = new EventEmitter();
		var statusCallback = function (objectName, status) {
			console.log(objectName + ' : ' + JSON.stringify(status));
			if (status === RESPONSES.OK) {
				statuses[objectName] = true;
				if (statuses.hub && statuses.node) {
//				if (statuses.hub && statuses.node && statuses.phantomjs) {
					emitter.removeAllListeners();
					callback(status);
				}
			} else {
				this.stop();
				emitter.removeAllListeners();
				callback(status);
			}
		}.bind(this);
		emitter.on('status', statusCallback);

		this._commands.seleniumHub.stderr.on('data', makeMatchFunction('Started SocketConnector', emitter, 'status', 'hub', RESPONSES.OK));
		this._commands.seleniumHub.stderr.on('data', makeMatchFunction('Address already in use', emitter, 'status', 'hub', RESPONSES.ERROR_PORT_UNAVAILABLE));
		this._commands.seleniumHub.on('error', function (error) {
			if (error.code && error.code === 'ENOENT') {
				emitter.emit('status', 'hub', RESPONSES.ERROR_JAVA_NOT_FOUND);
			}
		});
		this._commands.seleniumNode.stdout.on('data', makeMatchFunction('Registering the node to hub', emitter, 'status', 'node', RESPONSES.OK));
		this._commands.seleniumNode.on('error', function (error) {
			if (error.code && error.code === 'ENOENT') {
				emitter.emit('status', 'node', RESPONSES.ERROR_JAVA_NOT_FOUND);
			}
		});

	}.bind(this));
};



function makeMatchFunction (matchString, emitter, eventName, objectName, status) {
	return function (data) {
//		console.log(data);
		if (data.indexOf(matchString) >= 0) {
			emitter.emit(eventName, objectName, status);
		}
	};
}


/**
 *
 * @type {{seleniumHub: null, seleniumNode: null, phantomJsNode: null}}
 * @private
 */
SeleniumManager.prototype._commands = {
	seleniumHub: null,
	seleniumNode: null,
	phantomJsNode: null
};




/**
 * stops selenium server immediately.
 *
 */
SeleniumManager.prototype.stop = function () {
	for (var key in this._commands){
		if (this._commands.hasOwnProperty(key) && this._commands[key]) {
			this._commands[key].kill();
		}
	}
};





module.exports.RESPONSE = RESPONSES;
module.exports.SeleniumManager = SeleniumManager;