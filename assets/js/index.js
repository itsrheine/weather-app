// variables - main dashboard
var button = document.querySelector(".button");
var inputValue = document.querySelector("#city");
var cityName = document.querySelector(".cityName");
var currentDay = document.querySelector(".currentDay");
var weatherDescription = document.querySelector(".description");
var temperature = document.querySelector(".temperature");
var humidity = document.querySelector(".humidity");
var windSpeed = document.querySelector(".windSpeed");
var uvIndex = document.querySelector(".uvIndex");
var parent = document.getElementById('parentElementID');

// variables - 5 day forecast


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
            var date = (m.format("LL"));
            var descriptionValue = data['weather'][0]['description'];
            var temperatureValue = data['main']['temp'];
            var temperatureFarhenheit = Math.round(((temperatureValue - 273.15)*1.8)+32) + " °F";
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
        var apiUrl2 = "http://api.openweathermap.org/data/2.5/uvi?appid=386eafe2ba649945a853251bb7d3f25e&lat="+latValue+"&lon="+lonValue;

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



// var get5Day = function (value) {
//     // format api url
//     var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q="+value+"&appid=386eafe2ba649945a853251bb7d3f25e"

//     // make a request to the url
//     fetch(apiUrl).then(function(response) {

//         // request was successful
//         if (response.ok) {            
//             response.json().then(function(data) {
//             console.log(data);

//             // get all the data - main dashboard
//             // var dateValue = //from currentDate momentjs
//             // var cityValue = data['name'];
//             // var descriptionValue = data['weather'][0]['description'];
//             // var temperatureValue = " " + data['main']['temp'] + "°F";
//             // var humidityValue = " " + data['main']['humidity'] + "%";
//             // var windSpeedValue = " " + data['wind']['speed'] + "mph";


//         })
//         } else {
//             alert("Error: " + response.statusText);
//         }
//     })

//     .catch(function(error) {
//     // if above function does not work
//     alert("Unable to connect");
//     });
// };

// pre-selected city buttons
var cityButtons = function(button) {

    var x = button.id;
    console.log(x);
    switch (x) {
        case '1':
            getCity("austin");
            cityCoord("austin");
            break;
        case '2':
            getCity("san&francisco");
            cityCoord("san&francisco");
            break;
        case '3':
            getCity("new&york");
            cityCoord("new&york");
            break;
        case '4':
            getCity("chicago");
            cityCoord("chicago");
            break; 
        case '5':
            getCity("seattle");
            cityCoord("seattle");
            break;
        case '6':
            getCity("denver");
            cityCoord("denver");
            break;        
        default:
            return false;                          
    }

}


var formSubmitHandler = function(event) {
    event.preventDefault();

    var city = inputValue.value;
    getCity(city);
    cityCoord(city);
    // get5Day(city);
}

button.addEventListener("click", formSubmitHandler);
parent.addEventListener('click', cityButtons);