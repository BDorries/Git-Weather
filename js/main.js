
let lat = 32.712088;
let lng = -94.121297;

let coords = {lng, lat}

fiveDay(coords);

function fiveDay(coords) {
    $.get("https://api.openweathermap.org/data/2.5/forecast", {
        APPID: OPENWEATHER_API_KEY,
        lat: coords.lat,
        lon: coords.lng,
        units: "imperial"
    })
        .done(function (data) {
            $('#results').html(makeHTML(data))
        })
        .fail(function () {
            console.log('You broke it')
        })
        .always(function () {
        });
}
function makeHTML(data){
    let html = `<h3>Weather for the city of ${data.city.name}</h3>`
    html += `<div id="resultData">`;
    let daySubStr = '';
    let monthSubStr = '';
    let yearSubStr = '';
    let dateStr = '';

    for (let i = 0; i < data.list.length; i += 8) {
        dateStr = data.list[i].dt_txt;
        daySubStr = dateStr.substring(8,10);
        monthSubStr = dateStr.substring(5,7);
        yearSubStr = dateStr.substring(0,4);
        html += `<div data-id="data${i}" class="data-card">`
        html += `<img src="http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png">`
        html += `<p>${monthSubStr}/${daySubStr}/${yearSubStr}</p>`;
        html += `<p>${getDaysOfWeek(data.list[i].dt)}</p>`;
        html += `<p>${data.list[i].main.temp_min} / ${data.list[i].main.temp_max} &#8451;</p>`;
        html += `<p>Humidity: ${data.list[i].main.humidity}%</p>`;
        html += `<p>Wind: ${data.list[i].wind.speed} km/h ${(getWindDirection(data.list[i].wind.deg))}</p>`
        html += `</div>`
    }
    html += `</div>`
    return html;
}

function getWindDirection (deg){
    switch(true){
        case (deg < 90) :
            return 'NE';
            break;
        case (deg < 180) :
            return 'SE';
            break;
        case (deg < 270) :
            return 'SW';
            break;
        case (deg < 360) :
            return 'NW';
            break;
        default :
            return 'unknown';
    }
}

mapboxgl.accessToken = MAPBOX_API_KEY;
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 13,
    center: [-94.121297, 32.712088]
});

let marker = new mapboxgl.Marker({
    "color" : "#fca311",
    draggable: true
})
    .setLngLat([-94.121297, 32.712088])
    .addTo(map)


let mapBoxGeocoder = undefined;

mapBoxGeocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    flyTo: false,
    marker: false
})

map.addControl(mapBoxGeocoder)

mapBoxGeocoder.on('result', function(result){
    coords.lng = result.result.center[0]
    coords.lat = result.result.center[1]
    updateSearch(coords)
    fiveDay(coords)
});

//result.result.center, true, result.name

function getDaysOfWeek(unixTimestamp){

const d = new Date(unixTimestamp*1000);
let day = d.getDay();
switch(day){
    case 0 :
        return 'Sun';
        break;
    case 1 :
        return 'Mon';
        break;
    case 2 :
        return 'Tues';
        break;
    case 3 :
        return 'Wed';
        break;
    case 4 :
        return 'Thur';
        break;
    case 5 :
        return 'Fri';
        break;
    case 6 :
        return 'Sat';
        break;
    default :
        return 'Error';
    }
}

map.addControl(new mapboxgl.NavigationControl());

navigator.geolocation.getCurrentPosition(function(position){
    update(position);
        },
    function(){
        $('#secrets').css('display', 'block')
        setTimeout(function(){
            $('#secrets').css('display', 'none')
        }, 5000);
    });

marker.on("dragend", function(){
    let newPos = marker.getLngLat()
    updateSearch(newPos);
    fiveDay(newPos);
})

function update(position){
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    coords = {lng, lat}
    marker.setLngLat(coords);
    map.flyTo({
        center: [lng,lat]
    });
    fiveDay(coords);
}

function updateSearch(position){
    let lat = position.lat;
    let lng = position.lng;
    coords = {lng, lat}
    marker.setLngLat(position);
    map.flyTo({
        center: [lng,lat]
    });
}