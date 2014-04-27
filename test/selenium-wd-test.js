/* globals describe, it */
'use strict';

var expect = expect || require('expect.js');


describe('SeleniumWD', function () {
	var SeleniumWD = require('../lib/selenium-wd');
	describe('startTest()', function () {

		it('should start local selenium if SeleniumWD is initialized with localhost remote', function (done) {
			var seleniumWd = new SeleniumWD({url: 'localhost'}, [{browserName: 'safari'}]);
			seleniumWd.startTest('async', function (browser) {
				browser.quit();
			}, function (err) {
				expect(err).to.not.be.ok();
			});
			done();
		});


		it('should call test callback and browser should not be null', function (done) {
			var seleniumWd = new SeleniumWD();
			seleniumWd.startTest('async', function (browser) {
				expect(browser).to.be.ok();
				expect(browser).to.have.property('get');
				expect(browser).to.have.property('title');
				browser.quit();
				done();
			}, null);
		});

		it('should call done callback when test has been finished', function (done) {
			var seleniumWd = new SeleniumWD();
			seleniumWd.startTest('async', function (browser) {
				browser.quit();
			}, function (err) {
				done();
			});
		});
	});
});