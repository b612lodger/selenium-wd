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
	var port = option.port || 4444;

	async.map([serverJar, ieDriver], fs.stat, function (err) {
		if (err) {
			callback(RESPONSES.ERROR_DRIVER_NOT_FOUND);
			return;
		}

		this._emitter = new EventEmitter();
		this._emitter.once('start', function (result) {
			callback(result);
		});

		this._command = spawn(this._javaInterpreter, ['-jar', serverJar, '-Dwebdriver.ie.driver=', '"' + ieDriver + '"', '-port', port]);
		this._command.stdout.setEncoding('utf8');
		this._command.stdout.on('data', this._commandStdOut.bind(this));
		this._command.stderr.setEncoding('utf8');
		this._command.stderr.on('data', this._commandStdErr.bind(this));
		this._command.on('close', this._commandClose.bind(this));
		this._command.on('error', this._commandError.bind(this));
	}.bind(this));
};


/**
 *
 * @type {null}
 * @private
 */
SeleniumManager.prototype._command = null;


/**
 *
 * @param data
 * @private
 */
SeleniumManager.prototype._commandStdOut = function (data) {
	if (this._verboseLog) {
		console.log(data.green);
	}
	if (data.indexOf('Started org.openqa.jetty.jetty.Server') >= 0) {
		this._emitter.emit('start', RESPONSES.OK);
	}
};

/**
 *
 * @param data
 * @private
 */
SeleniumManager.prototype._commandStdErr = function (data) {
	if (this._verboseLog) {
		console.error(data.red);
	}
	if (data.indexOf('Selenium is already running on port') >= 0) {
		this._emitter.emit('start', RESPONSES.ERROR_PORT_UNAVAILABLE);
	}
	if (data.indexOf('Unable to access jarfile') >= 0) {
		this._emitter.emit('start', RESPONSES.ERROR_DRIVER_NOT_FOUND);
	}
};

/**
 *
 * @param error
 * @private
 */
SeleniumManager.prototype._commandError = function (error) {
	if (this._verboseLog) {
		console.error(error);
	}
	if (error.code && error.code === 'ENOENT') {
		this._emitter.emit('start', RESPONSES.ERROR_JAVA_NOT_FOUND);
	}
};

/**
 *
 * @param code
 * @private
 */
SeleniumManager.prototype._commandClose = function (code) {
	if (this._verboseLog) {
		console.log('selenium exits with : ' + code);
	}
};



/**
 * stops selenium server immediately.
 *
 */
SeleniumManager.prototype.stop = function () {
	this._command.kill();
};



module.exports.RESPONSE = RESPONSES;
module.exports.SeleniumManager = SeleniumManager;