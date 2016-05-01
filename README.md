A tiny 1kB library that overrides the browser's `console.*` functions allowing the logged messages to be displayed in HTML. Requirements: **jQuery**.

Usage:

    <script>
    	ConsoleLogHTML.connect($("ul#myContainer"); // Redirect log messages
    	ConsoleLogHTML.disconnect(); // Stop redirecting
    </script>

Demo: [https://alorel.github.io/console-log-html](https://alorel.github.io/console-log-html)

Full documentation: [https://alorel.github.io/console-log-html/jsdoc](https://alorel.github.io/console-log-html/jsdoc)