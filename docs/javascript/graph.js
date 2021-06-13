let graph = function () {
    let setValue = function (rankingJsonFile, countryName) {
        let country = rankingJsonFile.ranking.find(o => o.name === countryName);
        if (country === undefined) {
            return 0
        } else {
            return country.value
        }
    }
    let getRankingJsonFile = async function () {
        const rankingJsonFilePath = `ranking.json`;
        return await fetch(rankingJsonFilePath).then(response => response.json());
    }
    let getCountriesJsonFile = async function () {
        const rankingJsonFilePath = `./json/countries-50m.json`;
        return fetch(rankingJsonFilePath).then(response => response.json());
    }
    let main = async function () {
        const rankingJsonFile = await getRankingJsonFile();
        const countriesJsonFile = await getCountriesJsonFile();
        const countriesArray = ChartGeo.topojson.feature(countriesJsonFile, countriesJsonFile.objects.countries).features;
        new Chart(document.getElementById("canvas").getContext("2d"), {
            type: 'choropleth',
            data: {
                labels: countriesArray.map((d) => d.properties.name),
                datasets: [{
                    label: 'Countries',
                    data: countriesArray.map((d) => ({
                        feature: d,
                        value: setValue(rankingJsonFile, d.properties.name)
                    })),
                }]
            },
            options: {
                showOutline: true,
                showGraticule: true,
                plugins: {
                    legend: {
                        display: false
                    },
                },
                scales: {
                    xy: {
                        projection: 'equalEarth'
                    }
                }
            }
        });
    }
    return {
        main: main,
    };
}();
graph.main().then(() => {});
