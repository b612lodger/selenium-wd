/* globals describe, it */
'use strict';

var expect = expect || require('expect.js');


describe('SeleniumManager', function () {
	var SeleniumManager = require('../lib/selenium-manager').SeleniumManager;
	var RESPONSE = require('../lib/selenium-manager').RESPONSE;
	var seleniumManager;

	describe('initializer', function () {
		it('should have proper java interpreter path', function (done) {
			var exec = require('child_process').exec;
			seleniumManager = new SeleniumManager(null, true);
			exec(seleniumManager._javaInterpreter + ' -version', function (error, stdout, stderr) {
				var out = stdout || stderr;
				expect(error).to.not.be.ok();
				expect(out).to.contain('version');
				done();
			});
		});
	});

	describe('start & stop functions', function () {
		it('with proper options should start and callback with response ok', function (done) {
			seleniumManager = new SeleniumManager(null, true);
			seleniumManager.start(function (response) {
				expect(response).to.eql(RESPONSE.OK);
				seleniumManager.stop();
				done();
			});
		});


		it('with wrong java option should fail with response fail', function (done) {
			seleniumManager = new SeleniumManager('/wrongpath/java', true);
			seleniumManager.start(function (response) {
				expect(response).to.eql(RESPONSE.ERROR_JAVA_NOT_FOUND);
				done();
			});
		});

		it('with wrong selenium option (port number) should fail with response fail ', function (done) {
			require('http').createServer().listen(8123);

			seleniumManager = new SeleniumManager(null, true);
			seleniumManager.start(function (response) {
				expect(response).to.eql(RESPONSE.ERROR_PORT_UNAVAILABLE);
				done();
			}, {port: 8123}); //set port number in use.
		});

		it('with wrong selenium option (seleniumJar) should fail with response fail', function (done) {
			seleniumManager = new SeleniumManager(null, true);
			seleniumManager.start(function (response) {
				expect(response).to.eql(RESPONSE.ERROR_DRIVER_NOT_FOUND);
				done();
			}, {serverJar: '/wrongpath/selenium.jar'});
		});

		it('with wrong selenium option (ieDriver) should fail with response fail', function (done) {
			seleniumManager = new SeleniumManager(null, true);
			seleniumManager.start(function (response) {
				expect(response).to.eql(RESPONSE.ERROR_DRIVER_NOT_FOUND);
				done();
			}, {ieDriver: '/wrongpath/iedriver32.exe'});
		});

		it('with wrong selenium option (seleniumJar + ieDriver) should fail with response fail', function (done) {
			seleniumManager = new SeleniumManager(null, true);
			seleniumManager.start(function (response) {
				expect(response).to.eql(RESPONSE.ERROR_DRIVER_NOT_FOUND);
				done();
			}, {serverJar: '/wrongpath/selenium.jar', ieDriver: '/wrongpath/iedriver32.exe'});
		});
	});
});