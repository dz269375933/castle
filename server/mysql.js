var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'castle'
});
module.exports = {
    insertHotels: insertHotels,
    exit: exit,
    insertRating: insertRating,
    getBestProperties:getBestProperties,
    getPrices:getPrices
}
connection.connect();


let query = function( sql ,translate) {
    // return a Promise
    return new Promise(( resolve, reject ) => {
        connection.query(sql, ( err, rows) => {
            if ( err ) {
                reject( err )
            } else {
                var results=translate(rows);
                resolve( results )
            }
        })
    })
}
function getPrices(property){
    const selectSql='select price from hotel where name = \''+property+'\'';
    return query(selectSql,(result)=>{
        var results=JSON.parse(JSON.stringify(result));
        for(var i=0;i<results.length;i++){
            results[i]=results[i].price;
        }
        return results;
    });
}
function getBestProperties (){
    const selectSql='select name from hotel where rating>0 order by rating desc';
    return query(selectSql,(result)=>{
        var results=JSON.parse(JSON.stringify(result));
        for(var i=0;i<results.length;i++){
            results[i]=results[i].name;
        }
        return results;
    });
}

function insertHotels(hotel) {
    if (hotel.price == '') {
        hotel.price = -1;
    } else {
        //USD to Euro
        hotel.price = hotel.price * 0.8876.toFixed(2);
    }
    if (hotel.rating === 'undefined') {
        hotel.rating = -1;
    }
    var array = [];
    array.push(hotel.name);
    array.push(hotel.addressLocality);
    array.push(hotel.addressCountry);
    // array.push(hotel.description);
    // array.push(hotel.priceCurrency);
    array.push(hotel.price);
    array.push(hotel.rating);
    // console.log(hotel.rating);
    var addSql = 'INSERT INTO hotel(name,locality,country,price,rating)' +
        ' VALUES(?,?,?,?,?)';
    connection.query(addSql, array, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            console.log(hotel);
            return;
        }
    });
    return;
}

function insertRating(rating) {
    var array = [];
    array.push(rating.name);
    array.push(rating.rating);
    var addSql = 'INSERT INTO rating(name,rating)' +
        ' VALUES(?,?)'
    connection.query(addSql, array, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            console.log(rating);
            return;
        }
    });
    return;
}

function exit() {
    connection.end();
}