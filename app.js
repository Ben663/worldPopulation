
const continentsArr = ["Africa", "Americas", "Asia", "Europe", "Oceania"]
const worldObj = {}

const fetchData = async (url) => {
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

async function fetchDataForCountry(array) {
    let arr = [];
    for (let country of array) {
        arr.push(fetchData(`https://restcountries.com/v3.1/region/${country}`));
    }
    const res = await Promise.all(arr);
    return res;
};
async function setObj() {
    ((await fetchDataForCountry(continentsArr)).forEach((el, index) => {
        worldObj[continentsArr[index]] = el
    }));
    console.log(worldObj);
};
async function arrObj() {
    await setObj()
    for (let continent of continentsArr) {
        worldObj[continent].map((el, index) => {
            const { name, population, flag, borders, continents, flags } = el
            let common = name.common;
            let official = name.official;
            worldObj[continent][index] = { name: { common, official }, population, continents, flags, borders }
        })
    }
}
arrObj();


const fetchDataForcity = async (country) => {
    try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/population/cities/filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'limit': 20,
                'order': "asc",
                'orderBy': "populationCounts",
                'country': country,
            }),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};
