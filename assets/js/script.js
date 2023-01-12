let API_KEY = "cd449ce8a0596130f95722331fe56ab4"

function sidebarBtn(i) {
    var searchValue = $(`#city-list${i}`).attr("value");
    fetchBySearch(searchValue);
}

function searchbarBtn() {
    var searchValue = $("#searchInput").val();
    fetchBySearch(searchValue);
}

function fetchBySearch(searchValue) {
    let fetchByName = `http://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=1&lang=en&appid=${API_KEY}`
    fetch(fetchByName)
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log(data);
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
                            $(`#temp${i}`).html(`temp: ${temp} C`);
                            // set the wind
                            let wind = data.daily[i].wind_speed;
                            $(`#wind${i}`).html(`wind: ${wind} km/h`);
                            // set the humidity
                            let humidity = data.daily[i].humidity;
                            $(`#humidity${i}`).html(`humdity: ${humidity}%`);
                            // saving city's forecast to local storage
                            let cityForecast = {
                                date: unixFormat,
                                icon: iconSrc,
                                temp: temp,
                                wind: wind,
                                humidity: humidity,
                            }
                            localStorage.setItem(`searchedCityForecast${i}`, JSON.stringify(cityForecast));
                        }
                        // saving city name to local storage
                        let searchedCityName = {
                            name: searchValue,
                        }
                        localStorage.setItem("cityName", JSON.stringify(searchedCityName));
                        // this page reload is to ensure that the new city name gets added to the sidebar list
                        location.reload(true);
                    })
                // getting searched cities from local storage, creating an array, adding new city to the array, and then setting in local storage again for sidebar list
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
            $(`#temp${i}`).html(`temp: ${city.temp} C`);
            // set the wind
            $(`#wind${i}`).html(`wind: ${city.wind} km/h`);
            // set the humidity
            $(`#humidity${i}`).html(`humdity: ${city.humidity}%`);
        }
    }
}

function storedCities() {
    // getting searched cities from local storage, creating an array, and creating button elements for sidebar list
    const searchedCities = JSON.parse(localStorage.getItem("searchedCityList")) || [];

    for (i = 0; i < searchedCities.length; i++) {
        $("#cityList").append('<li><button class="cityListBtn" id=' + `city-list${i}` + ' type="button" value=' + searchedCities[i] + ' onclick="sidebarBtn(' + i + ')">' + searchedCities[i] + '</button></li>');
        // value='+`${searchedCities[i]}`+'
        // DONT ADD TO LIST IF VALUE IS BLANK
    }
}

// call on page reload
currentCitySearch();
storedCities();