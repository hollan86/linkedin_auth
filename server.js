//Install express server
const express = require('express');
const path = require('path');
var cors = require('cors')

const app = express();
//cors allow all
app.use(cors())

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/LIauth'));


app.get('/auth/callback', function(req,res){
    var querystring = require('querystring');
    var http = require('http');
    //var fs = require('fs');

    var client_id = '86npi10cn6zkzn';
    var client_secret = 'QMh1Xq6jVbU2Y494';
    //var code = req.query.code;
    console.log('Authorization code: ', req.query);
    var redirect_url = 'https%3A%2F%2Fhollan-linkedin.herokuapp.com%2Fauth%2Fcallback'
    var post_data = {
        'grant_type' : 'authorization_code',
        'code': req.query.code,
        'redirect_uri': redirect_url,
          'client_id' : client_id,
          'client_secret' : client_secret
    }

    var post_options = {
        host: 'www.linkedin.com',
        port: '80',
        path: '/oauth/v2/accessToken',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'//,
            //'Content-Length': Buffer.byteLength(post_data)
        }
    };

    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });

    // post the data
    post_req.write(querystring.stringify(post_data));
    post_req.end();


})

app.get('/*', function(req,res) {
    
    res.sendFile(path.join(__dirname+'/dist/LIauth/index.html'));
    });

// app.get('/access/callback', function(req,res){
//     console.log('access tokens: ',req.body);
// });

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);