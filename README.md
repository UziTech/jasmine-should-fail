[![Actions Status](https://github.com/UziTech/jasmine-should-fail/workflows/CI/badge.svg)](https://github.com/UziTech/jasmine-should-fail/actions)

# jasmine-should-fail

This adds two methods to jasmine `zdescribe` and `zit`

These methods will fail if they pass and pass if they fail.

This will also add a shouldFail property to the specs that are supposed to fail so a reporter can still output the message when they pass.

This is really only useful when testing a reporter or matcher.
