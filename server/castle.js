var https = require('https');
var cheerio = require('cheerio');
var querystring=require('querystring');
var post_datas=[];
var actions = [];
var hotels=[];
var async = require('async');
var count=0;

module.exports = {
    getProperties:getProperties,
    getWeekDay:getWeekDay
}
// let insertIntoMysql =()=>{
//     initActions();
//     Promise.all(actions).then(()=>{
//         console.log("inserting into mysql……");
//         myMysql.exit();
//         // console.log("Done");
//     });
// }
function initActions(){
    const weekend=getWeekDay();
    //
//post data
    for(var i=0;i<8;i++){
        let another_data=querystring.stringify({
            'rc_destination_availability_type[area]': 78,
            'rc_destination_availability_type[start]':weekend.saturDay,
            'rc_destination_availability_type[end]':weekend.sunDay,
            'rc_destination_availability_type[nbRooms]': 1,
            'rc_destination_availability_type[_token]': 'c_XN7Udd_E1bfKQzeSz7Fg-MpExEu0HghpPmu_ZqtT8',
            'page': i+1,
            'submit': 'true',
            'areaId': 78
        });
        post_datas.push(another_data);
    }


//loot
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
                            var tempJson;
                            try{
                                tempJson=JSON.parse(result);
                            }catch (e) {
                                console.log(result);
                                return;
                            }

                            let $ = cheerio.load(tempJson.html);
                            $('div.hotelQuickView').each((index,dom)=>{
                                var hotel={};
                                hotel.name=$(dom).find('span[itemprop="name"]').text();
                                hotel.addressLocality=$(dom).find('span[itemprop="addressLocality"]').text();
                                // hotel.description=$(dom).find('p[itemprop="description"]')
                                //     .text().replace(/(^\s*)|(\s*$)/g, "");
                                // hotel.priceCurrency=$(dom).find('span[property="priceCurrency"]').text();
                                hotel.price=$(dom).find('span[property="price"]').text();
                                hotels.push(hotel);
                                console.log(++count);
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
}

function getProperties(){
    initActions();
    return Promise.all(actions).then(()=>{
        return hotels;
    });
}
// getProperties().then((item)=>{
//     console.log(item);
// });

function getWeekDay() {
    let _date = new Date();
    let _nowTime = _date.getTime();

    let _week = _date.getDay();
    let _dayLongTime = 24 * 60 * 60 * 1000;

    let _furtureSaturdayTimes = _nowTime + (6 - _week) * _dayLongTime;

    _furtureSaturdayTimes = new Date(_furtureSaturdayTimes);


    // staurday
    let _satYear = _furtureSaturdayTimes.getFullYear();
    let _satMonth = _furtureSaturdayTimes.getMonth() + 1;
    let _satDay = _furtureSaturdayTimes.getDate();


    _satMonth = _satMonth >= 10 ? _satMonth : '0' + _satMonth;
    _satDay = _satDay >= 10 ? _satDay : '0' + _satDay;



    let _weekendDay = {
        saturday: _satYear+'-'+_satMonth+'-'+_satDay,
        sunDay: _satYear+'-'+_satMonth+'-'+(_satDay+1)
    }
    return _weekendDay;
}




