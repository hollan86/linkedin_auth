//Install express server
const express = require('express');
const path = require('path');
var cors = require('cors')
const url = require('url');

const app = express();
//cors allow all
//app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  });

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/LIauth'));


app.get('/auth/callback', function(req,res){
    console.log('Checking call back: ',req.query)
    var querystring = require('querystring');
    var http = require('https');
    //var fs = require('fs');

    var client_id = '86npi10cn6zkzn';
    var client_secret = 'QMh1Xq6jVbU2Y494';
    //var code = req.query.code;
    //console.log('Authorization code: ', req.query);
    var redirect_url = 'https://hollan-linkedin.herokuapp.com/auth/callback'
    var post_data = {
        'grant_type' : 'authorization_code',
        'code': req.query.code,
        'redirect_uri': redirect_url,
        'client_id' : client_id,
        'client_secret' : client_secret
    }

    var post_options = {
        host: 'www.linkedin.com',
        path: '/oauth/v2/accessToken',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(querystring.stringify(post_data))
        }
    };

    // Set up the request
    var post_req = http.request(post_options, function(resdata) {
        var data = '';
        resdata.setEncoding('utf8');
        resdata.on('data', function (chunk) {
            data += chunk;
        });

        resdata.on('end', () => {
            console.log('Data: ',data)
            var data_parsed = JSON.parse(data);
            http.get('https://api.linkedin.com/v2/me',
            {
                headers: {
                    //'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + data_parsed.access_token,
                    'Connection': 'keep-alive'
                }
            }
            ,(resp) => {
            let profdata = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                profdata += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                var alldata = {
                    "access_token": data_parsed.access_token,
                    "expires_in": data_parsed.expires_in,
                    "profile_data": JSON.parse(profdata)
                }
                //console.log(JSON.parse(data).explanation);
                res.redirect(url.format({
                    pathname:"/profile",
                    query: alldata
                  }));
                //res.json(JSON.parse(profdata));
            });

            }).on("error", (err) => {
            console.log("Error: " + err.message);
            });
            // res.json(JSON.parse(data));
            // res.redirect(url.format({
            //     pathname:"/profile",
            //     query: JSON.parse(data)
            //   }));
        })
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