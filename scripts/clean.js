if (typeof(process.argv[2]) !== "undefined") {
    var fs = require('fs'),
        numDeletedFiles = 0;
    var deleteFolderRecursive = function (path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file) {
                var curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                    numDeletedFiles++;
                }
            });
            fs.rmdirSync(path);
        }
    };

    deleteFolderRecursive(process.argv[2]);
    console.info("Deleted directory " + process.argv[2] + " and the  " + numDeletedFiles + " files it contained");
} else {
    throw new Error("The desstination dir is not provided");
}