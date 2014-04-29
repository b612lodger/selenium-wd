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
			seleniumManager = new SeleniumManager();
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
			seleniumManager = new SeleniumManager();
			seleniumManager.start(function (response) {
				expect(response).to.eql(RESPONSE.OK);
				seleniumManager.stop();
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
	});

	describe('integration with wd', function(){
		it('should work ok', function(done){
			var wd = require('wd');

			seleniumManager = new SeleniumManager();
			seleniumManager.start(function (response) {
				expect(response).to.eql(RESPONSE.OK);

				var b = wd.promiseRemote();

				b.on('status', function(info){console.log('[36m%s[0m', info);});b.on('command', function(meth, path, data){  console.log(' > [33m%s[0m: %s', meth, path, data || '');});
				b.init({
					browserName:'phantomjs'
				})
				.then(function () { return b.get("http://dalekjs.com/pages/getStarted.html"); })
				.then(function () { return b.get("http://www.naver.com"); })
				.then(function () { return b.get("http://www.daum.net"); })
				.then(function () { return b.get("http://www.google.com"); })
				.fin(function () {
					b.quit();
					seleniumManager.stop();
					done();
				}).done();
			});
		});
	});
});