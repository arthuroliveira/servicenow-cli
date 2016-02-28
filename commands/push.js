/**
 * Created by arthur.oliveira on 2/15/16.
 */
var inquirer = require("inquirer");
var require_config = require("../helper/config_validator");
var ServiceNow = require("../services/servicenow");
var service;

var fs = require('fs');
var path = require('path');


var service;
module.exports = function (program) {
    program
        .command("push")
        .description("Run this command to push files to ServiceNow")
        .usage('<file>')
        .option('-n, --new', 'Push as new database record')
        .action(function (file, options) {
            require_config().then(function (config) {
                service = ServiceNow(config);
                var file_path;

                if (path.isAbsolute(file)) {
                    file_path = file;
                } else {
                    file_path = path.join(process.cwd(), file);
                }

                fs.readFile(file_path, 'utf-8', function (err, data) {
                    if (err) throw err;


                    var folders = file_path.split(path.sep);
                    var root_folder = folders[folders.length - 2];
                    var filenameWithoutExtension = path.parse(folders[folders.length - 1]).name;

                    if (root_folder in config.folders) {

                        var db = {
                            table: config.folders[root_folder].table,
                            query: config.folders[root_folder].key + '=' + filenameWithoutExtension,
                            payload: {}
                        };

                        db.payload[config.folders[root_folder].field] = data;

                        var action;
                        if (options.new) {
                            action = service.insert;
                            db.payload = {
                                name : filenameWithoutExtension,
                                script : data
                            };
                        } else {
                            action = service.update;
                        }
                        action(db, function (err, data) {
                            if (err) {
                                throw(err);
                            } else if (data.records.length == 0) {
                                console.log("File doesn't exist. Use flag --new (-n) to create a new record");
                            } else {
                                if (options.new) {
                                    console.log("File created!")
                                } else {
                                    console.log("File updated!")
                                }
                            }
                        });

                    }
                });
            });
        });
};