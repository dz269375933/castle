const file_path="../data/data.json";
var fs = require('fs');
var cheerio = require('cheerio');
var querystring=require('querystring');
var actions = [];
var htmlCode=[];
var get_data=[];
var michelin_restaurants=[];
var https = require('https');
const maxPages=10;


function saveData(path, text) {
// use fs.writeFile to save data during debug
    fs.writeFile(path, text, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log('Data saved');
    });
}
function initGet(){
    get_data.push("");
    get_data.push("");
    for(var i=2;i<=maxPages;i++){
        get_data.push("/page-"+i);
    }


    // loot
    for (var i = 1; i <=maxPages; i++) {
        var action = () => {
            return new Promise(resolve =>{
                (()=>{
                    var options = {
                        hostname: 'restaurant.michelin.fr',
                        path: '/restaurants/france'+get_data[i],
                        method: 'GET'
                    };
                    var htmlTemp='';
                    var req = https.request(options, function (res) {
                        res.setEncoding('utf8');
                        res.on('data', function (chunk) {
                            htmlTemp+=chunk;
                        });
                        res.on('end',function () {
                            let $ = cheerio.load(htmlTemp);
                            $('div.node--poi').each((index,dom)=>{
                                var restaurant={};
                                restaurant.name=$(dom).find('div.poi_card-display-title').first()
                                    .text().replace(/(^\s*)|(\s*$)/g, "");
                                const ul=$(dom).find('ul.review-stars').first();
                                var rating=0;
                                $(ul).find('li.O').each(()=>{
                                   rating++;
                                });
                                $(ul).find('li.D').each(()=>{
                                    rating+=0.5;
                                });
                                restaurant.rating=rating;
                                restaurant.price=$(dom).find('div.poi_card-display-price').first()
                                    .text().replace(/(^\s*)|(\s*$)/g, "");
                                restaurant.cuisine=$(dom).find('div.poi_card-display-cuisines').first()
                                    .text().replace(/(^\s*)|(\s*$)/g, "").split(";");
                                michelin_restaurants.push(restaurant);
                            });

                           resolve();
                        });
                    });
                    req.on('error', function (e) {
                        console.log('problem with request: ' + e.message);
                    });
                    req.end();
                })(i)

            })
        }
        actions.push(action());  // add each method in loot into a array


    }

}
initGet();
Promise.all(actions).then(()=>{
    console.log(michelin_restaurants.length);
    saveData(file_path,JSON.stringify(michelin_restaurants));
});
// function getMichelin(){
//
// }
// getMichelin();
