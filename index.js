#!/usr/bin/env node
var co = require('co');
var prompt = require('co-prompt');
var Client = require('node-rest-client').Client;


var program = require('commander');

require('./commands')(program);


program
    .command('ls')
    .description("List files")
    .action(function () {
        console.log('ls');
    });

program
    .command("setuppppp")
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
    .version('0.0.1')
    .parse(process.argv);

