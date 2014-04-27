/* globals describe, it */
'use strict';

var expect = expect || require('expect.js');


describe('SeleniumWD', function () {
	var SeleniumWD = require('../lib/selenium-wd');
	describe('startTest()', function () {
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
			}, function () {
				done();
			});
		});
	});
});