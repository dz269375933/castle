var properties = [];
var nameFilterProperties=[];
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
let successGetData=(data)=>{
    $('#spinner').attr('visibility','hidden');
    properties=data.properties;
    startDay=data.startDay;
    $('#tableDiv').attr('visibility','visible');
    showTable(properties);

}
function showTable(list){
    var templateData={properties:list,startDay:startDay};
    var html=template('showProperties',templateData);
    document.getElementById('properties').innerHTML=html;
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
function filterName(){
    var name=$('#filterName').val();
    var reg;
    eval("reg=/.*"+name+".*/i");
    console.log(reg);
    try{
        nameFilterProperties=[];
        properties.forEach((property)=>{
            if(reg.test(property.name)){
                nameFilterProperties.push(property);
            }
        });
        sortShowTable(nameFilterProperties);
    }catch (e) {
        alert("Invalid name");
    }
}
function sortShowTable(data){
    const filterName=$('input[name="filter"]:checked').val();
    console.log(filterName);
    if(filterName==undefined |filterName=='undefined'){
        showTable(data);
    }else{
        switch (filterName){
            case 'name':{
                data.sort(function (a,b) {
                    if(a.name<b.name){
                        return -1;
                    }else if(a.name==b.name){
                        return 0;
                    }else{
                        return 1;
                    }
                });
                showTable(data);
            }break;
            case 'star':{
                data.sort(function (a,b) {
                    return b.rating-a.rating;
                });
                showTable(data);
            }break;
            case 'price':{
                data.sort(function (a,b) {
                    return a.price-b.price;
                });
                showTable(data);
            }break;
            case 'distance':{

            }break;
        }
    }
}