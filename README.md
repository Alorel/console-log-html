A tiny library that overrides the browser's `console.*` functions allowing the logged messages to be displayed in HTML.

Usage:

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
console.log("foo"); //Logs to HTML
console.log("bar", true); // Logs to the console, but only if logToConsole is set to true
````

Demo: [https://alorel.github.io/console-log-html](https://alorel.github.io/console-log-html)

API documentation: [https://alorel.github.io/console-log-html/jsdoc](https://alorel.github.io/console-log-html/jsdoc)