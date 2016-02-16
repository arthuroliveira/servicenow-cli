/**
 * Created by arthur.oliveira on 2/15/16.
 */
var fs = require('fs');
var path = require('path');
var config_path = path.join(process.cwd(), ".sn-config.json");


module.exports = function (callback) {
    // Check if config file exist inside current folder
    fs.lstat(config_path, function (err, stats) {
        if (err) {
            console.log("Please make sure to run setup command first");
        } else {
            fs.readFile(config_path, 'utf8', function (err, data) {
                if (err) {
                    console.log(err)
                } else {
                    callback(JSON.parse(data));
                }
            });
        }
    });
};

