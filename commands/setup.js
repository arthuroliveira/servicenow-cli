/**
 * Created by arthur.oliveira on 2/15/16.
 */
var default_config = require('../config/default_config.json');

var fs = require('fs');
var path = require('path');
var inquirer = require("inquirer");

module.exports = function (program) {
    program
        .command("setup")
        .description("Run this command to create/update the HASH used on webservice")
        .action(function () {
            var config_path = path.join(process.cwd(), ".sn-config.json");
            var servicenow_config = default_config;

            // Check if config file exist inside current folder
            fs.lstat(config_path, function (err, stats) {
                if (err) {

                    console.log("Before we continue, please answer few questions");
                    var questions = [
                        {
                            type: "input",
                            name: "host",
                            message: "Enter servicenow instance url",
                        },
                        {
                            type: "input",
                            name: "username",
                            message: "Enter servicenow username",
                        },
                        {
                            type: "password",
                            message: "Enter your servicenow password",
                            name: "password"
                        },
                        {
                            type: "input",
                            message: "RestAPI Client Id:",
                            name: "client_id"
                        },
                        {
                            type: "password",
                            message: "RestAPI Client Secret:",
                            name: "client_secret"
                        }
                    ];
                    inquirer.prompt(questions, function (answers) {
                        // If file doesnt exist, create one with default_config as content
                        // update content based on answers
                        fs.writeFile(config_path, JSON.stringify(default_config), function (err) {
                            if (err) {
                                return console.log(err);
                            }
                            console.log("The config file was created!");
                            console.log("If you are using git, make sure to add .sn-config.json to gitignore");
                        });
                    });

                } else {
                    console.log('config file already exist!');
                }
            });
            process.stdin.pause();
        });

    return program;
};
