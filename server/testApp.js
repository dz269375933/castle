const castle = require('./castle');
const michelin = require('./michelin');
var starProperties = [];
var express=require('express');
var app=express();
var weekend={};
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:63342");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});
app.get('/properties',(request,response)=>{
        console.log("Send message……");
        var data={};
        data.properties=starProperties;
        data.startDay=weekend.saturday;
        response.send(JSON.stringify(data));
});
var server = app.listen(9001,function () {
    weekend={saturday:"2019-2-19"};
    var temp={name:"dz",addressLocality:"Dandong",price:"222.22",rating:5};
    for(var i=0;i<10;i++){
        starProperties.push(temp);
    }
    console.log("nodejs listen 9001 …… ");
});