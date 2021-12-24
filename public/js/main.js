const cityName = document.getElementById('cityName');
const submitBtn = document.getElementById('submitBtn');

const city_name = document.getElementById('city_name');

const temp = document.getElementById('temp');
const temp_status = document.getElementById('temp_status');

const datahide = document.querySelector('.middle_layer');


const getInfo = async(event) => {
    event.preventDefault();
    let cityVal = cityName.value;

    // let url = `http://api.openweathermap.org/data/2.5/weather?q=pune&units&metric&appid=b14425a6554d189a2d7dc18a8e7d7263`

    if(cityVal === ""){
        city_name.innerText = `Plz write the name before search`;
    }else{
        try{
            let url = `http://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=metric&appid=1451a553e68340aba7bf71af49d837cb`;
            const response = await fetch(url);
            const data = await response.json();
            const arrData = [data];

            city_name.innerText = `${arrData[0].name}, ${arrData[0].sys.country}`;
            temp_real_val.innerText= arrData[0].main.temp;

            // temp.innerText = arrData[0].main.temp;
            // temp_status.innerText = arrData[0].weather[0].main;

            datahide.classList.remove('data_hide');
            console.log(datahide);
        }catch{
            city_name.innerText = `Plz enter the city name properly`;
            datahide.classList.add('data_hide');    
        }
    }
}

submitBtn.addEventListener('click', getInfo);