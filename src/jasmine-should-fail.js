"use strict";

(function (global) {

	if (!global.jasmine) {
		throw new Error("jasmine must be loaded before jasmine-should-fail");
	}

	function formatStack(expectResult) {
		if (!expectResult.stack) {
			return expectResult.stack;
		}
		var stack = expectResult.stack.split("\n");
		stack = stack.filter(function (line) { return !/at (Spec|Suite)\.addExpectationResult .*jasmine-should-fail/.test(line); });
		expectResult.stack = stack.join("\n");
	}

	function addShouldFailExpectationResult(specOrSuite, addExpectationResult) {
		if (!specOrSuite.result.failedExpectations) {
			specOrSuite.result.failedExpectations = [];
		}
		if (!specOrSuite.result.passedExpectations) {
			specOrSuite.result.passedExpectations = [];
		}
		return function () {
			var failedExpectationsLength = specOrSuite.result.failedExpectations.length;
			var passedExpectationsLength = specOrSuite.result.passedExpectations.length;

			addExpectationResult.apply(specOrSuite, arguments);

			var expectationResults;
			if (specOrSuite.result.failedExpectations.length > failedExpectationsLength) {
				expectationResults = specOrSuite.result.failedExpectations.splice(failedExpectationsLength);
				expectationResults.forEach(function (expectationResult) {
					formatStack(expectationResult);
					specOrSuite.result.passedExpectations.push(expectationResult);
				});
			} else if (specOrSuite.result.passedExpectations.length > passedExpectationsLength) {
				expectationResults = specOrSuite.result.passedExpectations.splice(passedExpectationsLength);
				expectationResults.forEach(function (expectationResult) {
					formatStack(expectationResult);
					specOrSuite.result.failedExpectations.push(expectationResult);
				});
			}
		};
	}

	global.zdescribe = function () {
		var suite;
		if (jasmine.version) {
			suite = describe.apply(this, arguments);
			suite.shouldFail = true;
			suite.addExpectationResult = addShouldFailExpectationResult(suite, suite.addExpectationResult);
			suite.children.forEach(function (spec) {
				if (!spec.shouldFail) {
					spec.shouldFail = true;
					spec.addExpectationResult = addShouldFailExpectationResult(spec, spec.addExpectationResult);
				}
			});
		} else if (process.env.JANKY_SHA1 || process.env.CI || global.headless) {
			var args = [];
			for (var i = 0; i < arguments.length; i++) {
				if (i === 1) {
					args.push(function () {});
				} else {
					args.push(arguments[i]);
				}
			}
			suite = describe.apply(this, args);
		} else {
			suite = describe.apply(this, arguments);
		}

		return suite;
	};

	global.zit = function () {
		var spec;
		if (jasmine.version) {
			spec = it.apply(this, arguments);
			spec.shouldFail = true;
			spec.addExpectationResult = addShouldFailExpectationResult(spec, spec.addExpectationResult);
		} else if (process.env.JANKY_SHA1 || process.env.CI || global.headless) {
			var args = [];
			for (var i = 0; i < arguments.length; i++) {
				if (i === 1) {
					args.push(function () {});
				} else {
					args.push(arguments[i]);
				}
			}
			spec = it.apply(this, args);
		} else {
			spec = it.apply(this, arguments);
		}
		return spec;
	};

})(typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
