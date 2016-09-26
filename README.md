A tiny library that overrides the browser's `console.*` functions allowing the logged messages to be displayed in HTML.

[![Coverage Status](https://coveralls.io/repos/github/Alorel/console-log-html/badge.svg?branch=master)](https://coveralls.io/github/Alorel/console-log-html?branch=master)
[![Build Status](https://travis-ci.org/Alorel/console-log-html.svg?branch=master)](https://travis-ci.org/Alorel/console-log-html)
[![Deps](https://david-dm.org/alorel/console-log-html.svg)](https://david-dm.org/alorel/console-log-html#info=dependencies&view=list)
[![Deps](https://david-dm.org/alorel/console-log-html/dev-status.svg)](https://david-dm.org/alorel/console-log-html#info=devDependencies&view=list)


[![NPM](https://nodei.co/npm/console-log-html.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/console-log-html)

Migrating from `1.x` to `2.0`? See [MIGRATING.md](https://github.com/Alorel/console-log-html/blob/master/MIGRATING.md)

# Installation:

Simply include the file on your page:
```html
<script type="application/javascript" src="console-log-html.min.js"></script>
<!-- Or, alternatively, use the CDN URL -->
<script type="application/javascript" src="//cdn.rawgit.com/Alorel/console-log-html/master/console-log-html.min.js"></script>
```

It can also be included as a dependency from [npm](https://www.npmjs.com/package/console-log-html):
```
npm install console-log-html --save
```
```javascript
(function(){ // Your closure
    var ConsoleLogHTML = require('console-log-html');
})();
```

# Usage:

```html
    <ul id="myULContainer"></ul> <!-- I will hold the log messages -->
    <script type="application/javascript" src="console-log-html.min.js"></script>
    <script>
        ConsoleLogHTML.connect(document.getElementById("myULContainer")); // Redirect log messages
        ConsoleLogHTML.disconnect(); // Stop redirecting
    </script>
```

You can also instruct the script to only log to the console by passing a second argument to `console.*()`, e.g.:

```javascript
console.log("foo"); // Logs "foo" to HTML
console.log("Look, some JSON:", {foo: 'bar'}); // Logs "Look, some JSON: Object {"foo":"bar"}" to HTML
console.skipHtml.log("bar"); // Logs only to the console
```

## Customisation

### Default styles
The default css classes can be overriden in `ConsoleLogHTML.DEFAULTS`:

```javascript
    ConsoleLogHTML.DEFAULTS.error = "some-error-css-class"; // Will be applied to console.error()
    ConsoleLogHTML.DEFAULTS.log = "another-override"; // Will be applied to console.log()
```

### During connect()

The connect method has the following signature:
```javascript
function connect(target, options, includeTimestamp, logToConsole){}
```

   - `target` has already been covered - it's the &lt;ul&gt; element
   - `options` allows you to override the css classes in `ConsoleLogHTML.DEFAULTS` for the duration of the `connect`, i.e. it
   would not save the values. For example, if you wanted to override the `log` and `warn` CSS classes you could pass the object

   ```json
   {
        "warn": "my-warn-css-class",
        "log": "my-log-css-class"
   }
   ```
   - `includeTimestamp` - when set to `true` (the default value), a timestamp will be prepended to each message as it
   appears in the &lt;ul&gt;. The timestamp's format depends on the user as it is created via

   ```javascript
   (new Date()).toLocaleTimeString()
   ```
   - `logToConsole` - when set to `true` (the default value), appear both in the console *and* the &lt;ul&gt;; when set
   to `false`, they appear only in the &lt;ul&gt;.
   - `appendAtBottom` - when set to `true` (default=`false`), log messages will be appended at the end of the &lt;ul&gt;-list.

----------

More information:

   - [Demo](https://alorel.github.io/console-log-html)
   - [API documentation](https://alorel.github.io/console-log-html/jsdoc)
   - [Test coverage](https://coveralls.io/github/Alorel/console-log-html?branch=master)