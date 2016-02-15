#!/usr/bin/env node
var program = require('commander');
var co = require('co');
var prompt = require('co-prompt');
var Client = require('node-rest-client').Client;
var fs = require('fs');
var path = require('path');



program
    .version('0.0.1')
    .command('ls')
    .description("List files")
    .action(function () {
        console.log('ls');
    });

program
    .command("setup")
    .description("Run this command to create/update the HASH used on webservice")
    .action(function () {
        co(function *() {
            var first = yield prompt('Host: ');
            var last = yield prompt('Username: ');
            var password = yield prompt.password("Password: ");


            var client = restify.createJsonClient({
                url: "https://aoliveira1.service-now.com"
            });
            client.basicAuth(user, pass);
            client.get('/', function (err, req, res, obj) {
                console.log(res);
            });
            // request
            // 	.post('https://api.bitbucket.org/2.0/snippets/')
            // 	.auth(username, password)
            // 	.attach('file', filename, file)
            // 	.set('Accept', 'application/json')
            // 	.end(function (err, res) {
            // 		if (err) {
            // 			console.error(err);
            // 		} else if (!res.ok) {
            // 			console.error(res.text);
            // 		} else {
            // 			console.log(res.body.links.html.href);
            // 		}
            // 	});
            process.stdin.pause();
        })();
    });


program
    .command("pull")
    .description("Run this command to pull uipages, uiscript, stylesheets and uimacros from servicenow")
    .action(function () {
        co(function *() {

            process.stdin.pause();
        })();
    })

program
    .command("test-rest")
    .description("Run this command to create/update the HASH used on webservice")
    .action(function () {
        co(function *() {
            var client = new Client();

            var username = yield prompt('Username: ');
            var password = yield prompt.password("Password: ");

            var args = {
                parameters: {
                    grant_type: "password",
                    client_id: "dd91abb1d06952001c186e0fc473f04f",
                    client_secret: "test",
                    username: username,
                    password: password
                },
                headers: {"Content-Type": "application/x-www-form-urlencoded"}
            };

            client.post("https://aoliveira1.service-now.com/oauth_token.do", args, function (data, response) {
                console.log(data);
            });


            process.stdin.pause();
        })();
    });

program
    .command("test")
    .description("Run this command to create/update the HASH used on webservice")
    .action(function () {
        var config_path = path.join(__dirname, ".sn-config.json");
        var default_config = require('./default_config.json');

        console.log(default_config);

        co(function *() {

            var servicenow_config = {
                test: "test"
            }

            fs.lstat(config_path, function (err, stats) {
                if (err) {
                    fs.writeFile(config_path, JSON.stringify(servicenow_config), function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("The file was saved!");
                    });
                } else {
                    console.log('config file already exist, load and update if needed')
                }
            });


            //process.stdin.pause();
        })();
    });

program.parse(process.argv);

