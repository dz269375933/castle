const file_path = "../data/data.json";
var fs = require('fs');
var cheerio = require('cheerio');
var querystring = require('querystring');
var actions = [];
var get_data = [];
var https = require('https');
var mongo = require('./mongoDB')
var count = 1;
var insertCount=1;
const bingMapKey='Atslwg4PLB9O17EIENI8cweB4kODZcMLqWcAimCtZWewxzH2XmMHQTw1_CPaI_xF';
const startPages = 321;
const maxPages = 340;
module.exports={
    get:get
}


// function saveData(path, text) {
// // use fs.writeFile to save data during debug
//     fs.writeFile(path, text, function (err) {
//         if (err) {
//             return console.log(err);
//         }
//         console.log('Data saved');
//     });
// }
function initGet() {
    get_data.push("");
    get_data.push("");
    //inorder to keep index same with page
    for (var i = 2; i <= maxPages; i++) {
        get_data.push("/page-" + i);
    }


    // loot
    for (var i = startPages; i <= maxPages; i++) {
        var action = () => {
            return new Promise(resolve => {
                (() => {
                    var options = {
                        hostname: 'restaurant.michelin.fr',
                        path: '/restaurants/france' + get_data[i],
                        method: 'GET'
                    };
                    var htmlTemp = '';
                    var req = https.request(options, function (res) {
                        res.setEncoding('utf8');
                        res.on('data', function (chunk) {
                            htmlTemp += chunk;
                        });
                        res.on('end', function () {
                            let $ = cheerio.load(htmlTemp);
                            // const link = $('div.node--poi').first().find('a.poi-card-link').first().attr('href');
                            // resolveSingle(link);
                            $('div.node--poi').each((index, dom) => {
                                const link = $(dom).find('a.poi-card-link').first().attr('href');
                                resolveSingle(link);
                                // var restaurant={};
                                // restaurant.name=$(dom).find('div.poi_card-display-title').first()
                                //     .text().replace(/(^\s*)|(\s*$)/g, "");
                                // const ul=$(dom).find('ul.review-stars').first();
                                // var rating=0;
                                // $(ul).find('li.O').each(()=>{
                                //    rating++;
                                // });
                                // $(ul).find('li.D').each(()=>{
                                //     rating+=0.5;
                                // });
                                // restaurant.rating=rating;
                                // restaurant.price=$(dom).find('div.poi_card-display-price').first()
                                //     .text().replace(/(^\s*)|(\s*$)/g, "");
                                // restaurant.cuisine=$(dom).find('div.poi_card-display-cuisines').first()
                                //     .text().replace(/(^\s*)|(\s*$)/g, "").split(";");
                                // michelin_restaurants.push(restaurant);
                            });
                            console.log("pages :" + (count++));
                            resolve();
                        });
                    });
                    req.on('error', function (e) {
                        console.log(i + ' problem with request: ' + e.message);
                    });
                    req.end();
                })(i)

            })
        }
        actions.push(action());  // add each method in loot into a array
    }

}

function resolveSingle(path) {
    var options = {
        hostname: 'restaurant.michelin.fr',
        path: path,
        method: 'GET'
    };
    var htmlTemp = '';
    var req = https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            htmlTemp += chunk;
        });
        res.on('end', function () {
            var object = {};
            let $ = cheerio.load(htmlTemp);
            object.rating = $('meta[itemprop="ratingValue"]').attr("content");
            object.name = $('h1[itemprop="name"]').text().replace(/(^\s*)|(\s*$)/g, "");
            object.thoroughfare=$('div.thoroughfare').first().text();
            object.postalCode=$('span.postal-code').first().text();
            object.locality=$('span.locality').first().text();
            if(object.rating!=undefined && object.rating!='undefined'){
                mongo.insertOne(object);
                console.log(insertCount++);
            }
        });
    });
    req.on('error', function (e) {
        console.log("Path is "+path);
        console.log(' problem with request: ' + e.message);
    });
    req.end();
}
function initMongoDBData(){
    initGet();
    Promise.all(actions).then(() => {
        // console.log(michelin_restaurants.length);
        // michelin_restaurants.forEach((item)=>{
        //     myMysql.insertRating(item);
        // });
        // myMysql.exit();
        // saveData(file_path,JSON.stringify(michelin_restaurants));
    });
}
function get(){
    return mongo.queryList();
}
// initMongoDBData();
// function getMichelin(){
//
// }
// getMichelin();
