var locationInput = document.querySelector('#locationField');

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


var navHeight = document.querySelector('nav').offsetHeight;
var footerHeight = document.querySelector('footer').offsetHeight;

document.querySelector('main').style.minHeight = `${window.innerHeight - (navHeight + footerHeight)}px`;



locationInput.addEventListener('input', function () {
    getForecast(this.value);
})

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getUserLocation);
} else {
    console.log("Geolocation is not supported by this browser.");
}

getForecast('cairo')


function getUserLocation(position) {
    var currentPosition = position.coords.latitude + "," + position.coords.longitude;
    getForecast(currentPosition);
}


/* async function getForecast(location) {
    var weatherRequest = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=83e5a7c8b53b44ac82501616230408%20&q=${location}&days=3`);
    if (weatherRequest.ok && weatherRequest.status != 400) {
        var weatherInfo = await weatherRequest.json();
        displayCurrentDay(weatherInfo);
        displayAnotherDays(weatherInfo);
    }
} */

async function getForecast(location) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=83e5a7c8b53b44ac82501616230408%20&q=${location}&days=3`)
        .then((weatherRequest) => {
            if (weatherRequest.ok && weatherRequest.status != 400) {
                return weatherRequest.json();
            } else {
                throw new Error("Invalid City");
            }
        })
        .then((weatherInfo) => {
            displayCurrentDay(weatherInfo);
            displayAnotherDays(weatherInfo);
        }).catch(error => {
            console.log(error);
        })
}

function displayCurrentDay(weatherInfo) {
    var date = new Date(weatherInfo.forecast.forecastday[0].date)
    var currentDayBody = `
    <div class="col-lg-4 p-0">
        <div class="weather-card">
            <div class="card-title d-flex flex-wrap justify-content-between align-align-items-center text-main-color  p-2">
                <span class="currentDay">${days[date.getDay()]}</span>
                <span class="currentDate">${months[date.getMonth()] + " " + date.getDate()}</span>
            </div>
            <div class="card-body text-main-color py-4 px-3">
                <div class="d-flex flex-wrap justify-content-between align-align-items-center">
                    <div>
                        <span class="city">${weatherInfo.location.name}</span>,
                        <span class="country">${weatherInfo.location.country}</span>
                    </div>
                    <span class="curentTime">${weatherInfo.location.localtime.split(' ')[1]}</span>    
                </div>

                <div class="d-flex flex-wrap justify-content-between align-items-center my-3">
                    <div class="currentTemp text-white fw-bolder">
                        ${weatherInfo.current.temp_c}<sup>o</sup>C
                    </div>
                    <img src="https:${weatherInfo.current.condition.icon}" width="90" alt="">
                </div>

                <div class="d-flex justify-content-between align-items-center my-3">
                    <div class="realFeel">RealFeel ${weatherInfo.current.feelslike_c}<sup>o</sup></div>
                    <div class="currentCondition">${weatherInfo.current.condition.text}</div>
                </div>
                <div class="d-flex column-gap-4">
                    <div>
                        <img src="images/icon-umberella.png" alt="">
                        <span class="currentHumidity">${weatherInfo.current.humidity}%</span>
                    </div>
                    <div>
                        <img src="images/icon-wind.png" alt="">
                        <span class="currentWind">${weatherInfo.current.wind_kph}km/h</span>
                    </div>
                    <div>
                        <img src="images/icon-compass.png" alt="">
                        <span class="currentWindDir">${weatherInfo.current.wind_dir} - ${weatherInfo.current.wind_degree}<sup>o</sup></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    document.querySelector('#forecast').innerHTML = currentDayBody;
}

function displayAnotherDays(weatherInfo) {
    var anotherDaysContent = ``;

    for (let i = 1; i < weatherInfo.forecast.forecastday.length; i++) {
        var date = new Date(weatherInfo.forecast.forecastday[i].date);
        anotherDaysContent += `
        <div class="col-lg-4 p-0">
            <div class="weather-card h-100">
                <div
                    class="card-title d-flex flex-wrap justify-content-between align-align-items-center align-self-start text-main-color  p-2">
                    <span class="anotherDay">${days[date.getDay()]}</span>
                    <span class="anotherDate">${months[date.getMonth()] + " " + date.getDate()}</span>
                </div>
                <div class="card-body d-flex flex-column justify-content-center row-gap-2 text-main-color text-center py-4 px-3">
                    <img src="https://${weatherInfo.forecast.forecastday[i].day.condition.icon}" width="90" class="mx-auto" alt="">
                    <span class="maxTemp">${weatherInfo.forecast.forecastday[i].day.maxtemp_c}<sup>o</sup>C</span>
                    <span class="minTemp">${weatherInfo.forecast.forecastday[i].day.mintemp_c}<sup>o</sup>C</span>
                    <span class="conditionText">${weatherInfo.forecast.forecastday[i].day.condition.text}</span>
                </div>
            </div>
        </div>
        `
    }

    document.querySelector('#forecast').innerHTML += anotherDaysContent;
}

document.querySelector('.navbar-toggler').addEventListener('click', function () {
    document.querySelector('.navbar-collapse').classList.toggle("pt-4");
});