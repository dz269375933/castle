const bingKey = 'Atslwg4PLB9O17EIENI8cweB4kODZcMLqWcAimCtZWewxzH2XmMHQTw1_CPaI_xF';
// const yandexKey='a2b23262-69e8-4b2c-AB35-dd79dd87e0c6';
var map = null;
var searchManager;
var locationMap = new Map();
var myLocation = {};
// geocodeAddress("Paris");
// function geocodeAddress(address) {
//     $.ajax({
//         type: "GET",
//         url: "https://geocode-maps.yandex.ru/1.x/?apikey="+yandexKey+"&geocode="+address+"+6&lang=en-US",
//         dataType: "json",
//         success: function (data) {
//             console.log(url);
//             console.log(data);
//         },
//         error: function (XMLHttpRequest, textStatus, errorThrown) {
//             console.log(url);
//             console.log(XMLHttpRequest.status);
//
//             console.log(XMLHttpRequest.readyState);
//
//             console.log(textStatus);
//         }
//     });
// }
function GetMap() {
    map = new Microsoft.Maps.Map('#mapDiv', {credentials: bingKey});
    if (!searchManager) {
        //Create an instance of the search manager and call the geocodeQuery function again.
        Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
            searchManager = new Microsoft.Maps.Search.SearchManager(map);
            return;
        });
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            myLocation.latitude = position.coords.latitude
            myLocation.longitude = position.coords.longitude
        }, function () {
        });
    }

}

function clickGeocode() {

    // Microsoft.Maps.loadModule('Microsoft.Maps.Search', { callback: searchModuleLoaded });
    for (let i = 0; i < properties.length; i++) {
        var query = properties[i].thoroughfare;

        var geocodeRequest = "http://dev.virtualearth.net/REST/v1/Locations?" +
            "query=" + encodeURIComponent(query) + "&key=" + bingKey;
        $.ajax({
            url: geocodeRequest,
            dataType: "jsonp",
            jsonp: "jsonp",
            success: function (response) {
                if (response &&
                    response.resourceSets &&
                    response.resourceSets.length > 0 &&
                    response.resourceSets[0].resources.length>0) {

                    var results = response.resourceSets[0].resources;
                    properties[i].latitude=results[0].point.coordinates[0];
                    properties[i].longitude=results[0].point.coordinates[1];
                    properties[i].distance=GetDistance(myLocation.latitude,myLocation.longitude
                                            ,results[0].point.coordinates[0],results[0].point.coordinates[1]);
                }
            },
            error: function (e) {
                console.log(query+" :error");
                console.log();(e.statusText);
            }
        });
        // var query = properties[i].thoroughfare;
        // if (query == undefined | query == '') query = properties[i].addressLocality;
        //
        // var searchRequest = {
        //     where: query,
        //     callback: function (r) {
        //         //Add the first result to the map and zoom into it.
        //         if (r && r.results && r.results.length > 0) {
        //             // var pin = new Microsoft.Maps.Pushpin(r.results[0].location);
        //             // map.entities.push(pin);
        //             // map.setView({ bounds: r.results[0].bestView });
        //             properties[i].latitude=r.results[0].location.latitude;
        //             properties[i].longitude=r.results[0].location.longitude;
        //             properties[i].location=r.results[0].location;
        //             properties[i].distance=GetDistance(myLocation.latitude,myLocation.longitude
        //             ,r.results[0].location.latitude,r.results[0].location.longitude);
        //         }
        //     },
        //     errorCallback: function (e) {
        //         console.log(e);
        //         console.log("error");
        //         var request = {
        //             where: properties[i].addressLocality,
        //             callback: function (r) {
        //                 //Add the first result to the map and zoom into it.
        //                 if (r && r.results && r.results.length > 0) {
        //                     // var pin = new Microsoft.Maps.Pushpin(r.results[0].location);
        //                     // map.entities.push(pin);
        //                     // map.setView({ bounds: r.results[0].bestView });
        //                     properties[i].latitude=r.results[0].location.latitude;
        //                     properties[i].longitude=r.results[0].location.longitude;
        //                     properties[i].location=r.results[0].location;
        //                     properties[i].distance=GetDistance(myLocation.latitude,myLocation.longitude
        //                         ,r.results[0].location.latitude,r.results[0].location.longitude);
        //                 }
        //             },
        //             errorCallback: function (e) {
        //                 console.log(e);
        //                 console.log("error");
        //             }
        //         };
        //
        //         //Make the geocode request.
        //         searchManager.geocode(request);
        //     }
        // };
        //
        // //Make the geocode request.
        // searchManager.geocode(searchRequest);
    }
}
function GetDistance( lat1,  lng1,  lat2,  lng2){
    var radLat1 = lat1*Math.PI / 180.0;
    var radLat2 = lat2*Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
        Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s *6378.137 ;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
}