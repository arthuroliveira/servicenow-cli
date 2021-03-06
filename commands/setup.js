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

            var questions = [
                {
                    type: "input",
                    name: "host",
                    message: "Enter servicenow instance name (\<instance\>.service-now.com). "
                },
                {
                    type: "input",
                    name: "project_prefix",
                    message: "Enter your project prefix (e.g. ProjectName__). "
                },
                {
                    type: "input",
                    name: "username",
                    message: "Enter servicenow username. "
                },
                {
                    type: "password",
                    message: "Enter your servicenow password. ",
                    name: "password"
                }
            ];
            inquirer.prompt(questions, function (answers) {
                var hash = new Buffer(answers.username + ':' + answers.password).toString('base64');

                servicenow_config.auth = hash;
                servicenow_config.host = answers.host+".service-now.com";
                servicenow_config.project_prefix = answers.project_prefix;


                fs.writeFile(config_path, JSON.stringify(servicenow_config), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The config file was created!");
                    console.log("If you are using git, make sure to add .sn-config.json to gitignore");
                });
            });

            //process.stdin.pause();
        });

    return program;
};
