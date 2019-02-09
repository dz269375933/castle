const myHotelModule=require('./castle');
const hotels=myHotelModule.getHotels().then((hotels)=>{
    console.log(hotels);
});