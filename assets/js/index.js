var button = document.querySelector(".button");
var inputValue = document.querySelector(".inputValue");
var cityName = document.querySelector(".cityName");
var temperature = document.querySelector(".temperature");
var humidity = document.querySelector(".humidity");
var windSpeed = document.querySelector(".windSpeed");
var uvIndex = document.querySelector(".uvIndex");

button.addEventListener('click', function() {
    fetch ("https://api.openweathermap.org/data/2.5/weather?q="+inputValue.value+"&appid=386eafe2ba649945a853251bb7d3f25e")
    .then(response => response.json())
    .then(data => console.log(data))

.catch(err => alert("Wrong city name!"))
})
