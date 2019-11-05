[![Build Status](https://travis-ci.org/UziTech/jasmine-should-fail.svg?branch=master)](https://travis-ci.org/UziTech/jasmine-should-fail)
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/77kivvkdn0py6455/branch/master?svg=true)](https://ci.appveyor.com/project/UziTech/jasmine-should-fail)

# jasmine-should-fail

This adds two methods to jasmine `zdescribe` and `zit`

These methods will fail if they pass and pass if they fail.

This will also add a shouldFail property to the specs that are supposed to fail so a reporter can still output the message when they pass.

This is really only useful when testing a reporter or matcher.
