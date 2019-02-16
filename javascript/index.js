var properties = [];
var nameFilterProperties = [];
var startDay;

function init() {
    $.ajax({
        type: "GET",
        url: "http://localhost:9001/properties",
        dataType: "json",
        success: function (data) {
            successGetData(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);

            console.log(XMLHttpRequest.readyState);

            console.log(textStatus);
        }
    });
}

let successGetData = (data) => {
    $('#spinner').attr('visibility', 'hidden');
    properties = data.properties;
    startDay = data.startDay;
    $('#tableDiv').attr('visibility', 'visible');
    showTable(properties);

}

function showTable(list) {
    var templateData = {properties: list, startDay: startDay};
    // resolveAddress(properties[0].name);
    var html = template('showProperties', templateData);
    document.getElementById('properties').innerHTML = html;
    altRows('properties');
}

function altRows(id) {
    var table = document.getElementById(id);
    var rows = table.getElementsByTagName("tr");

    for (i = 0; i < rows.length; i++) {
        if (i % 2 == 0) {
            rows[i].className = "evenrowcolor";
        } else {
            rows[i].className = "oddrowcolor";
        }
    }
}

function filterName() {
    var name = $('#filterName').val();
    var reg;
    eval("reg=/.*" + name + ".*/i");
    try {
        nameFilterProperties = [];
        properties.forEach((property) => {
            if (reg.test(property.name)) {
                nameFilterProperties.push(property);
            }
        });
        sortShowTable(nameFilterProperties);
    } catch (e) {
        alert("Invalid name");
    }
}

function sortShowTable(data) {
    const filterName = $('input[name="filter"]:checked').val();
    if (filterName == undefined | filterName == 'undefined') {
        showTable(data);
    } else {
        switch (filterName) {
            case 'name': {
                data.sort(function (a, b) {
                    if (a.name < b.name) {
                        return -1;
                    } else if (a.name == b.name) {
                        return 0;
                    } else {
                        return 1;
                    }
                });
                showTable(data);
            }
                break;
            case 'star': {
                data.sort(function (a, b) {
                    return b.rating - a.rating;
                });
                showTable(data);
            }
                break;
            case 'price': {
                data.sort(function (a, b) {
                    return a.price - b.price;
                });
                showTable(data);
            }
                break;
            case 'distance': {

                data.sort(function (a, b) {
                    if (a.distance == undefined) return 1;
                    if (b.distance == undefined) return -1;
                    return a.distance - b.distance;
                });
                showTable(data);
            }
                break;
        }
    }
}

function showMap(dom) {
    const selectName=$(dom).attr('value');
    for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        console.log(property);
        if (property.name == selectName) {
            if (property.latitude != undefined) {
                console.log(loc);
                var loc = new Microsoft.Maps.Location(property.latitude, property.longitude);
                var pin = new Microsoft.Maps.Pushpin(loc, {
                    title: property.name
                });
                map.entities.push(pin);
                map.setView({
                    center: loc,
                    zoom: 13
                });
            }
            break;
        }
    }
}