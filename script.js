import appFuncs from "./app.js";
import app from "./app.js";


const contintsSelect = document.querySelector('.contintsSelect');
const countryBtns = document.querySelector('.countryBtns');
const mainChart = document.querySelector('.chart');
const allCountry = document.querySelector('.allCountry');
let currentContry;


function setEvents() {
    contintsSelect.addEventListener('click', continentSelect)
    addGlobalEventListener('click', '.countryBtn', getCitiesByOfficialOrCommonEventHandler)
};

function continentSelect(el) {
    allCountry.classList.toggle('hidden')
    currentContry = el.target.innerText
    drawChart(countriesNamesArrMarker(true), popByNamesArrMarker(), currentContry)
};
function createNewBtn(array, appendingParent, className) {
    //appendingParent.replaceChildren('')
    array.forEach((el, index) => {
        let newBtn = document.createElement('button');
        newBtn.setAttribute('data-index', index);
        newBtn.classList.add('btn', `${className}Btn`);
        newBtn.innerText = el;
        //appendingParent.appendChild(newBtn);
    });
};

function createAndAppendCanvas() {
    mainChart.replaceChildren('');
    let newChart = document.createElement('canvas');
    newChart.id = 'newChart';
    mainChart.appendChild(newChart)
    return document.getElementById('newChart');
};

function countriesNamesArrMarker(bool = false) {
    const labels = appFuncs.worldObj[currentContry].map((country) => {
        return country.name.common
    });
    bool ? createNewBtn(labels, countryBtns, 'country') : null
    return labels;
};
function popByNamesArrMarker() {
    const populationData = appFuncs.worldObj[currentContry].map((country) => {
        return country.population
    });
    return populationData
};
function drawChart(labelsArr, populationArr, title) {
    const x = createAndAppendCanvas()
    x.getContext('2d');
    const myChart = new myChart(x, {
        type: 'bar',
        data: {
            labels: labelsArr,
            datasets: [{
                label: 'population',
                data: populationArr,
                backgroundColor:
                    'rgba(75, 192, 192, 0.2)',
                borderColor:
                    'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        Option: {
            plugins: {
                title: {
                    display: true,
                    Text: title,
                    fontSize: 50
                }
            },
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });
};

function getCitiesArr(resData) {
    let names = resData.data.map((city) => {
        return city.city;
    });
    return names;
};

function getCitiesPopArr(resData) {
    let pop = resData.data.map((city, index) => {
        return city.populationCounts[0].value
    });
    return pop;
};

async function getCitiesByOfficialOrCommonEventHandler(el) {
    try {
        const res = await appFuncs.fetchDataForcountry(appFuncs.worldObj[currentContry][e.target.getAttribute('data-index')].name.common)
        if (res.error) {
            const resTwo = await appFuncs.fetchDataForcountry(appFuncs.worldObj[currentContry][e.target.getAttribute('data-index')].name.official)
            drawChart(getCitiesArr(resTwo), getCitiesPopArr(resTwo))
        }
        drawChart(getCitiesArr(res), getCitiesPopArr(res), el.target.innerText)
        return res.data
    } catch (error) {
        console.log(error);
    }
};

function addGlobalEventListener (type, selector, callback) {
    document.addEventListener(type, (el) => {
        if (el.target.matches(selector)) callback(el);
    });
};

createNewBtn(appFuncs.continentsArr,continentSelect, 'continent');


setEvents();


export default {createNewBtn, setEvents}












