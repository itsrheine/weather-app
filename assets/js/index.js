var button = document.querySelector(".button");
var inputValue = document.querySelector("#city");
var cityName = document.querySelector(".cityName");
var weatherDescription = document.querySelector(".description");
var temperature = document.querySelector(".temperature");
var humidity = document.querySelector(".humidity");
var windSpeed = document.querySelector(".windSpeed");
var uvIndex = document.querySelector(".uvIndex");

var getCity = function(value) {
    
    // format api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+value+"&appid=386eafe2ba649945a853251bb7d3f25e"

    // make a request to the url
    fetch(apiUrl).then(function(response) {

        // request was successful
        if (response.ok) {            
            response.json().then(function(data) {
            
            // get all the data
            var cityValue = data['name'];
            var descriptionValue = data['weather'][0]['description'];
            var temperatureValue = data['main']['temp'];
            var humidityValue = data['main']['humidity'];
            var windSpeedValue = data['wind']['speed'];
            // var uvIndexValue = data[]

            cityName.innerHTML = cityValue;
            weatherDescription.innerHTML = descriptionValue;
            temperature.innerHTML = temperatureValue;
            humidity.innerHTML = humidityValue;
            windSpeed.innerHTML = windSpeedValue;
            // uvIndex.innerHTML = uvIndexValue;
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

var formSubmitHandler = function(event) {
    event.preventDefault();

    var city = inputValue.value;
    getCity(city);
}

button.addEventListener("click", formSubmitHandler);