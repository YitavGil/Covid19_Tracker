
continentsList = ['americas', 'africa', 'europe', 'asia'];
let countriesMap = {}; //map where key is continent name and value is list of strings with the names of the countries
covidPerContinentMap = {}; //map where key is continent name and value is CovidData object
covidPerCountryMap = {}; //map where key is country name and value is CovidData object
const global = document.getElementById('global');
const asia = document.getElementById('asia');
const america = document.getElementById('america');
const europe = document.getElementById('europe');
const africa = document.getElementById('africa');
const covidCountryStats = document.getElementById('stats-container');
const getChart = document.getElementById('chart-container');
const picklistElem = document.getElementById('countries');

class CovidData {
    constructor(name, code, continent, confirmed, deaths, recovered, critical) {
        this.name = name;
        this.code = code;
        this.continent = continent;
        this.confirmed = confirmed;
        this.deaths = deaths;
        this.recovered = recovered;
        this.critical = critical;
    }
}

//buttons
global.addEventListener('click', globalData)
asia.addEventListener('click', function (){getApi('asia')})
america.addEventListener('click', function (){getApi('americas')})
europe.addEventListener('click', function (){getApi('europe')})
africa.addEventListener('click', function (){getApi('africa')})
picklistElem.addEventListener('change',onChangeCoutriesPicklist)
covidCountryStats.style.display = 'none';


async function onChangeCoutriesPicklist(event){ //Display covid stats for the chosen country
    getChart.style.display = 'none';
    covidCountryStats.style.display = 'flex';
    const pickedCountry = countriesMap[globalContinent].find((country) => country.code == event.target.value);
    const covidData = await getCovidApi(pickedCountry.code)
    console.log(covidData)
    updateStats('stats-confirmed',covidData.confirmed);
    updateStats('stats-critical',covidData.critical);
    updateStats('stats-deaths',covidData.deaths);
    updateStats('stats-recovered',covidData.recovered);
}
function showDetails(countryCode) {
    console.log(countryCode)
    const covidDetails = getCovidApi(countryCode)
}

//Fetch API

//Showing global data
function globalData(){
    continentsList.forEach(continent => getApi(continent))
    
}

const proxy = 'https://api.codetabs.com/v1/proxy/?quest=' //Passing the cors

        let getApiRunning = false; //Prevent user from sending multiple requests
async function getApi(continent) {
    if(getApiRunning == true) {
        return;
    }
    const countries = [];
    try {
        showLoader()
        getApiRunning = true
        const countriesApi = await axios.get(
            `${proxy}https://restcountries.herokuapp.com/api/v1/region/${continent}`);
            
            picklistElem.innerHTML = '';        
            countriesApi.data.forEach((country) => {
                // console.log(country)
                const option = document.createElement('option');
                option.value = country.cca2;
                option.innerHTML = country.name.common;
                picklistElem.appendChild(option);
                countries.push(new CovidData(country.name.common, country.cca2))
            });
            // console.log(countries)
            countriesMap[continent] = countries;
            for(let i = 0; i<countries.length; i++){
             const covidData = await getCovidApi(countries[i].code)
             countries[i].covidData = covidData
            }
            console.log(countries)
            drawChart(continent)
            // getCovidData(countries)
            hideLoader();
    } catch (error) {
        console.log(error)
    }

    function fetchAll(countries) {
        const countriesCodes = countries.map((country) => country.code)
    }

    getApiRunning = false;
};

async function getCovidApi(code) {
    const covidByCountrie = await axios.get(`${proxy}http://corona-api.com/countries/${code}`)
    // console.log(covidByCountrie)
    const country = {};
    country.confirmed = covidByCountrie.data.data.latest_data.confirmed
    country.critical = covidByCountrie.data.data.latest_data.critical
    country.deaths = covidByCountrie.data.data.latest_data.deaths
    country.recovered = covidByCountrie.data.data.latest_data.recovered;
    return country;

}


var globalContinent;
const confirmedCases  = document.getElementById('confirmed');
const deathCases = document.getElementById('deaths')
const criticalCases = document.getElementById('critical')
const recoveredCases = document.getElementById('recovered')


confirmedCases.addEventListener('click', function () {drawChart( globalContinent, 'confirmed', 'Confirmed Cases')});
deathCases.addEventListener('click', function () {drawChart( globalContinent, 'deaths', 'Deaths')});
criticalCases.addEventListener('click', function () {drawChart( globalContinent, 'critical', 'Critical Cases')});
recoveredCases.addEventListener('click', function () {drawChart( globalContinent, 'recovered', 'Recovered')});
console.log(deathCases)
//Chart
let myChart;

function drawChart(continent, dataSet, label) {
    globalContinent = continent
    if(myChart) {
        myChart.destroy();
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
       type: 'line',
       data: {
           labels: countriesMap[continent].map((c) => c.name),
           datasets: [{
               label,
               data: countriesMap[continent].map((c) => c.covidData[dataSet]),
               backgroundColor: [
                   'rgba(255, 99, 132, 0.2)',
                   'rgba(54, 162, 235, 0.2)',
                   'rgba(255, 206, 86, 0.2)',
                   'rgba(75, 192, 192, 0.2)',
                   'rgba(153, 102, 255, 0.2)',
                   'rgba(255, 159, 64, 0.2)'
               ],
               borderColor: [
                   'rgba(255, 99, 132, 1)',
                   'rgba(54, 162, 235, 1)',
                   'rgba(255, 206, 86, 1)',
                   'rgba(75, 192, 192, 1)',
                   'rgba(153, 102, 255, 1)',
                   'rgba(255, 159, 64, 1)'
               ],
               borderWidth: 1,
               fill: false
           }]
       },
       options: {
           responsive: true,
           maintainAspectRatio: false,
           scales: {
               y: {
                   beginAtZero: true
               }
           }
       }
   });
}



function showLoader() {
    const loader = document.getElementById('loading')
    loader.style.display = 'block';
}


function hideLoader() {
    const loader = document.getElementById('loading')
    loader.style.display = 'none';
}


const statsConfirmed = document.getElementById('stats-confirmed')
const statsDeaths = document.getElementById('stats-deaths')
const statsCritical = document.getElementById('stats-critical')
const statsRecovered = document.getElementById('stats-recovered')

function updateStats (id,value) {
    const container = document.getElementById(id);
    if(container) container.innerHTML = value;

}