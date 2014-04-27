/* globals describe, it */
'use strict';

var expect = expect || require('expect.js');

describe('SeleniumManager', function () {
	var SeleniumManager = require('../lib/selenium-manager').SeleniumManager;
	var RESPONSE = require('../lib/selenium-manager').RESPONSE;
	var seleniumManager;
	describe('start & stop functions', function () {
		it('with proper options should start and callback with response ok', function (done) {
			seleniumManager = new SeleniumManager();
			seleniumManager.start(function (response) {
				expect(response).to.eql(RESPONSE.OK);
				done();
			});
		});

		it('should stop and callback', function (done) {
			seleniumManager.stop(function () {
				done();
			});
		});

		it('with wrong java option should fail with response fail', function (done) {
			seleniumManager = new SeleniumManager('/wrongpath/java');
			seleniumManager.start(function (response) {
				expect(response).to.eql(RESPONSE.ERROR_JAVA_NOT_FOUND);
				done();
			});
		});

		it('with wrong selenium option (port number) should fail with response fail ', function (done) {
			require('http').createServer().listen(8123);

			seleniumManager = new SeleniumManager();
			seleniumManager.start(function (response) {
				expect(response).to.eql(RESPONSE.ERROR_PORT_UNAVAILABLE);
				done();
			}, {port: 8123}); //set port number in use.
		});

		it('with wrong selenium option (seleniumJar) should fail with response fail', function (done) {
			seleniumManager = new SeleniumManager();
			seleniumManager.start(function (response) {
				expect(response).to.eql(RESPONSE.ERROR_DRIVER_NOT_FOUND);
				done();
			}, {serverJar: '/wrongpath/selenium.jar'});
		});

		it('with wrong selenium option (ie32Driver) should fail with response fail', function (done) {
			seleniumManager = new SeleniumManager();
			seleniumManager.start(function (response) {
				expect(response).to.eql(RESPONSE.ERROR_DRIVER_NOT_FOUND);
				done();
			}, {ie32Driver: '/wrongpath/iedriver32.exe'});
		});

		it('with wrong selenium option (ie64Driver) should fail with response fail', function (done) {
			seleniumManager = new SeleniumManager();
			seleniumManager.start(function (response) {
				expect(response).to.eql(RESPONSE.ERROR_DRIVER_NOT_FOUND);
				done();
			}, {ie64Driver: '/wrongpath/iedriver64.exe'});
		});
	});
});