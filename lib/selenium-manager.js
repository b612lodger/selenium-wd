'use strict';


var path = require('path');
var util = require('util');
var EventEmitter = require('events').EventEmitter;


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
 * system java interpreter path. SeleniumManager constructor will set this.
 *
 * @private
 * @type {string}
 */
SeleniumManager.prototype._javaInterpreter = 'java';






/**
 * response events code and message.
 *
 * @private
 * @param code
 * @param message
 * @constructor
 */
function Response(_code, _message) {
	this.code = _code;
	this.message = _message;
}

/**
 * response events code and message.
 *
 * @constant
 * @type {{0: string, 1: string, 2: string}}
 */
var RESPONSES = module.exports.RESPONSE = {
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
 * @constructor
 */
function SeleniumManager (javaPath) {
	EventEmitter.call(this);
	//TODO if javaPath is defined, use this as java interpreter.
	//TODO else if test javahome is set in environment, use this path to get java.
	//TODO else set java in path.
	throw new Error('Not implemented');
}
util.inherits(SeleniumManager, EventEmitter);





/**
 * This callback type is called `requestCallback` and is displayed as a global symbol.
 *
 * @callback startCallback
 * @param {Response} response
 */

/**
 * starts selenium server.
 *
 * @param {startCallback}
 * @param {{serverJar: string, port: number, ie32Driver: string, ie64Driver: string}} option to be added when it starts selenium server
 */
function start (callback, option) {
	//TODO build java -jar selenium command and start process.
	//TODO make process for that command
	//TODO then make callback result by parsing console messages from process.
	//TODO if nothing can be judged from console message, send unknown error.
	throw new Error('Not implemented');
}
SeleniumManager.prototype.start = start;




/**
 * stops selenium server immediately.
 */
function stop () {
	//TODO stops the selenium process
	throw new Error('Not implemented');
}
SeleniumManager.prototype.stop = stop;





module.exports.SeleniumManager = SeleniumManager;