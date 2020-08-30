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


// keyup for recent searches
inputValue.addEventListener("keyup", () => {
    // disables the person adding an empty search bar
    button.disabled = !inputValue.value;

    var city = inputValue.value;
    getCity(city);
    cityCoord(city);
    get5Day(city);
})

var loadLast = function (event) {
    var city = event.target.textContent;
    getCity(city);
    cityCoord(city);
    get5Day(city);
}

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
            var m = moment();
            var date = m.format("LL");
            var descriptionValue = data['weather'][0]['description'];
            var temperatureValue = data['main']['temp'];
            var temperatureFarhenheit = Math.round(((temperatureValue - 273.15)*1.8)+32) + "°F";
            var humidityValue = " " + data['main']['humidity'] + "%";
            var windSpeedValue = " " + data['wind']['speed'] + " mph";
            
            cityName.innerHTML = cityValue;
            currentDay.innerHTML = date;
            weatherDescription.innerHTML = descriptionValue;
            temperature.innerHTML = temperatureFarhenheit;
            humidity.innerHTML = humidityValue;
            windSpeed.innerHTML = windSpeedValue;

        })
        } else {
            alert("Error: " + response.statusText);
        }
    })

    .catch(function(error) {
        // if above function does not work
    alert("Unable to connect");
    });
};


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

    .catch(function(error) {
    // if above function does not work
    alert("Unable to connect");
    });
};


// get 5 day forecast
var get5Day = function (value) {

    // format api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q="+value+"&appid=386eafe2ba649945a853251bb7d3f25e";

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        
        // request was successful
        if (response.ok) {            
            response.json().then(function(data) {
                     
            for (var i = 1; 1 < 6; i++) {

                // variables - 5 day forecast
                var dateEl = document.querySelector("#day" + i);
                var tempEl = document.querySelector("#temp" + i);
                var humiEl = document.querySelector("#hum" + i);
                    
                // secondary dashboard
                var date = moment().add(i, 'days').format('l');
                dateEl.innerHTML = date;

                var temperatureValue = data.list[i].main.temp;
                var temperatureFarhenheit = Math.round(((temperatureValue - 273.15)*1.8)+32) + "°F";
                tempEl.innerHTML = temperatureFarhenheit;                    
                
                var humidityValue = data.list[i].main.humidity + "%";
                humiEl.innerHTML = humidityValue;
            
            }
        });
        } else {
            alert("Error: " + response.statusText);
        }
    })

    .catch(function(error) {
    // if above function does not work
    alert("Unable to connect");
    });
};

// when search button is clicked 
var formSubmitHandler = function(event) {
    event.preventDefault();

    var city = inputValue.value;
    
    // local storage
    function save() {
        var addCity = city
        if (localStorage.getItem("recentSearch") === null) {
            localStorage.setItem("recentSearch", "[]");
        }
        var newCity = JSON.parse(localStorage.getItem("recentSearch"));
        newCity.push(addCity);

        localStorage.setItem("recentSearch", JSON.stringify(newCity))
    };

    getCity(city);
    cityCoord(city);
    get5Day(city);
    save(city);
};


button.addEventListener("click", formSubmitHandler);