var https = require('https');
var cheerio = require('cheerio');
var querystring=require('querystring');
var hotels=[];
var post_datas=[];
var actions = [];
var async = require('async');

module.exports = {
    getHotels:getHotels
}

//post data
for(var i=0;i<8;i++){
    let another_data=querystring.stringify({
        'rc_destination_availability_type[area]': 78,
        'rc_destination_availability_type[start]':'',
        'rc_destination_availability_type[end]':'',
        'rc_destination_availability_type[nbRooms]': 1,
        'rc_destination_availability_type[_token]': '_3BCjy0-Kkd6zRhzn3EgMuJwS-p3vQzN5cUxC99QQYw',
        'page': i+1,
        'submit': 'true',
        'areaId': 78
    });
    post_datas.push(another_data);
}


// loot
for (var i = 0; i <8; i++) {
    var action = () => {
        return new Promise(resolve =>{
            (()=>{
                // http post
                var result='';
                let post_req = https.request({
                    hostname: "www.relaischateaux.com",
                    path:'/us/update-destination-results',
                    method: "post",
                    port: 443,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        'Content-Length': post_datas[i].length,
                        'X-Requested-With':'XMLHttpRequest'
                    },
                }, (res) => {
                    res.setEncoding('utf-8');
                    res.on('data', (d) => {
                        result+=d;
                    });
                    res.on('end',() =>{
                        var tempJson=JSON.parse(result);
                        let $ = cheerio.load(tempJson.html);
                        $('div.hotelQuickView').each((index,dom)=>{
                            var hotel={};
                            hotel.name=$(dom).find('span[itemprop="name"]').text();
                            hotel.addressLocality=$(dom).find('span[itemprop="addressLocality"]').text();
                            hotel.addressCountry=$(dom).find('span[itemprop="addressCountry"]').text();
                            hotel.description=$(dom).find('p[itemprop="description"]').text();
                            hotel.priceCurrency=$(dom).find('span[property="priceCurrency"]').text();
                            hotel.price=$(dom).find('span[property="price"]').text();
                            hotels.push(hotel)
                        });
                        resolve();
                    });
                }).on('error', (e) => {
                    console.error(i+'error: '+e);
                });

                post_req.write(post_datas[i]);
                post_req.end();
            })(i)

        })
    }
    actions.push(action());  // add each method in loot into a array
}


function getHotels(){
    return Promise.all(actions).then(()=>{
        return hotels;
    });
    //return hotels
}

