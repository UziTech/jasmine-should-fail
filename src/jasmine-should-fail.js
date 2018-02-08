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
		stack = stack.filter(function (line) { return !/at Spec\.addExpectationResult .*jasmine-should-fail/.test(line); });
		expectResult.stack = stack.join("\n");
	}

	function addShouldFailExpectationResult(spec, addExpectationResult) {
		return function (passed, data, isError) {
			addExpectationResult.call(spec, !passed, data, passed);
			spec.result.failedExpectations.forEach(function (expectResult) { formatStack(expectResult); });
			spec.result.passedExpectations.forEach(function (expectResult) { formatStack(expectResult); });
		};
	}

	global.zdescribe = function () {
		var suite;
		if (jasmine.version) {
			suite = describe.apply(this, arguments);
			suite.shouldFail = true;
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
