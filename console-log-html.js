/**
 * Console control namespace
 * @namespace ConsoleLogHTML
 */
var ConsoleLogHTML = {
    /**
     * Default CSS classes
     * @type Object
     * @prop {string} error=text-danger The default CSS class for error messages
     * @prop {string} warn=text-warning The default CSS class for warning messages
     * @prop {string} info=text-success The default CSS class for info messages
     * @prop {string} debug=text-info The default CSS class for debug messages
     * @prop {string} log="" The default CSS class for log messages
     */
    DEFAULTS: {
        error: "text-danger",
        warn: "text-warning",
        info: "text-success",
        debug: "text-info",
        log: ""
    },
    /**
     * Return the console to its original state, without any overrides
     * @function
     */
    disconnect: null,
    /**
     * Overwrite the original console.* methods and start outputting to screen
     * @function
     * @param {$|jQuery|HTMLUListElement} target The target &lt;ul&gt; element to output to. Can can either be a jQuery
     * or vanilla JS HTMLUListElement.
     * @param {Object} [options=ConsoleLogHTML.DEFAULTS] CSS class options. See {@link ConsoleLogHTML.DEFAULTS} for default values.
     * @param {boolean} [includeTimestamp=true] Whether to include the log message timestamp in HTML
     * @param {boolean} [logToConsole=true] Whether to continue logging to the console as well as HTML.
     * @throws {Error} If target is not an &lt;ul&gt; element
     */
    connect: null
};
var Foo = (function () {
    'use strict';
    var original = {
            log: console.log,
            debug: console.debug,
            info: console.info,
            warn: console.warn,
            error: console.error
        },
        originalClear = console.clear,
        extend = function () {
            // Variables
            var extended = {},
                deep = false,
                i = 0,
                merge = function (obj) {
                    for (var prop in obj) {
                        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                            // If deep merge and property is an object, merge properties
                            if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                                extended[prop] = extend(true, extended[prop], obj[prop]);
                            } else {
                                extended[prop] = obj[prop];
                            }
                        }
                    }
                };

            // Check if a deep merge
            if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
                deep = arguments[0];
                i++;
            }

            // Loop through each object and conduct a merge
            for (; i < arguments.length; i++) {
                var obj = arguments[i];
                merge(obj);
            }

            return extended;

        };

    ConsoleLogHTML.connect = function (target, options, includeTimestamp, logToConsole) {
        if (target instanceof jQuery) {
            target = target[0];
        }
        if (typeof(logToConsole) !== "boolean") {
            logToConsole = true;
        }
        if (typeof(includeTimestamp) !== "boolean") {
            includeTimestamp = true;
        }
        if (!(target instanceof HTMLUListElement)) {
            throw new Error("The target must be a HTML <ul> element");
        } else {
            options = extend(ConsoleLogHTML.DEFAULTS, options || {});
            /**
             * Our object keys
             * @type {string[]}
             */
            var keys = Object.keys(original),
                /**
                 * The li item we'll be appending
                 * @type {HTMLLIElement}
                 */
                li,
                /**
                 * The message we'll be appending
                 * @type {string}
                 */
                finalMsg;

            for (var i = 0; i < keys.length; i++) {
                const method = keys[i];
                console[method] = function (msg, onlyConsole) {
                    if (typeof(onlyConsole) !== "boolean") {
                        onlyConsole = false;
                    }
                    if (!onlyConsole) {
                        finalMsg = msg.toString();
                        if (finalMsg === "[object Object]") {
                            try {
                                finalMsg = JSON.stringify(msg);
                            } catch (e) {

                            }
                        }
                        finalMsg = (includeTimestamp ? "[" + (new Date()).toLocaleTimeString() + "] " : "") + finalMsg;
                        //noinspection JSValidateTypes
                        li = document.createElement("li");
                        li.innerText = finalMsg;
                        li.classList.add(options[method]);
                        li.setAttribute("data-level", method);
                        target.insertBefore(li, target.firstChild);
                    }

                    if (logToConsole && typeof(original[method]) !== "undefined") {
                        original[method].apply(console, [msg]);
                    }
                };
            }

            console.clear = function () {
                target.innerText = "";
            };
        }
    };
    ConsoleLogHTML.disconnect = function () {
        var keys = Object.keys(original);
        for (var i = 0; i < keys.length; i++) {
            if (typeof(original[keys[i]]) !== "undefined") {
                console[keys[i]] = original[keys[i]];
            }
        }
        if (typeof(originalClear) !== "undefined") {
            console.clear = originalClear;
        }
    }

    return ConsoleLogHTML;
})();