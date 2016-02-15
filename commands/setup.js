/**
 * Created by arthur.oliveira on 2/15/16.
 */
var default_config = require('../config/default_config.json');

var fs = require('fs');
var path = require('path');
var co = require('co');

module.exports = function (program) {
    program
        .command("setup")
        .description("Run this command to create/update the HASH used on webservice")
        .action(function () {
            var config_path = path.join(process.cwd(), ".sn-config.json");
            var servicenow_config = default_config;
            co(function *() {

                // Check if config file exist inside current folder
                fs.lstat(config_path, function (err, stats) {
                    if (err) {

                        console.log("Before we continue, please answer few questions");
                        var host = yield prompt('Host: ');
                        var username = yield prompt('Username: ');
                        var password = yield prompt.password("Password (we dont save it!): ");
                        var client_id = yield prompt.password("RestAPI Client Id: ");
                        var client_secret = yield prompt.password("RestAPI Client Secret(We wont save it!): ");



                        // If file doesnt exist, create one with default_config as content
                        fs.writeFile(config_path, JSON.stringify(default_config), function (err) {
                            if (err) {
                                return console.log(err);
                            }
                            console.log("The config file was created!");
                            console.log("If you are using git, make sure to add .sn-config.json to gitignore");
                        });
                    } else {
                        console.log('config file already exist!');
                    }
                });
                process.stdin.pause();
            })();
        });

    return program;
};
