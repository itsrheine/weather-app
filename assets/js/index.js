// variables
var button = document.querySelector(".button");
var inputValue = document.querySelector("#city");
var cityName = document.querySelector("#searchedCity");
var currentDay = document.querySelector(".currentDay");
var weatherDescription = document.querySelector(".description");
var temperature = document.querySelector(".temperature");
var humidity = document.querySelector(".humidity");
var windSpeed = document.querySelector(".windSpeed");
var uvIndex = document.querySelector(".uvIndex");
var parent = document.getElementById("parentElementID");
var recentSearch = document.querySelector("#recentSearch");
var iconValue = document.querySelector(".weather-icon");
var inputValTrim = inputValue.value.trim();

var loadLast = function (event) {
    var city = event.target.textContent;
    getCity(city);
    cityCoord(city);
    get5Day(city);
}

// get main dashboard current weather - using city id
var getCity = function(value) {
    
    // format api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+value+"&appid=386eafe2ba649945a853251bb7d3f25e"

    // make a request to the url
    fetch(apiUrl).then(function(response) {

        // request was successful
        if (response.ok) {            
            response.json().then(function(data) {

            // get all the data - main dashboard
            mainDashboard(data, value);
            cityCoord(data.coord.lon, data.coord.lat);
            get5Day(data, value);
                
            })
        } else {
            alert("Error: " + response.statusText);
        }
    })
};

// function for all in dashboard
var mainDashboard = function(data, city) {

    // city header
    cityName.textContent = city + " " + moment().format("L") + " ";

    // weather image
    var iconEl = data.weather[0].icon; // this is the code
    iconValue.setAttribute("src", "http://openweathermap.org/img/w/" + iconEl + ".png");

    // temperature value
    var temperatureValue = data['main']['temp'];
    var temperatureFarhenheit = Math.round(((temperatureValue - 273.15)*1.8)+32) + "°F";
    temperature.innerHTML = temperatureFarhenheit;

    // humidity value
    var humidityValue = " " + data['main']['humidity'] + "%";   
    humidity.innerHTML = humidityValue;

    // wind speed value
    var windSpeedValue = " " + data['wind']['speed'] + " mph";  
    windSpeed.innerHTML = windSpeedValue;
}

// get city's coordinates & uv index for main dashboard
var cityCoord = function (data) {
    
    // variables for longitude and latitude
    var lonValue = data['coord']['lon'];
    var latValue = data['coord']['lat'];

    // format api url
    var apiUrl2 = "https://api.openweathermap.org/data/2.5/uvi?appid=386eafe2ba649945a853251bb7d3f25e&lat="+latValue+"&lon="+lonValue;

        // make a request to 2nd url
        fetch(apiUrl2).then(function(response) {
            response.json().then(function(data) {

                if (response.ok) {
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
            }
            else {
            alert("There is a problem with your request.");
        }
    })
})

// get 5 day forecast
var get5Day = function (data) {

    for (var i = 1; 1 < 5; i++) {

        // variables - 5 day forecast
        var dateEl = document.querySelector("#day" + i);
        var tempEl = document.querySelector("#temp" + i);
        var humiEl = document.querySelector("#hum" + i);
        var iconEl = document.querySelector("#Icon" + i);

        // secondary dashboard
        var date = moment().add(i, 'days').format('l');

        dateEl.innerHTML = date;
                
        var temperatureValue = data.list[i].main.temp;
        var temperatureFarhenheit = Math.round(((temperatureValue - 273.15)*1.8)+32) + "°F";
        tempEl.innerHTML = temperatureFarhenheit;                    
                
        var humidityValue = data.list[i].main.humidity + "%";
        humiEl.innerHTML = humidityValue;

        var iconVal = data.list[i].weather[0].icon; // this is the code
        iconEl.setAttribute("src", "http://openweathermap.org/img/w/" + iconVal + ".png");
           
    }
}

// when search button is clicked 
var formSubmitHandler = function(event) {
    event.preventDefault();

    var inputValEl = inputValue.value;
    
    // city to appear after search
    if (inputValTrim) {
        cityList = document.createElement("li");
        cityList.className = "nav-item";
        cityList.innerHTML="<a href='#' class='border nav-link'><span data-feather='file'></span>"+askCity+"</a>";
    
        recentSearch.appendChild(cityList);

        // save to local storage
        localStorage.setItem("recentSearch", JSON.stringify(newCity));
        
        getCity(inputValEl);
    } 
    else {

        alert("Please enter a city.");
    }

    // local storage
    function save() {
        console.log(inputValEl);
        if (localStorage.getItem("recentSearch") === null) {
            localStorage.setItem("recentSearch", "[]");
        }
        var newCity = JSON.parse(localStorage.getItem("recentSearch"));
        newCity.push(inputValEl);d
    };

    getCity(inputValEl);
    cityCoord(inputValEl);
    get5Day(inputValEl);
    save(inputValEl);
};


button.addEventListener("click", formSubmitHandler);
recentSearch.addEventListener("click", loadLast);