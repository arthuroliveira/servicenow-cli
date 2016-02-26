/**
 * Created by arthur.oliveira on 2/15/16.
 */
var fs = require('fs');
var express = require('express');
var restify = require('restify');
var require_config = require("../helper/config_validator");


module.exports = function (program) {
    program
        .command("runserver")
        .usage('<port>')
        .description("Run this command to run server (default port 3000)")
        .action(function (port) {
            if (typeof port === "object")
                port = 3000;

            var app = express();

            app.get('/api/*', function (req, res) {
                require_config().then(function (config) {

                    var auth = new Buffer(config.auth, 'base64').toString(),
                        parts = auth.split(':'),
                        user = parts[0],
                        pass = parts[1],
                        protocol = config.protocol


                    var clientOptions = {
                        url: protocol + '://' + config.host
                    };

                    try {
                        var client = restify.createJsonClient(clientOptions);
                        client.basicAuth(user, pass);
                    } catch (err) {
                        console.log('Some error happend', err);
                    }

                    client.get(req.url, function (err, api_req, api_res, obj) {
                        res.send(api_res.body);
                    });

                });

            });

            app.use(express.static('dist'));

            app.listen(port, function () {
                console.log('App listening on port ' + port + '!');
            });

            process.on('uncaughtException', function (err) {
                if (err.errno === 'EADDRINUSE')
                    console.log("Port "+port+" already in use.");
                else
                    trow(err);
                process.exit(1);
            });


        });

    return program;
};
