

let address = "uncertain, texas";

fiveDay(address);

function fiveDay(address){

    $.get("http://api.openweathermap.org/data/2.5/forecast", {
        APPID: OPENWEATHER_API_KEY,
        q: address,
        units: "metric"
    })
    .done(function(data) {
        console.log(data);
        $('#results').html(makeHTML(data))
    })
    .fail(function(data){
        console.log('You broke it')
    })
    .always(function(data){
        console.log('always')
    });
}

function makeHTML(data){
    let html = `<h3>${data.city.name}, ${data.city.country}</h3>`
    html += `<div id="resultData">`;
    let daySubStr = '';
    let monthSubStr = '';
    let yearSubStr = "";
    let dateStr = '';

    for (let i = 0; i < data.list.length; i += 8) {
        dateStr = data.list[i].dt_txt;
        daySubStr = dateStr.substring(8,10);
        monthSubStr = dateStr.substring(5,7);
        yearSubStr = dateStr.substring(0,4);
        html += `<div data-id="data${i}" class="data-card">`
        html += `<img src="http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png">`
        html += `<p>${monthSubStr}/${daySubStr}/${yearSubStr}</p>`;
        html += `<p>${data.list[i].main.temp_min} / ${data.list[i].main.temp_max}&#8451;</p>`;
        html += `</div>`
    }
    html += `</div>`
    return html;
}

let defaultAddress = geocode(address, MAPBOX_API_KEY).then(result => {
    return result
});

mapboxgl.accessToken = MAPBOX_API_KEY;
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 13,
    center: [-94.121297, 32.712088]
});

let marker = new mapboxgl.Marker()
    .setLngLat([-94.121297, 32.712088])
    .addTo(map);

map.addControl(new mapboxgl.NavigationControl());

