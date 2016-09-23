/* global describe, it, expect, console, $, ConsoleLogHTML */

"use strict";

var TARGET_UL = document.createElement("ul");

describe("Initial setup", function () {
    it("Target ul exists", function () {
        expect(TARGET_UL.nodeName).toBe("UL");
    });
    it("Target ul empty", function () {
        expect(TARGET_UL).toBeEmpty();
    });
});

describe("Test logging", function () {
    ConsoleLogHTML.connect(TARGET_UL);
    var text = "sample_log",
        pat = /\[[^\]]+]\ssample_log/g,
        levels = Object.keys(ConsoleLogHTML.DEFAULTS),
        li;

    it("Method calls", function () {
        console.clear();
        expect(TARGET_UL).toBeEmpty();

        for (var i = 0; i < levels.length; i++) {
            console[levels[i]](text);
            li = TARGET_UL.firstElementChild;
            expect(li.nodeName).toBe("LI");
            expect(1).toBe(li.innerText.match(pat).length);
            expect(li.className).toBe(ConsoleLogHTML.DEFAULTS[levels[i]]);
            expect(TARGET_UL.children.length).toBe(i + 1);

            expect(console.skipHtml[levels[i]]).toBeDefined();
        }
    });
});

describe("Test clear", function () {
    it("clear", function () {
        console.debug("clear");
        expect(TARGET_UL).not.toBeEmpty();
        console.clear();
        expect(TARGET_UL).toBeEmpty();
    });
});

describe("Test Disconnect", function () {
    it("resets skipHtml", function () {
        expect(console.skipHtml).toBeDefined();

        ConsoleLogHTML.disconnect();

        expect(console.skipHtml).toBeUndefined(); // prove that `skipHtml` is being reset
    });
});

describe("Test no timestamp option", function () {
    it("Disconnect", function () {
        console.clear();
        expect(TARGET_UL).toBeEmpty();
        ConsoleLogHTML.disconnect();
        console.debug("Disconnect");
        expect(TARGET_UL).toBeEmpty();
    });

    it("Reconnect", function () {
        ConsoleLogHTML.connect(TARGET_UL, undefined, false);
        expect(TARGET_UL).toBeEmpty();
        console.debug("Reconnect");
        expect(TARGET_UL).not.toBeEmpty();
        expect(TARGET_UL.firstElementChild.innerText).toBe("Reconnect");
    });
});

describe("Test append at bottom option", function () {
    it("on", function () {
        ConsoleLogHTML.connect(TARGET_UL, undefined, false, undefined, true);
        console.clear();

        console.debug("Entry 1");
        console.debug("Entry 2");

        expect(TARGET_UL.children.length).toBe(2);
        expect(TARGET_UL.children[0].innerText).toBe("Entry 1");
        expect(TARGET_UL.children[1].innerText).toBe("Entry 2");
    });
    it("off (default)", function () {
        ConsoleLogHTML.connect(TARGET_UL, undefined, false, undefined, undefined /*default=false */);
        console.clear();

        console.debug("Entry 1");
        console.debug("Entry 2");

        expect(TARGET_UL.children.length).toBe(2);
        expect(TARGET_UL.children[0].innerText).toBe("Entry 2");
        expect(TARGET_UL.children[1].innerText).toBe("Entry 1");
    });
});

describe("Test skipHtml", function () {
    it("onlyToConsole", function () {
        console.clear();
        console.debug("skipHtml 1");
        expect(TARGET_UL).not.toBeEmpty();
        console.clear();
        expect(TARGET_UL).toBeEmpty();
        console.skipHtml.debug("skipHtml 2");
        expect(TARGET_UL).toBeEmpty();
    });
});

describe("Test Obj", function () {
    it("formats to JSON", function () {
        var testObj = {foo: "bar"};

        console.debug(testObj);

        var expected = "Object " + JSON.stringify(testObj);
        expect(TARGET_UL.firstElementChild.innerText).toBe(expected);
    });

    it("test nonJsonable", function () {
        var Clazz = function () {
            this.foo = "bar";
        };
        Clazz.prototype = {
            toJSON: function () {
                throw new Error("nope");
            }
        };
        var inst = new Clazz();

        console.debug(inst);
        expect(TARGET_UL.firstElementChild.innerText).toBe(inst.toString());

        Clazz.prototype.toJSON = function () {
            return {};
        };
        inst = new Clazz();
        console.debug(inst);
        var expected = "Object " + JSON.stringify(inst);
        expect(TARGET_UL.firstElementChild.innerText).toBe(expected);
    });

    it("with custom toString()", function () {
        var testObj = {
            toString: function () {
                return "my custom toString() impl";
            }
        };

        console.debug(testObj);

        var expected = "my custom toString() impl";
        expect(TARGET_UL.firstElementChild.innerText).toBe(expected);
    });
});

describe("Test multiple arguments", function () {
    it("concatenates all arguments", function () {
        console.debug("str", 42, true);

        var expected = "str 42 true";
        expect(TARGET_UL.firstElementChild.innerText).toBe(expected);
    });

    it("formats all objects to JSON", function () {
        var testObj1 = {foo: "1"};
        var testObj2 = {foo: "2"};

        console.debug(testObj1, testObj2);

        var expected = "Object " + JSON.stringify(testObj1) + " Object " + JSON.stringify(testObj2);
        expect(TARGET_UL.firstElementChild.innerText).toBe(expected);
    });
});

describe("Test special values", function () {
    it("formats null to string", function () {
        console.debug(null);

        expect(TARGET_UL.firstElementChild.innerText).toBe("null");
    });

    it("formats undefined to string", function () {
        console.debug(undefined);

        expect(TARGET_UL.firstElementChild.innerText).toBe("undefined");
    });
});

describe("Connect jQuery", function () {
    it("Disconnect", function () {
        console.clear();
        ConsoleLogHTML.disconnect();
        expect(TARGET_UL).toBeEmpty();
        console.debug("Disconnect");
        expect(TARGET_UL).toBeEmpty();
    });

    it("Reconnect", function () {
        ConsoleLogHTML.connect($(TARGET_UL), null, false);
        expect(TARGET_UL).toBeEmpty();
        console.debug("Reconnect");
        expect(TARGET_UL).not.toBeEmpty();
        expect(TARGET_UL.firstElementChild.innerText).toBe("Reconnect");
    });
});

describe("Test connect invalid", function () {
    it("", function () {
        expect(function () {
            ConsoleLogHTML.connect(document.createElement("div"));
        }).toThrow(new Error("The target must be a HTML <ul> element"));
    });
});

describe("Test extender", function () {
    it("", function () {
        ConsoleLogHTML.disconnect();
        ConsoleLogHTML.connect(TARGET_UL, {
            error: "foo"
        });
        console.error("xtfoo");
        expect(TARGET_UL.firstElementChild.className).toBe("foo");


        ConsoleLogHTML.disconnect();
        ConsoleLogHTML.connect(TARGET_UL, {
            error: "foo"
        });
    });
});

//Should be last
describe("Test disconnect", function () {
    it("DC", function () {
        console.debug("DC1");
        expect(TARGET_UL).not.toBeEmpty();
        console.clear();
        ConsoleLogHTML.disconnect();
        expect(TARGET_UL).toBeEmpty();
        console.debug("DC2");
        expect(TARGET_UL).toBeEmpty();
    });
});