'use strict';

/**
 *
 * @type {Array}
 */
var browsers = [];

/**
 *
 * @param browser
 */
var test = function (browser) {};


/**
 * browser array with desired capabilities.
 * @param {{browserName: string, version: string, platform: string, tags: string[], name: string}[]} browsers
 * @returns {{setTest: setTest}}
 */
var setBrowsers = function (browsers) {
	//TODO store browsers
	throw new Error('Not implemented');
};


/**
 *
 * @param {callback} test
 * @returns {{startTest: startTest}}
 */
var setTest = function (test) {
	//TODO store test callback function
	throw new Error('Not implemented');
};


/**
 * start test
 * @param {{url: string, port: string, username: string, password: string}} remote
 * @param callback
 */
var startTest = function (remote, callback) {
	//TODO check remote.
	//TODO if remote is local, start selenium-manager to launch selenium server locally.
	//TODO if remote aims to remote server bind test to it.
	//TODO when the test has done, callback
	throw new Error('Not implemented');
};


module.exports = setBrowsers;