// Api Key
const API_KEY = "88019d70248bb4ce60a400e0cb528fee";  //88019d70248bb4ce60a400e0cb528fee


// Tab Switching
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const searchForm = document.querySelector("[data-searchForm]");

const grantAccessContainer = document.querySelector(".grant-location-container");
const loadingScreen = document.querySelector(".loading-container"); 
const userInfoContainer = document.querySelector(".user-info-container");

const notFound = document.querySelector('.error-Container');
const errorBtn = document.querySelector('[data-errorButton]');
const errorText = document.querySelector('[data-errorText]');
const errorImage = document.querySelector('[data-errorImg]');




// initial varisbles
let currentTab = userTab;
currentTab.classList.add("current-Tab");
getfromSessionStorage();


function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-Tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-Tab");

        // Check which TAb is Selected - search / your

        // If Search Form not contains active class then add  [Search Weather]
        if(!searchForm.classList.contains("active")){
            // search form conatainer is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //main pehle search wale tab pr tha, ab your weather tab visible karna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
          // now we are in weather tab , so we have display weather , so lets check local storage 
          // for containers, if we haved saved there
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener('click', ()=>{
   // pass clicked tab  as input parameter 
    switchTab(userTab);
});

searchTab.addEventListener('click', ()=>{
    // pass clicked tab  as input parameter 
     switchTab(searchTab);
 });

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // if local coordinate are not found
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
 }
async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;

    //make grannt container invisible

    grantAccessContainer.classList.remove("active");

    // make loader img visible
//-----------------------------------------------------------------------------HELPPPP---------------------//
    loadingScreen.classList.add("active");

    // call API

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        // if (!data.sys) {
        //     throw data;
        // }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(err){
        loadingScreen.classList.remove("active");
        notFound.classList.add('active');
        errorImage.style.display = 'none';
        errorText.innerText = `Error: ${err?.message}`;
        errorBtn.style.display = 'block';
        errorBtn.addEventListener("click", fetchWeatherInfo);
    }
}


//------------------------------------Render Function  for Render on UI-----------------------------------//

function renderWeatherInfo(weatherInfo){
    //Firstly fetch the neede data
    const cityName = document.querySelector("[data-cityName]");
    const countryFlag = document.querySelector("[data-countryIcon]");
    const description = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-clouds]");

    // now we fetch values from weather Info object and put it 
    cityName.innerText = weatherInfo?.name;
    countryFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`; 
    description.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity.toFixed(2)} %`;
    clouds.innerText = `${weatherInfo?.clouds?.all.toFixed(2)} %`;
};

//----------------------------------------------------------------------------------------------------------------------------//
// Now forr grant access container

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // grantAccessButton.style.display = 'none';
        alert("No geolocation Support available");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click',getLocation);


//----------------------------------------------------------------------------------------------------------------------------//
// Search for weather
 
const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessButton.classList.remove("active");
    notFound.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        // if (!data.sys) {
        //     throw data;
        // }
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data); 
    }
    catch(err){
        loadingContainer.classList.remove('active');
        userInfoContainer.classList.remove('active');
        notFound.classList.add('active');
        errorText.innerText = `${err?.message}`;
        errorBtn.style.display = "none";
    }
};



