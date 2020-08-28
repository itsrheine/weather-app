var button = document.querySelector(".button");
var inputValue = document.querySelector(".inputValue");
var cityName = document.querySelector(".cityName");
var temperature = document.querySelector(".temperature");
var humidity = document.querySelector(".humidity");
var windSpeed = document.querySelector(".windSpeed");
var uvIndex = document.querySelector(".uvIndex");

var getCity = function(value) {
    
    // format api url
    var apiKey = "386eafe2ba649945a853251bb7d3f25e";
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+value+"&appid="+apiKey;
    
    // make a request to the url
    fetch(apiUrl).then(function(response) {

        // request was successful
        if (response.ok) {            
            response.json().then(function(data) {
            console.log(data);   
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

    var entryValue = inputValue.value.trim();
    console.log(entryValue);
    
    if (entryValue) {
        getCity(entryValue);
        inputValue.value = "";
        console.log(entryValue);
    }
}

button.addEventListener("click", getCity);