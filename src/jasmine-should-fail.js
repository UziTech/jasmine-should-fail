"use strict";

(function (global) {

	if (!global.jasmine) {
		throw new Error("jasmine must be loaded before jasmine-should-fail");
	}

	function formatStack(expectResult) {
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

	global.zdescribe = function (description, specDefinitions) {
		var suite;
		if (jasmine.version) {
			suite = describe(description, specDefinitions);
			suite.children.forEach(function (spec) {
				if (!spec.shouldFail) {
					spec.shouldFail = true;
					spec.addExpectationResult = addShouldFailExpectationResult(spec, spec.addExpectationResult);
				}
			});
		} else if (process.env.JANKY_SHA1 || process.env.CI || global.headless) {
			suite = describe(description, function () {});
		} else {
			suite = describe(description, specDefinitions);
		}

		return suite;
	};

	global.zit = function (description, specDefinition) {
		var spec;
		if (jasmine.version) {
			spec = it(description, specDefinition);
			spec.shouldFail = true;
			spec.addExpectationResult = addShouldFailExpectationResult(spec, spec.addExpectationResult);
		} else if (process.env.JANKY_SHA1 || process.env.CI || global.headless) {
			spec = it(description, function () {});
		} else {
			spec = it(description, specDefinition);
		}
		return spec;
	};

})(typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
