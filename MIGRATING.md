# 1.x to 2.0

A breaking change has been made to console.log, making it follow
[MDN's specification](https://developer.mozilla.org/en-US/docs/Web/API/Console/log).
Skipping HTML output is now available via the `skipHtml` property, e.g.:

```js
console.skipHtml.log("foo");
console.skipHtml.error("foo");
```