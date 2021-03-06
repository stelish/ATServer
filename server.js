/**
 *
 *
**/
// connection ports and addresses
var SERVER_PORT = 80;
var REDIS_HOST = 'localhost';


var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var https = require('https');

var app = express(); // the main app
var path = require('path');
var fs         = require("fs");
var Promise = require('promise');


    var key_file   = "server/certs/server.key";
    var cert_file  = "server/certs/server.crt";

    var config     = {
        key: fs.readFileSync(key_file),
        cert: fs.readFileSync(cert_file)
    };

//CORS middleware
    var allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', 'http://localhost');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        next();
    };

    app.use(allowCrossDomain);


// body parser
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// redis interface
var redis = require('redis');
var client = redis.createClient('6379',REDIS_HOST); //creates a new client

// Redis Configuration
client.on('connect', function() {
    console.log('redis connected');
});

// Express Routes
/**
 * Get's Main Admin Dashboard Page
 * Used to enable short request to /admin
 */
app.route('/admin')
    .get(function(req, res) {
        console.log('Accessing the admin section ...');
        console.log(app.path());
        res.type('.html');
        res.sendFile(path.join(__dirname + '/views/admin/ATServerAdmin.html'));
    });
/**
 * Serves API
 *
 * GETS:
 * getAllSessions (returns [] of all sessions)
 * getCurrentSession {returns {} of current session}
 *
 * POSTS:
 * addSessions([] of sessions) {returns [] of all sessions}
 * addVote(session) {returns session}
 *
 */
app.route('/api/:call')
    .get(function(req, res) {
        console.log('API GET request: '+req.params.call);

        switch( req.params.call ){
            case 'getDashboardTotals':
                client.multi()
                    .get('totalPassed')
                    .get('totalFailed')
                    .get('totalScreenshots')
                    .smembers('passHistory')
                    .smembers('failHistory')
                    .smembers('testDurations')
                    .exec(function(err,results){
                        if(err){
                            console.log(err);
                        }

                        // get duration avg
                        var durHistory = results[5];
                        var durTotal = 0;
                        for(var i=0; i < durHistory.length; i++){
                            var obj = JSON.parse(durHistory[i]);
                            durTotal += new Number(obj["duration"]);
                        }
                        var averagedDuration = durTotal / durHistory.length;

                        // set return obj
                        var totals = {
                            'totalPassed' : results[0],
                            'totalFailed' : results[1],
                            'totalScreenshots' : results[2],
                            'passHistory' : JSON.stringify(results[3]),
                            'failHistory' : JSON.stringify(results[4]),
                            'durationHistory' : JSON.stringify(results[5]),
                            'durationAverage' : averagedDuration.toFixed(2),
                            'totalTestTime' : durTotal.toFixed(2)
                        };

                        res.send(totals);
                    });
                break;
        /**
         * Gets latest result data for dash board, and formats it as follows:
         *
         * {
            "componentName" : "layout",
            "status" : "failed",
            "failedExpectations" : [
            ],
            "passedExpectations" : [
            ]
           }
         */
            case 'getDashBoardData':
                client.smembers("type:suite", function (err,obj) {
                    if(err){
                        console.log('got error: '+err);
                    }
                    //console.log('got obj: '+obj);
                    console.log('obj type is : '+typeof obj);
                    var keys = [];
                    if(obj && obj.length > 0){

                        Promise.all(obj.map(function(suite){
                            console.log('suite type is : '+typeof suite);
                            console.log('suite is '+suite);
                            suite = JSON.parse(suite);
                            // quick way to check for match
                            var stringifiedKeys = JSON.stringify(keys);
                            if(stringifiedKeys.indexOf(suite.id) != -1){
                                // contains so iterate
                                for(var i=0; i < keys.length; i++){
                                    if(keys[i].id == suite.id){
                                        // check date is later then existing
                                        if(keys[i].time < suite.time){
                                            keys[i] = suite;
                                        }
                                    }
                                }
                            }else{
                                // does not contain suite so add it
                                console.log('pushing suite');
                                keys.push(suite);
                            }
                        }))
                        .then(function(res){
                                console.log('keys is '+JSON.stringify(keys));

                        });
                    }
                    res.send( JSON.stringify(keys) );
                });
                break;

            case 'getAllReports':
                client.smembers("type:reports", function (err, obj) {
                    var result = [];
                    if(obj && obj.length > 0){

                        // parse data
                        for(var i = 0; i < obj.length; i++){
                            var report = JSON.parse( obj[i] );

                            result.push(report);
                        }
                    }
                    res.send( result );
                });
                break;
        /**
         * NOTE:
         * Thie method will return the session that start time <= server time,
         * AND ent time > server time + offset hours
         */

            case 'getCurrentSession':
                client.smembers("type:suite", function (err, obj) {
                    var result = [];
                    if(obj && obj.length > 0){
                        // parse data
                        for(var i = 0; i < obj.length; i++){
                            var sess = JSON.parse( obj[i] );
                            var _startTime = new Date(sess.startTime);
                            var _endTime = new Date(sess.endTime);
                            var _voteEndTime = new Date(sess.voteEndTime);
                            var _dealStartTime = new Date(sess.dealStartTime);
                            var _serverTime = new Date();
                            console.log('startTime time is '+_startTime.toDateString());
                            console.log('endTime time is '+_endTime.toDateString());
                            console.log('server time is '+_serverTime.toDateString());
                            if(_startTime < _serverTime && _endTime > _serverTime){
                                // set deal status
                                sess.live = _endTime > _serverTime;
                                sess.status = 'VOTING';
                                // check vote end
                                if(_voteEndTime < _serverTime){
                                    sess.status = 'VOTING_END';
                                }
                                // check deal start
                                if(_dealStartTime < _serverTime){
                                    sess.status = 'DEAL_START';
                                }
                                console.log('server time is '+_serverTime.toDateString());
                                result = sess;
                                break;
                            }else{
                                console.log('no current session');
                            }
                        }
                    }

                    res.send( result );
                });
                break;
            case 'getVotesForSession' :
                var response = [];
                var sessionid = req.query.id;
                console.log(sessionid);
                console.log("type:votes:"+sessionid+':origin1');
                client.multi()
                    .get("type:votes:"+sessionid+':origin1')
                    .get("type:votes:"+sessionid+':origin2')
                    .exec(function(err,replies){
                        if(err){
                            console.log("err="+err);
                        }
                        console.log('reply is '+replies);
                        res.send( replies );
                    });
                break;
            case 'getGraphData':
                client.smembers("type:session", function (err, result) {
                    if(result && result.length > 0){
                        graphdata = [];
                        tempdata = [];
                        var multi = client.multi();
                        // parse data
                        for(var i = 0; i < result.length; i++){
                            var sess = JSON.parse( result[i] );
                            // get origin1 votes
                            multi.get("type:votes:"+sess.id+':origin1');
                            multi.get("type:votes:"+sess.id+':origin2');
                        }
                        multi.exec(function(err,replies){
                            if(err){
                                console.log("err="+err);
                            }
                            var returningArray = [];
                            var incr = 0;

                            for(var n=0; n < result.length; n++){
                                var resObj = JSON.parse(result[n]);
                                resObj.origin1VoteCount = replies[incr];
                                incr++;
                                resObj.origin2VoteCount = replies[incr];
                                incr++;
                                returningArray.push(resObj);
                            }
                            setTimeout(function(){
                                res.send(returningArray);
                            },0);
                        });
                    }
                });
                break;
            case 'getServerTime':
                var serverDate = new Date().toDateString();
                var serverTime = new Date().toTimeString();
                res.send(serverDate + ' - ' + serverTime);
                break;
            default :
                res.end();
                break;
        }
    })
    .post(function(req, res) {
        console.log('API POST request: '+req.params.call);
        switch( req.params.call ){
            case 'addReport':
                console.log('sessionid is '+req.body.id);
                // session data
                var session_obj = {
                    "id" : req.body.id,
                    "date" : req.body.destination
                };
                console.log(session_obj.id);
                var session_arr = [
                    "type:session",JSON.stringify(session_obj)
                ];

                client.sadd(session_arr, function (err, res) {
                    if(err){
                        console.log(err);
                    }
                    if(res){
                        console.log('added: '+res);
                    }
                });
                res.send(200);
                res.end();
                break;
            case 'removeSession':
                var session = {};

                client.smembers("type:session", function (err, result) {
                    if (result && result.length > 0) {
                        for(var i=0; i < result.length; i++ ){
                            var obj = JSON.parse(result[i]);
                            console.log('----------------------------');
                            console.log(obj.id);
                            console.log(req.body.id);
                            console.log('----------------------------');
                            if(obj.id == req.body.id){
                                console.log('got match');
                                session = result[i];
                                break;
                            }
                        }

                        console.log('removeSession called: '+session);
                        var arr = [
                            "type:session",session
                        ];
                        var responseCode = 200;
                        client.srem(arr, function (err, res) {
                            if(err){
                                console.log(err);
                                responseCode = 503;
                            }
                            if(res){
                                console.log('removed: '+res);
                            }
                        });
                        console.log('end of removeSession method');
                        res.sendStatus(responseCode);
                    }
                });


                break;
            default :
                res.end();
                break;
        }
    })
    .put(function(req, res) {
        res.send('this is a put');
    });

/**
 * Serves everything else
 */
app.route('/*')
    .get(function(req, res) {
        res.sendFile(path.join(__dirname + '/views/'+req.params[0]));
    });

// Bind to port
http.createServer(app).listen(SERVER_PORT);
https.createServer(config,app).listen(443);


