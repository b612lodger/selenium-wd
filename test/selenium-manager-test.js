/* globals describe, it */
'use strict';

var expect = expect || require('expect.js');

describe('SeleniumManager', function () {
	var SeleniumManager = require('../lib/selenium-manager').SeleniumManager;
	var RESPONSE = require('../lib/selenium-manager').RESPONSE;
	describe('start method', function () {
		it('should start and emit started event with proper options', function (done) {
			var seleniumManager = new SeleniumManager();
			seleniumManager.start(function (response) {
				expect(response).to.eql(RESPONSE.OK);

				seleniumManager.stop();
				done();
			});
		});

		it('should fail and emit startFail event with wrong java option', function (done) {
			var seleniumManager = new SeleniumManager('/wrongpath/java');
			seleniumManager.start(function (response) {
				expect(response).to.eql(RESPONSE.ERROR_JAVA_NOT_FOUND);
				done();
			});
		});

		it('should fail and emit startFail event with wrong selenium option (port number)', function (done) {
			require('http').createServer().listen(8123);

			var seleniumManager = new SeleniumManager();
			seleniumManager.start(function (response) {
				expect(response).to.eql(RESPONSE.ERROR_PORT_UNAVAILABLE);
				done();
			}, {port: 8123}); //set port number in use.
		});

		it('should fail and emit startFail event with wrong selenium option (seleniumJar)', function (done) {
			var seleniumManager = new SeleniumManager();
			seleniumManager.start(function (response) {
				expect(response).to.eql(RESPONSE.ERROR_DRIVER_NOT_FOUND);
				done();
			}, {serverJar: '/wrongpath/selenium.jar'});
		});

		it('should fail and emit startFail event with wrong selenium option (ie32Driver)', function (done) {
			var seleniumManager = new SeleniumManager();
			seleniumManager.start(function (response) {
				expect(response).to.eql(RESPONSE.ERROR_DRIVER_NOT_FOUND);
				done();
			}, {ie32Driver: '/wrongpath/iedriver32.exe'});
		});

		it('should fail and emit startFail event with wrong selenium option (ie64Driver)', function (done) {
			var seleniumManager = new SeleniumManager();
			seleniumManager.start(function (response) {
				expect(response).to.eql(RESPONSE.ERROR_DRIVER_NOT_FOUND);
				done();
			}, {ie64Driver: '/wrongpath/iedriver64.exe'});
		});
	});
});