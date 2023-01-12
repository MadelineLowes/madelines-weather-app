let API_KEY = "cd449ce8a0596130f95722331fe56ab4"

function sidebarBtn(i) {
    var searchValue = $(`#city-list${i}`).attr("value");
    // call function with defined searchValue
    fetchBySearch(searchValue);
}

function searchbarBtn() {
    var searchValue = $("#searchInput").val();
    // call function with defined searchValue
    fetchBySearch(searchValue);
}

function fetchBySearch(searchValue) {
    let fetchByName = `http://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=1&lang=en&appid=${API_KEY}`
    fetch(fetchByName)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.length > 0) {
                let latitude = data[0].lat;
                let longitude = data[0].lon;
                const fetchByCoords = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

                fetch(fetchByCoords)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        $("#cityName").html(searchValue)
                        for (i = 0; i < 6; i++) {
                            // set the title
                            let date = data.daily[i].dt;
                            var unixFormat = dayjs.unix(date).format('MMM D, YYYY');
                            $(`#title${i}`).html(unixFormat);
                            // set the icon
                            let icon = data.daily[i].weather[0].icon;
                            let iconSrc = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                            $(`#icon${i}`).attr("src", `${iconSrc}`)
                            // set the temp
                            let temp = data.daily[i].temp.day;
                            $(`#temp${i}`).html(`Temp: ${temp} C`);
                            // set the wind
                            let wind = data.daily[i].wind_speed;
                            $(`#wind${i}`).html(`Wind: ${wind} km/h`);
                            // set the humidity
                            let humidity = data.daily[i].humidity;
                            $(`#humidity${i}`).html(`Humdity: ${humidity}%`);
                            // save city's forecast to local storage
                            let cityForecast = {
                                date: unixFormat,
                                icon: iconSrc,
                                temp: temp,
                                wind: wind,
                                humidity: humidity,
                            }
                            localStorage.setItem(`searchedCityForecast${i}`, JSON.stringify(cityForecast));
                        }
                        // save city name to local storage
                        let searchedCityName = {
                            name: searchValue,
                        }
                        localStorage.setItem("cityName", JSON.stringify(searchedCityName));
                        // this page reload is to ensure that the new city name gets added to the sidebar list
                        location.reload(true);
                    })
                // get searched cities from local storage, create an array, add new city to the array, and then set in local storage again for sidebar list
                var searchedCities = JSON.parse(localStorage.getItem("searchedCityList")) || [];

                // this is only executed if the searchValue doesn't already exist in local storage
                if (jQuery.inArray(searchValue, searchedCities) == "-1") {
                    searchedCities.push(searchValue);
                    // removing before setting so that items aren't duplicated
                    localStorage.removeItem("searchedCityList");
                    localStorage.setItem("searchedCityList", JSON.stringify(searchedCities));
                }
            } else {
                alert("please ensure your spelling is correct");
            }
        })
}

function currentCitySearch() {
    // on page reload, get current city forecast info from local storage
    const cityName = JSON.parse(localStorage.getItem("cityName"));

    if (cityName != null) {
        $("#cityName").html(cityName.name);

        for (i = 0; i < 6; i++) {
            const city = JSON.parse(localStorage.getItem(`searchedCityForecast${i}`));
            // set the title
            $(`#title${i}`).html(city.date);
            // set the icon
            $(`#icon${i}`).attr("src", city.icon)
            // set the temp
            $(`#temp${i}`).html(`Temp: ${city.temp} C`);
            // set the wind
            $(`#wind${i}`).html(`Wind: ${city.wind} km/h`);
            // set the humidity
            $(`#humidity${i}`).html(`Humdity: ${city.humidity}%`);
        }
    }
}

function storedCities() {
    // get searched cities from local storage, create an array, and create button elements for sidebar list
    const searchedCities = JSON.parse(localStorage.getItem("searchedCityList")) || [];

    for (i = 0; i < searchedCities.length; i++) {
        $("#cityList").append('<li><button class="cityListBtn" style="font-family: Merriweather, serif" id=' + `city-list${i}` + ' type="button" value="' + searchedCities[i] + '" onclick="sidebarBtn(' + i + ')">' + searchedCities[i] + '</button></li>');
    }
}

// call on page reload
currentCitySearch();
storedCities();