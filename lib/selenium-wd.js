'use strict';



var SeleniumManager = require('./selenium-manager').SeleniumManager;
var wd = require('wd');



/**
 * SeleniumWD
 *
 * @param {{url: string, port: string, username: string, password: string}} remote
 * @param {{browserName: string, version: string, platform: string, tags: string[], name: string}[]} browsers
 * @constructor
 */
function SeleniumWD(remote, browsers) {
	//TODO store remote & browsers
	throw new Error('Not implemented');
}



/**
 * test callback
 *
 * @callback testCallback
 * @param {browser} browser browser param which will be passed to test callback function depends on driverProto
 */

/**
 * test done callback
 *
 * @callback doneCallback
 * @param {string} error message
 */

/**
 * start test
 *
 * @param {string} driverProto async, promise, or promiseChain.
 * @param {testCallback} test
 * @param {doneCallback} done
 */
SeleniumWD.prototype.startTest = function (driverProto, test, done) {
	//TODO if remote is local, start selenium-manager to launch selenium server locally.
	//TODO if remote aims to remote server bind test to it.
	//TODO when the test has done, callback
	throw new Error('Not implemented');
};


module.exports = SeleniumWD;