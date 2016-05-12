var fs = require('fs'),
    browser = encodeURIComponent(fs.readdirSync("coverage")[0]);

fs.writeFile("coverage/index.html", '<!DOCTYPE html>\
        <html>\
            <head>\
                <title>Coverage</title>\
                <META http-equiv="refresh" content="0;URL=' + browser + '">\
            </head>\
            <body>\
            <a href="' + browser + '">Click here if you haven\'t been redirected</a>\
            </body>\
        </html>');