var mysql = require('mysql');
/////
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var Crypto = require('crypto');

var con = mysql.createConnection({
    host: "35.227.146.173",
    database: "cmpt470",
    user: "readonlyuser",
    password: "readonly"
})

con.connect(function(err){
    if(err) throw err;
    console.log("Node connected to mysql server");
})

//////////////////////try
var app = express();

//let Express know we'll be using some of its packages
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//display login.html
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/login.html'))
});

app.post('/', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    //hash md5
    var hashedPassword = Crypto.createHash('md5').update(password).digest('hex');
    if(username && password) {
        con.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, hashedPassword], function(error, results, fields) {
            if(results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                //username and password match, redirect to the uploadCSV page
                response.redirect('/uploadCSV');
            }
            else {        
                response.redirect('/');       
            }
            response.end();
        });
    }
    else {
        response.send('Please enter Username and Password!');
		response.end();
    }
});

/*
app.get('/uploadCSV', function(request, response) {
    response.sendFile(path.join(__dirname + '/uploadCSV.html'))
});
*/


app.get('/uploadCSV', function(request, response) {
    
	if (request.session.loggedin) {
        //response.send('Welcome back, ' + request.session.username + '!');
        response.sendFile(path.join(__dirname + '/uploadCSV.html'))
    } 
    else {
        //response.send('Please login to view this page!');
        response.redirect('/');
    }
    
	//response.end();
});


app.get('/histogram', function(request, response) {
    response.sendFile(path.join(__dirname + '/histogram.html'))
});

app.get('/logout', function(request, response) {
    // Destroy session data
    //request.logout();
	request.session.destroy();
	// Redirect to login page
	response.redirect('/');
});

app.listen(8080);