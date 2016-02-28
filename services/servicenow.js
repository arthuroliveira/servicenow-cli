/**
 * Created by arthur.oliveira on 2/15/16.
 */
var restify = require('restify');
var url = require('url');
var util = require('util');

module.exports = function table(config) {
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


    this.tableName = "";

    function validateResponse(err, req, res, obj, request) {

        // consider moving low level debug to high level debug (end user as below)
        //logResponse(err, req, res, obj, request);

        var help = '';
        // special failing case (connections blocked etc.)
        if (!res && err) {

            var errorList = {
                'ECONNREFUSED': 'Missing interent connection or connection was refused!',
                'ENOTFOUND': 'No connection available (do we have internet?)',
                'ETIMEDOUT': 'Connection timed out. Internet down?'
            };

            help = errorList[err.code] || 'Something failed badly.. internet connection rubbish?';
            help += util.format('\ndetails: %j', err);
            return new Error(help);
        }

        // standard responses
        if (res.statusCode !== 200) {

            if (res.statusCode === 401) {
                help = 'Check credentials.';
            } else if (res.statusCode === 302) {
                help = 'Verify JSON Web Service plugin is activated.';
            }

            var message = util.format('%s - %s', res.statusCode, http.STATUS_CODES[res.statusCode]);
            if (help) {
                message += ' - ' + help;
            }
            if (err) {
                message += util.format('\ndetails: %j', err);
            }
            return new Error(message);
        }
        if (err) {
            return err;
        }
        if (obj.error) {
            console.log('ERROR found in obj.error : ', obj.error);
            // DP TODO : Investigate: Error: json object is null
            return new Error(obj.error);
            // this is actually not an error! It's just that the server didn't return anything to us
            //return null;
        }
        if (!obj.records) {
            return new Error(util.format('Response missing "records" key: %j\nCheck server logs.', obj));
        }
        return null;
    }

    function send(request) {
        var maxRecords = request.rows || 1;
        var urlObj = {
            pathname: '/' + request.table + '.do',
            query: {
                // DP@SNC change : JSONv2 not JSON (Eureka+)
                JSONv2: '',
                sysparm_record_count: maxRecords,
                sysparm_action: request.action
            }
        };

        if (request.parmName) {
            urlObj.query['sysparm_' + request.parmName] = request.parmValue;
        }

        var path = url.format(urlObj);

        function handleResponse(err, req, res, obj) {
            err = validateResponse(err, req, res, obj, request);
            request.callback(err, obj);
        }

        // we may have some connection issues with TCP resets (ECONNRESET). Lets debug them further.
        try {
            if (request.postObj) {
                client.post(path, request.postObj, handleResponse);
            } else {
                client.get(path, handleResponse);
            }
        } catch (err) {
            console.log('Some connection error happend...', err);
            // fail hard!
            process.exit(1);
        }
    }

    this.getRecords = function(query, callback) {
        var parms = {
            table: this.tableName,
            action: 'getRecords',
            parmName: 'query',
            parmValue: query,
            rows: 1,
            callback: callback
        };
        if (query.query) {
            parms.parmValue = query.query;
            // ensures that tables that are extended are still restricted to 1 table
            parms.parmValue += "^sys_class_name=" + this.tableName;
        }
        if (query.rows) {
            parms.rows = query.rows;
        }
        if (query.sys_id) {
            parms.parmName = 'sys_id';
            parms.parmValue = query.sys_id;
        }

        send(parms);
    };

    this.get = function(id, callback) {
        send({
            table: this.tableName,
            action: 'get',
            parmName: 'sys_id',
            parmValue: id,
            callback: callback
        });
    };

    this.insert = function(query, callback) {
        //send({table: this.tableName, action: 'insert', postObj: obj, callback: callback});

        var parms = {
            table: query.table || this.tableName,
            action: 'insert',
            postObj: query.payload,
            callback: callback
        };

        send(parms);
    };

    /**
     * Update an instance record
     * @param query {object} - contains query data
     * @param callback {function}
     */
    this.update = function(query, callback) {
        var parms = {
            table: query.table || this.tableName,
            action: 'update',
            parmName: 'query',
            parmValue: query.query,
            postObj: query.payload,
            callback: callback
        };

        // sys_id based updates
        if (query.sys_id) {
            parms.parmName = 'sys_id';
            parms.parmValue = query.sys_id;
        }
        send(parms);
    };

    return this;
};