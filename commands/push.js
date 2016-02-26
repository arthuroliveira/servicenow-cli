/**
 * Created by arthur.oliveira on 2/15/16.
 */
var inquirer = require("inquirer");
var require_config = require("../helper/config_validator");
var ServiceNow = require("../services/servicenow");

var fs = require('fs');
var path = require('path');


var service;
module.exports = function (program) {
    program
        .command("push")
        .description("Run this command to push files to ServiceNow")
        .usage('<file>')
        .action(function (file) {
            require_config().then(function (config) {
                var file_path;
                if (file[0] == "/") {
                    file_path = file;
                } else {
                    file_path = path.join(process.cwd(), file);
                }

                fs.readFile(file_path,  'utf-8',function (err, data) {
                    if (err) throw err;
                    console.log(data);



                });
            });
        });
};