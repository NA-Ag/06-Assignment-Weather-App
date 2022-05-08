/* Variables start here */ 
let mainFunctionality = $("#mainFunctionality");
let previous = $("#previous");
let today = $("#today");
let resultForecast = $("#resultForecast");
let cities = [];
let previousCities = localStorage.getItem("Previous cities");
let userInput;

var moment = moment();
var currentDateG = moment.format('l');
const days = []
for (i = 0; i < 5; i++) {
    const day = moment.add(1, 'days').format('l')
    days.push(day)
}
/* End Variables */

/* Event Listeners start here*/
mainFunctionality.on('click', "#searchButton", inputSearch);
mainFunctionality.on('click', "#previousCity", prevCitiesSearch);

//Search Functions, text input and previous button input
function inputSearch() {
    const input = $(this).siblings("input");
    userInput = input.val();
    input.val("");
    searchEvent(userInput);
};

function prevCitiesSearch() {
    userInput = $(this).text();
    searchEvent(userInput);
};

function searchEvent(userInput) {
    const geoURL = "https://api.openweathermap.org/geo/1.0/direct?q="+ userInput + "&appid=b29a8531d0384d101a74c4bd78437940"
    getCoordinates(geoURL);
    storeCity();
};
 /* Event listeners end here */


/* Functions start here */

function storeCity() {
    cities.unshift(userInput);
    cities = Array.from(new Set(cities));
    if (cities.length >= 9) Cities.pop();
    previousCities = cities.join(",");
    localStorage.setItem('Previous cities', previousCities);
    renderPreviousCities();
}


function renderPreviousCities() {
    previous.html("");
    for (i = 0; i < cities.length; i++) {
        const prevCityName = cities[i];
        const previousCityListItem = $("<li>");
        previousCityListItem.html(`<button id="previousCity" class="btn">${prevCityName}</button>`);
        previous.append(previousCityListItem);
    };
};

function getWeather(url) {
    fetch(url).then(response => response.json()).then(data => {
        createHTML(data)
    });
};

function getCoordinates(url) {
    fetch(url).then(response => response.json()).then(data => {
        const lat = data[0].lat;
        const lon = data[0].lon;
        const weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=metric&appid=b29a8531d0384d101a74c4bd78437940"
        getWeather(weatherURL);
    });
};

function createHTML(weatherData) {
    resultForecast.html("")
    const currentData = weatherData.current;
    const currentIconCode = currentData.weather[0].icon
    const currentIconURL = "https://openweathermap.org/img/wn/" + currentIconCode + "@2x.png"
    const currentTemp = currentData.temp;
    const currentWind = currentData.wind_speed;
    const currentHumid = currentData.humidity;
    const resultTodayHTML = `
    <h1>${userInput} ${currentDateG}</h1>
    <img src="${currentIconURL}" alt="icon_id: ${currentIconCode}"> 
    <p>Temp: <span>${currentTemp}°</span></p>
    <p>Wind: <span>${currentWind} KPH</span></p>
    <p>Humidity: <span>${currentHumid}%</span></p>
    `
    
    today.html(resultTodayHTML);
    for (i = 1; i < 6; i++) {        
    let resultForecastData = document.createElement("div");
    resultForecastData.classList.add("mb-4", "bg-[#2d3e50]", "w-40", "text-white", "px-2", "font-bold", "border-2", "border-black")
    let dailyData = weatherData.daily[i]
    let dailyIconCode = dailyData.weather[0].icon
    let dailyIconURL = "https://openweathermap.org/img/wn/" + dailyIconCode + "@2x.png"
    let dailyTemp = dailyData.temp.day;
    let dailyWind = dailyData.wind_speed;
    let dailyHumid = dailyData.humidity;
    
    resultForecastData.innerHTML = `
    <h2 class="text-lg">${days[i-1]}</h2>
    <img class="w-10 h-16 inline-block pb-6" src="${dailyIconURL}" alt="icon_id: ${dailyIconCode}"> 
    <p>Temp: <span>${dailyTemp}</span></p>
    <p>Wind: <span>${dailyWind} KPH</span></p>
    <p>Humidity: <span>${dailyHumid}</span></p>
    `
    resultForecast.append(resultForecastData);
    };
};

/* Functions end here */
