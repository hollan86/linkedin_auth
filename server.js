//Install express server
const express = require('express');
const path = require('path');
const url = require('url');

//Import configs
var config = require('./config.js');

//Parsing url
var myurl = url.parse(config.redirect_url);

const app = express();

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "*");
//     next();
//   });

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/LIauth'));


// LinkedIn Oauth2 callback end-point
app.get(myurl.pathname, function(req,res){
    var querystring = require('querystring');
    var http = require('https');
 
    var post_data = {
        'grant_type' : 'authorization_code',
        'code': req.query.code,
        'redirect_uri': myurl.href,
        'client_id' : config.client_id,
        'client_secret' : config.client_secret
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
                    "profile_data": profdata
                }
                //Redirect to profile page with profile data
                res.redirect(url.format({
                    pathname:"/profile",
                    query: alldata
                  }));
            });

            }).on("error", (err) => {
            console.log("Error: " + err.message);
            });
        })
    });

    // Retrieve access token
    post_req.write(querystring.stringify(post_data));
    post_req.end();


})

app.get('/*', function(req,res) {
    
    res.sendFile(path.join(__dirname+'/dist/LIauth/index.html'));
    });


// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);