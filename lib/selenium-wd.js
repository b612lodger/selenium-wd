'use strict';


/**
 *
 * @param {Array} browsers
 * @constructor
 */
function SeleniumWD(browsers) {
	//TODO store browsers
	throw new Error('Not implemented');
}



/**
 * browser array with desired capabilities.
 * @param {{browserName: string, version: string, platform: string, tags: string[], name: string}[]} browsers
 * @returns {{setTest: setTest}}
 */
SeleniumWD.prototype.setBrowser = function (browsers) {
	//TODO store browsers
	throw new Error('Not implemented');
};



/**
 *
 * @param {callback} test
 * @returns {{startTest: startTest}}
 */
SeleniumWD.prototype.setTest = function (test) {
	//TODO store test callback function
	throw new Error('Not implemented');
};


/**
 * start test
 * @param {{url: string, port: string, username: string, password: string}} remote
 * @param callback
 */
SeleniumWD.prototype.startTest = function (remote, callback) {
	//TODO check remote.
	//TODO if remote is local, start selenium-manager to launch selenium server locally.
	//TODO if remote aims to remote server bind test to it.
	//TODO when the test has done, callback
	throw new Error('Not implemented');
};


module.exports = SeleniumWD;