'use strict';
var ConsoleLogHTML;
/**
 * @name ConsoleLogHTML
 * @namespace ConsoleLogHTML
 */
(function () {
    var original = {
            log: console.log,
            debug: console.debug,
            info: console.info,
            warn: console.warn,
            error: console.error
        },
        originalClear = console.clear,
        TYPE_UNDEFINED = "undefined",
        TYPE_BOOLEAN = "boolean",
        extend = function () {
            // Variables
            var extended = {},
                deep = false,
                i = 0,
                length = arguments.length;

            // Check if a deep merge
            if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
                deep = arguments[0];
                i++;
            }

            // Merge the object into the extended object
            var merge = function (obj) {
                
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

            // Loop through each object and conduct a merge
            for (; i < length; i++) {
                var obj = arguments[i];
                merge(obj);
            }

            return extended;

        };

    ConsoleLogHTML = {
        /**
         * The default CSS classes
         * @memberof ConsoleLogHTML
         * @prop {string} error The console.error() CSS class. Default: "text-danger"
         * @prop {string} warn The console.warn() CSS class. Default: "text-warning"
         * @prop {string} info The console.info() CSS class. Default: "text-success"
         * @prop {string} debug The console.debug() CSS class. Default: "text-info"
         * @prop {string} log The console.log() CSS class. Default: none
         * @type {Object}
         */
        DEFAULTS: {
            error: "text-danger",
            warn: "text-warning",
            info: "text-success",
            debug: "text-info",
            log: ""
        },
        /**
         * Overwrite the original console.* methods and start outputting to screen
         * @memberof ConsoleLogHTML
         * @param {*|jQuery|HTMLUListElement} target The target &lt;ul&gt; element to output to. Can can either be a jQuery
         * or vanilla JS HTMLUListElement.
         * @param {Object} [options=ConsoleLogHTML.DEFAULTS] CSS class options. See {@link ConsoleLogHTML.DEFAULTS} for default values.
         * @param {boolean} [includeTimestamp=true] Whether to include the log message timestamp in HTML
         * @param {boolean} [logToConsole=true] Whether to continue logging to the console as well as HTML.
         * @throws If target is not an &lt;ul&gt; element
         */
        connect: function (target, options, includeTimestamp, logToConsole) {
            if (target instanceof jQuery) {
                target = target[0];
            }
            if (typeof(logToConsole) !== TYPE_BOOLEAN) {
                logToConsole = true;
            }
            if (typeof(includeTimestamp) !== TYPE_BOOLEAN) {
                includeTimestamp = true;
            }
            if (!(target instanceof HTMLUListElement)) {
                throw new Error("The target must be a HTML <ul> element");
            } else {
                options = $.extend(ConsoleLogHTML.DEFAULTS, options || {});
                var keys = objectKeys(original);

                for (var i = 0; i < keys.length; i++) {
                    const method = keys[i];
                    console[method] = function (msg, onlyConsole) {
                        if (typeof(onlyConsole) !== TYPE_BOOLEAN) {
                            onlyConsole = false;
                        }
                        if (!onlyConsole) {
                            var finalMsg = msg.toString();
                            if (finalMsg === "[object Object]") {
                                try {
                                    finalMsg = jsonStringify(msg);
                                } catch (e) {

                                }
                            }
                            finalMsg = (includeTimestamp ? "[" + (new Date()).toLocaleTimeString() + "] " : "") + finalMsg;
                            target.prepend($("<li data-level='" + method + "' class='" + options[method] + "'/>")
                                .text(finalMsg)
                            );
                        }

                        if (logToConsole && typeof(original[method]) !== TYPE_UNDEFINED) {
                            original[method].apply(console, [msg]);
                        }
                    };
                }

                console.clear = function () {
                    target.find(">li").remove();
                    if (typeof(originalClear) !== TYPE_UNDEFINED) {
                        originalClear.apply(console);
                    }
                };
            }
        },
        /**
         * Return the console to its original state, without any overrides
         * @memberof ConsoleLogHTML
         */
        disconnect: function () {
            var keys = objectKeys(original);
            for (var i = 0; i < keys.length; i++) {
                if (typeof(original[keys[i]]) !== TYPE_UNDEFINED) {
                    console[keys[i]] = original[keys[i]];
                }
            }
            if (typeof(originalClear) !== TYPE_UNDEFINED) {
                console.clear = originalClear;
            }
        }
    };
})();