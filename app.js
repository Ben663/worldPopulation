
const continents = ["America", "Africa", "Asia", "Europe", "Oceania"]
let worldObj = {};
const AmericaBtn = document.querySelector('.america');
const AfricaBtn = document.querySelector('.africa');
const AsiaBtn = document.querySelector('.asia');
const EuropeBtn = document.querySelector('.europe');
const OceaniaBtn = document.querySelector('.oceania');
const btnsContainer = document.querySelector('.continentBtn');
const citeisBtnsContainer = document.querySelector('.citeisBtnsContainer');
const cityButton = document.querySelector('.citeisBtnsContainer');
const title = document.querySelector('title');

const fetchData = async (url) => {
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};
const getCountriesData = async () => {
    for (let i = 0; i < continents.length; i++) {
        const continentName = continents[i];
        const currentRegion = await fetchData(`https://restcountries.com/v3.1/region/${continents[i]}`);
        Object.assign(worldObj, { [continentName]: [] })
        for (let j = 0; j < currentRegion.length; j++) {
            if (currentRegion[j].name.common) { }
            const countryCommonName = currentRegion[j].name.common;
            const countryOfficialName = currentRegion[j].name.common;
            const countryPopulation = currentRegion[j].population;
            const flag = currentRegion[j].flags;
            const neighbors = (currentRegion[j].borders !== undefined ? currentRegion[j].borders.length : 0);
            fillObject(worldObj[continentName], countryOfficialName, countryCommonName, countryPopulation, neighbors, flag, continentName);
        }
    }
};
function fillObject(arr, offName, commonName, pop, neighbors, flag, continent) {
    arr.push({
        commonName: commonName,
        OfficialName: offName,
        population: pop,
        flag: flag,
        neighbors: neighbors,
        continent: continent
    })
};
const fetchDataForcountry = async (country) => {
    try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/population/cities/filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'limit': 35,
                'order': "asc",
                'orderBy': "name",
                'country': country,
            }),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};
async function checkCommonOrOfficial(obj) {
    const data = await fetchDataForcountry(obj.CommonName);
    if (data.error) {
        const response = await fetchDataForcountry(obj.Officialname);
        return response;
    }
    return data;
};
function createAndAppendCanvas() {
    const div = document.querySelector('.myChartContainer');
    div.replaceChildren('');
    const canvas = document.createElement('canvas');
    canvas.id = 'myChart';
    div.appendChild(canvas);
};
Chart.defaults.color = '#38598b';
function createChart(labels, newData) {
    createAndAppendCanvas();
    const ctx = document.getElementById('myChart');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'population',
                data: newData,
                backgroundColor: 'rgb(242, 214, 165,0.8)',
                borderColor: '#777',
                borderWidth: 1
            }]
        },
        Option: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};
function bulidCityBtn (arr) {
    citeisBtnsContainer.replaceChildren('');
    arr.forEach((el,index) => {
        const button = document.createElement('button');
        button.classList = 'CiteisBtns city';
        button.setAttribute('data-id', index);
        button.setAttribute('data-country', el.commonName);
        button.setAttribute('data-continent',el.continent);
        button.textContent = el.CommonName;
        citeisBtnsContainer.appendChild(button);
    });
};
async function handleCiteisEvents (event) {
    const btn = event.target.getAttribute('data-id');
    const btnContinent = event.target.getAttribute('data-continent');
    const res = await checkCommonOrOfficial(worldObj[btnContinent][btn]);
    if (res.data) {
        title.textContent = 'World Population'
        const labels = res.data.map((el) => {
            return el.city
        });
        const population = res.data.map((el) => {
            return el.populationCounts[0].value
        });
        createChart(labels,population);
        return;
    }
    title.textContent = 'Data Undefined !!!'
};
function handleEvents (event) {
    title.textContent = 'World Population'
    const labels = worldObj[event.target.textContent].map(el => el.CommonName);
    const population = worldObj[event.target.textContent].map(el => el.population);
    createChart(labels,population);
    bulidCityBtn(worldObj[event.target.textContent]);
};
function start (params) {
    getCountriesData();
    btnsContainer.addEventListener('click', handleEvents);
    cityButton.addEventListener('click', handleCiteisEvents);
};
start();




