// variables
var button = document.querySelector(".button");
var inputValue = document.querySelector("#city");
var cityName = document.querySelector(".cityName");
var currentDay = document.querySelector(".currentDay");
var weatherDescription = document.querySelector(".description");
var temperature = document.querySelector(".temperature");
var humidity = document.querySelector(".humidity");
var windSpeed = document.querySelector(".windSpeed");
var uvIndex = document.querySelector(".uvIndex");
var parent = document.getElementById("parentElementID");
var recentSearch = document.querySelector("#recentSearch");
var iconValue = document.querySelector(".weather-icon");

var oldCitySearch = [];

// get main dashboard current weather - using city id
var getCity = function(value) {
    
    // format api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+value+"&appid=386eafe2ba649945a853251bb7d3f25e";

    // make a request to the url
    fetch(apiUrl).then(function(response) {

        // request was successful
        if (response.ok) {            
            response.json().then(function(data) {

            // get all the data - main dashboard
            var cityValue = data['name'];
            var m = moment().format('LL');
    
            var iconEl = data.weather[0].icon; // this is the code
            iconValue.setAttribute("src", "https://openweathermap.org/img/w/" + iconEl + ".png");
            
            // iconValue.innerHTML = iconEl;
            var temperatureValue = data['main']['temp'];
            var temperatureFarhenheit = Math.round(((temperatureValue - 273.15)*1.8)+32) + "°F";
            var humidityValue = " " + data['main']['humidity'] + "%";
            var windSpeedValue = " " + data['wind']['speed'] + " mph";             

            cityName.innerHTML = cityValue;
            currentDay.innerHTML = m;
            temperature.innerHTML = temperatureFarhenheit;
            humidity.innerHTML = humidityValue;
            windSpeed.innerHTML = windSpeedValue;
                
        })
        } else {
            alert("Error: " + response.statusText);
        }
    })
}


// get city's coordinates & uv index for main dashboard
var cityCoord = function (data) {

    // format api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+data+"&appid=386eafe2ba649945a853251bb7d3f25e";
    
    // make a request to the url
    fetch(apiUrl).then(function(response) {    

    // request was successful
    if (response.ok) {            
        response.json().then(function(data) {
    
        // get remaining data for dashboard
        var lonValue = data['coord']['lon'];
        var latValue = data['coord']['lat'];

        // format api url
        var apiUrl2 = "https://api.openweathermap.org/data/2.5/uvi?appid=386eafe2ba649945a853251bb7d3f25e&lat="+latValue+"&lon="+lonValue;

        // make a request to 2nd url
        fetch(apiUrl2).then(function(response) {
            response.json().then(function(data) {
                
                // get data in main dashboard
                var uvIndexValue = data['value'];
                uvIndex.innerHTML = uvIndexValue;

                // conditional statement color coding
                if (uvIndexValue > 5) {
                    uvIndex.className = "rounded bg-danger p3";
                }
                else if (uvIndexValue < 3) {
                    uvIndex.className = "rounded bg-success p3";
                }
                else {
                    uvIndex.className = "rounded bg-warning p3";
                }
                return uvIndexValue;
                })
        }); 
    });  

    } else {
            alert("Error: " + response.statusText);
        }
    })
}


// get 5 day forecast
var get5Day = function (value) {

    // format api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q="+value+"&appid=386eafe2ba649945a853251bb7d3f25e";

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        
        // request was successful
        if (response.ok) {            
            response.json().then(function(data) {
                     
            for (var i = 1; i < 6; i++) {

                // variables - 5 day forecast
                var dateEl = document.querySelector("#day" + i);
                var tempEl = document.querySelector("#temp" + i);
                var humiEl = document.querySelector("#hum" + i);
                var iconEl = document.querySelector("#Icon" + i);

                // secondary dashboard
                var date = moment().add(i, 'days').format('l');
                console.log(date);
                dateEl.innerHTML = date;
                
                var temperatureValue = data.list[i].main.temp;
                var temperatureFarhenheit = Math.round(((temperatureValue - 273.15)*1.8)+32) + "°F";
                tempEl.innerHTML = temperatureFarhenheit;                    
                
                var humidityValue = data.list[i].main.humidity + "%";
                humiEl.innerHTML = humidityValue;

                var iconVal = data.list[i].weather[0].icon; // this is the code
                iconEl.setAttribute("src", "https://openweathermap.org/img/w/" + iconVal + ".png");
            
                }        
            })
        }
    })
}

// when search button is clicked 
var formSubmitHandler = function(event) {
    event.preventDefault();

    // city to appear after search
    var askCity = inputValue.value.trim();
    if (askCity) {
        cityList = document.createElement("li");
        cityList.className = "nav-item";
        cityList.innerHTML="<a href='#' class='border nav-link text-white'>"+askCity+"</a>";
    
        recentSearch.appendChild(cityList);
        oldCitySearch.push(askCity);
        localStorage.setItem("oldCities", JSON.stringify(oldCitySearch));
        
        getCity(askCity);
        get5Day(askCity);
        inputValue.value = "";

    } else {
        alert("Please enter a city.");
    }
};

// local storage and saving
var localSafe = function () {
     // local storage
    var oldCities = JSON.parse(localStorage.getItem('oldCities'));

    if (oldCities === null) {
        return;
    }
    else {
        for (var i = 0; i < oldCities.length; i++) {
            cityList = document.createElement("li");
            cityList.className = "nav-item";
            cityList.innerHTML="<a href='#' class='border nav-link text-white'></span>"+oldCities[i]+"</a>";
        
            recentSearch.appendChild(cityList);
        }
    }
}

localSafe();

var sideSearches = function (event) {
    var cityName = event.target.textContent;
    getCity(cityName);
    cityCoord(cityName);
    get5Day(cityName);
}

button.addEventListener("click", formSubmitHandler);
recentSearch.addEventListener("click", sideSearches);