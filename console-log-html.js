/**
 * Console control namespace
 * @namespace
 */
var ConsoleLogHTML = (function (console, Object, TYPE_UNDEFINED, TYPE_BOOLEAN, INSTANCE_OBJECT_OBJECT) {
    'use strict';
    var original = {
            log: console.log,
            debug: console.debug,
            info: console.info,
            warn: console.warn,
            error: console.error
        },
        originalClear = console.clear,
        jQueryIsUp = typeof(jQuery) !== TYPE_UNDEFINED ? jQuery : false,
        extend = function () {
            var out = {},
                a = 0,
                k, keys;

            for (; a < arguments.length; a++) {
                keys = Object.keys(arguments[a]);
                for (k = 0; k < keys.length; k++) {
                    out[keys[k]] = arguments[a][keys[k]];
                }
            }

            return out;
        },
        register = function (method, target, options, includeTimestamp, logToConsole) {
            console[method] = function (msg, onlyConsole) {
                var finalMsg, li;

                if (typeof(onlyConsole) !== TYPE_BOOLEAN) {
                    onlyConsole = false;
                }
                if (!onlyConsole) {
                    finalMsg = msg.toString();
                    if (finalMsg === INSTANCE_OBJECT_OBJECT) {
                        try {
                            finalMsg = JSON.stringify(msg);
                        } catch (e) {

                        }
                    }
                    finalMsg = (includeTimestamp ? "[" + (new Date()).toLocaleTimeString() + "] " : "") + finalMsg;
                    li = document.createElement("li");
                    li.setAttribute("data-level", method);
                    li.innerText = finalMsg;
                    if (options[method]) {
                        li.classList.add(options[method]);
                    }
                    target.insertBefore(li, target.firstChild);
                }

                if (logToConsole && typeof(original[method]) !== TYPE_UNDEFINED) {
                    original[method].apply(console, [msg]);
                }
            };
        };

    return {
        /**
         * Default CSS classes
         * @type Object
         * @memberof ConsoleLogHTML
         * @prop {?string} error=text-danger The default CSS class for error messages
         * @prop {?string} warn=text-warning The default CSS class for warning messages
         * @prop {?string} info=text-success The default CSS class for info messages
         * @prop {?string} debug=text-info The default CSS class for debug messages
         * @prop {?string} log=null The default CSS class for log messages
         */
        DEFAULTS: {
            error: "text-danger",
            warn: "text-warning",
            info: "text-success",
            debug: "text-info",
            log: ""
        },
        /**
         * Disconnect our console overrides, reverting to the original state
         * @memberof ConsoleLogHTML
         */
        disconnect: function () {
            var keys = Object.keys(original);
            for (var i = 0; i < keys.length; i++) {
                if (typeof(original[keys[i]]) !== TYPE_UNDEFINED) {
                    console[keys[i]] = original[keys[i]];
                }
            }
            if (typeof(originalClear) !== TYPE_UNDEFINED) {
                console.clear = originalClear;
            }
        },
        /**
         * Overwrite the original console.* methods and start outputting to screen
         * @memberof ConsoleLogHTML
         * @param {$|jQuery|HTMLUListElement} target The target &lt;ul&gt; element to output to. Can can either be a jQuery
         * or vanilla JS HTMLUListElement.
         * @param {Object} [options=ConsoleLogHTML.DEFAULTS] CSS class options. See {@link ConsoleLogHTML.DEFAULTS} for default values.
         * @param {boolean} [includeTimestamp=true] Whether to include the log message timestamp in HTML
         * @param {boolean} [logToConsole=true] Whether to continue logging to the console as well as HTML.
         * @throws {Error} If target is not an &lt;ul&gt; element
         */
        connect: function (target, options, includeTimestamp, logToConsole) {
            if (jQueryIsUp && target instanceof jQueryIsUp) {
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
                options = extend(ConsoleLogHTML.DEFAULTS, options || {});
                var keys = Object.keys(original), i;

                for (i = 0; i < keys.length; i++) {
                    register(keys[i], target, options, includeTimestamp, logToConsole);
                }

                console.clear = function () {
                    target.innerText = "";
                    originalClear.apply(console);
                };
            }
        }
    };
})(console, Object, "undefined", "boolean", '[object Object]');

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") {
    module.exports = ConsoleLogHTML;
}