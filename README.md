A tiny 1kB library that overrides the browser's `console.*` functions allowing the logged messages to be displayed in HTML. Requirements: **jQuery**.

Usage:

    <script>
    	ConsoleLogHTML.connect($("ul#myContainer"); // Redirect log messages
    	ConsoleLogHTML.disconnect(); // Stop redirecting
    </script>

You can also instruct the script to only log to the console by passing a second argument to `console.*()`, e.g.:

    <script>
    	console.log("foo"); //Logs to HTML
    	console.log("foo", true); // Logs to the console, but only if logToConsole is set to true
    </script>

Demo: [https://alorel.github.io/console-log-html](https://alorel.github.io/console-log-html)

Full documentation: [https://alorel.github.io/console-log-html/jsdoc](https://alorel.github.io/console-log-html/jsdoc)