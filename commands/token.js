/**
 * Created by arthur.oliveira on 2/15/16.
 */
var default_config = require('../config/default_config.json');
var require_config = require("../helper/config_validator");
var restify = require('restify');


var fs = require('fs');
var path = require('path');
var inquirer = require("inquirer");

module.exports = function (program) {
    program
        .command("token")
        .description("Run this command to refresh servicenow User Token")
        .action(function () {
            var config_path = path.join(process.cwd(), ".sn-config.json");

            require_config().then(function (config) {

                var auth = new Buffer(config.auth, 'base64').toString(),
                    parts = auth.split(':'),
                    user = parts[0],
                    pass = parts[1],
                    protocol = config.protocol


                var clientOptions = {
                    url: protocol + '://' + config.host+"/welcome.do"
                };

                var client = restify.createJsonClient(clientOptions);
                client.basicAuth(user, pass);

                client.get(clientOptions.url, function (err, req, res, obj) {
                    //console.log(res);
                    var regex = /var\s?g_ck\s\=\s?'(.*)';/g.exec(res.body);

                    if (regex) {

                        if (regex.length < 2) {
                            console.log('error')
                        } else {
                            config.token = regex[1];
                            fs.writeFile(config_path, JSON.stringify(config), function (err) {
                                if (err) {
                                    return console.log(err);
                                } else {
                                    console.log("Token updated successfully! ");
                                    console.log(config.token);
                                }
                            });
                        }

                    }
                });


            });
        });

    return program;
};
