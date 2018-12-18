let sliderElement;
let firstLoad = true;
let topoLayer;
let map;
let resizeTimeout;
const introHeight = 1000;
const blockHeight = 350;
let currentBlock = 0;
const highlights = [
    null,
    {
        lat: -66.40414471383308,
        long: -10.418888019117534,
        zoom: 10,
        year: 1985
    },
    {
        lat: -66.90414471383308,
        long: -10.218888019117534,
        zoom: 11,
        year: 1993
    },
    {
        lat: -66.00414471383308,
        long: -10.818888019117534,
        zoom: 12,
        year: 2001
    },
    {
        lat: -67.20414471383308,
        long: -11.118888019117534,
        zoom: 8,
        year: 2009
    },
    {
        lat: -65.99414471383308,
        long: -10.018888019117534,
        zoom: 7,
        year: 2017
    }
];

window.onload = () => {
    const maxBounds = [
        [13.39029, -16.33247], //Southwest
        [-59.450451, -109.47493] //Northeast
    ];
    map = new L.map("map", {
        center: [-12.8, -69.5],
        zoom: 9,
        maxBounds: maxBounds,
        maxBoundsViscosity: 1.0
    });
    const layerOptions = {
        maxZoom: 14,
        minZoom: 6
    };
    const customOption1 = L.Control.extend({
        options: {
            position: "leftMiddle"
        },

        onAdd: function (map) {
            let container = L.DomUtil.get("option1");
            container.onclick = () => {
                console.log("TODO LINK TO MINING TYPE")
            };
            return container;
        }
    });
    const customOption2 = L.Control.extend({
        options: {
            position: "leftMiddle"
        },

        onAdd: function (map) {
            let container = L.DomUtil.get("option2");

            container.onclick = () => {
                console.log("TODO LINK TO MINING TYPE")

            };
            return container;
        }
    });
    L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        layerOptions
    ).addTo(map);
    option1 = L.DomUtil.get("option1");
    option2 = L.DomUtil.get("option2");
    const corners = map._controlCorners;
    const container = map._controlContainer;
    corners["leftMiddle"] = L.DomUtil.create(
        "div",
        "leaflet-vertical-center leaflet-horizontal-left",
        container
    );
    map.addControl(new customOption1());
    map.addControl(new customOption2());

    L.TopoJSON = L.GeoJSON.extend({
        addData: function (jsonData) {
            if (jsonData.type === "Topology") {
                for (key in jsonData.objects) {
                    geojson = topojson.feature(jsonData, jsonData.objects[key]);
                    L.GeoJSON.prototype.addData.call(this, geojson);
                }
            } else {
                L.GeoJSON.prototype.addData.call(this, jsonData);
            }
        }
    });
    topoLayer = new L.TopoJSON();
    document
        .getElementById("storyTelling")
        .addEventListener("scroll", handleScroll);

    loadMapFiles();

    // readJsonFile("assets/data/simplified_grouped_mineria_1985.geojson", function(text){
    //     console.log(text);
    //     var data = JSON.parse(text);
    //     console.log(data);
    //     L.geoJSON(data).addTo(map);
    // });
    initializeSlider();
    loadVisualization();
};

function readJsonFile(filename, callback) {
    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", filename, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    };
    rawFile.send(null);
}

function initializeSlider() {
    sliderElement = document.getElementById("slider");
    noUiSlider.create(sliderElement, {
        start: 2017,
        step: 8,
        range: {
            min: 1985,
            max: 2017
        },
        // For Scale
        pips: {
            mode: "count",
            values: 5,
            density: 100,
            format: wNumb({
                decimals: 0
            })
        }
    });
    sliderElement.noUiSlider.on("update", onSliderUpdate);
}

function onSliderUpdate(values) {
    if (firstLoad) {
        firstLoad = false;
    } else {
        const newValue = parseInt(values[0]);
        fileName = "";
        switch (newValue) {
            case 1985:
                topoLayer[0].addTo(map);
                // topoLayer[1].addTo(map);
                // topoLayer[2].addTo(map);
                // topoLayer[3].addTo(map);
                // topoLayer[4].addTo(map);
                // map.removeLayer(topoLayer[0]);
                map.removeLayer(topoLayer[1]);
                map.removeLayer(topoLayer[2]);
                map.removeLayer(topoLayer[3]);
                map.removeLayer(topoLayer[4]);
                break;
            case 1993:
                // topoLayer[0].addTo(map);
                topoLayer[1].addTo(map);
                // topoLayer[2].addTo(map);
                // topoLayer[3].addTo(map);
                // topoLayer[4].addTo(map);
                map.removeLayer(topoLayer[0]);
                // map.removeLayer(topoLayer[1]);
                map.removeLayer(topoLayer[2]);
                map.removeLayer(topoLayer[3]);
                map.removeLayer(topoLayer[4]);
                break;
            case 2001:
                // topoLayer[0].addTo(map);
                topoLayer[1].addTo(map);
                topoLayer[2].addTo(map);
                // topoLayer[3].addTo(map);
                // topoLayer[4].addTo(map);
                map.removeLayer(topoLayer[0]);
                // map.removeLayer(topoLayer[1]);
                // map.removeLayer(topoLayer[2]);
                map.removeLayer(topoLayer[3]);
                map.removeLayer(topoLayer[4]);
                break;
            case 2009:
                // topoLayer[0].addTo(map);
                topoLayer[1].addTo(map);
                topoLayer[2].addTo(map);
                topoLayer[3].addTo(map);
                // topoLayer[4].addTo(map);
                map.removeLayer(topoLayer[0]);
                // map.removeLayer(topoLayer[1]);
                // map.removeLayer(topoLayer[2]);
                // map.removeLayer(topoLayer[3]);
                map.removeLayer(topoLayer[4]);
                break;
            case 2017:
                // topoLayer[0].addTo(map);
                topoLayer[1].addTo(map);
                topoLayer[2].addTo(map);
                topoLayer[3].addTo(map);
                topoLayer[4].addTo(map);
                map.removeLayer(topoLayer[0]);
                // map.removeLayer(topoLayer[1]);
                // map.removeLayer(topoLayer[2]);
                // map.removeLayer(topoLayer[3]);
                // map.removeLayer(topoLayer[4]);
                break;
        }
    }
}

function loadMapFiles() {
    readJsonFile("assets/data/grouped_mineria_1985.json", function (text) {
        let data = JSON.parse(text);
        topoLayer[0] = new L.TopoJSON();
        topoLayer[0].addData(data);
        topoLayer[0].eachLayer(handleLayer);
    });
    readJsonFile("assets/data/grouped_mineria_1985-1993.json", function (text) {
        let data = JSON.parse(text);
        topoLayer[1] = new L.TopoJSON();
        topoLayer[1].addData(data);
        topoLayer[1].eachLayer(handleLayer);
        topoLayer[1].addTo(map);
    });
    readJsonFile("assets/data/grouped_mineria_1993-2001.json", function (text) {
        let data = JSON.parse(text);
        topoLayer[2] = new L.TopoJSON();
        topoLayer[2].addData(data);
        topoLayer[2].eachLayer(handleLayer);
        topoLayer[2].addTo(map);
    });
    readJsonFile("assets/data/grouped_mineria_2001-2009.json", function (text) {
        let data = JSON.parse(text);
        topoLayer[3] = new L.TopoJSON();
        topoLayer[3].addData(data);
        topoLayer[3].eachLayer(handleLayer);
        topoLayer[3].addTo(map);
    });
    readJsonFile("assets/data/grouped_mineria_2009-2017.json", function (text) {
        let data = JSON.parse(text);
        topoLayer[4] = new L.TopoJSON();
        topoLayer[4].addData(data);
        topoLayer[4].eachLayer(handleLayer);
        topoLayer[4].addTo(map);
    });
}

function handleLayer(layer) {
    let colorOfLayer;
    let fillOpacity;
    switch (layer.feature.properties.MiningType) {
        case "HM":
            switch (layer.feature.properties.Sector) {
                case "Huepetuhe":
                    colorOfLayer = "#77070B";
                    fillOpacity = 0;
                    break;
                case "SmallMines": {
                    colorOfLayer = "#FFC000"; //nada
                    fillOpacity = 0;
                    break;
                }
                case "Delta": {
                    colorOfLayer = "#FFFF00"; // nada
                    fillOpacity = 0;
                    break;
                }
                case "Pampa": {
                    colorOfLayer = "#00B050";
                    fillOpacity = 0;
                    break;
                }
            }
            break;
        case "SP":
            switch (layer.feature.properties.Sector) {
                case "Huepetuhe":
                    colorOfLayer = "#002060"; // nada
                    fillOpacity = 0;
                    break;
                case "SmallMines": {
                    colorOfLayer = "#7030A0"; // nada
                    fillOpacity = 0;
                    break;
                }
                case "Delta": {
                    colorOfLayer = "#808080"; //nada
                    fillOpacity = 0;
                    break;
                }
                case "Pampa": {
                    colorOfLayer = "#007AAE";
                    fillOpacity = 1;
                    break;
                }
            }
            break;
        default:
            colorOfLayer = "#000000";
            fillOpacity = 1;
    }
    layer.setStyle({
        color: colorOfLayer
        // Uncomment this line to see only the ones with fillOpacity = 1
        // fillOpacity: fillOpacity,
        // weight: 0
    });
}

function handleScroll(event) {
    const scroll = event.srcElement.scrollTop;
    let blockScrolling = scroll - introHeight;

    if (
        scroll ==
        event.srcElement.scrollHeight - event.srcElement.clientHeight
    ) {
        blockScrolling = highlights.length - 1;
    } else {
        if (blockScrolling < 0) {
            blockScrolling = 0;
        } else {
            blockScrolling = parseInt(blockScrolling / blockHeight) + 1;
        }
    }
    if (blockScrolling != currentBlock) {
        if (highlights[blockScrolling]) {
            map.flyTo(
                [
                    highlights[blockScrolling].long,
                    highlights[blockScrolling].lat
                ],
                highlights[blockScrolling].zoom
            );
            // Move to the corresponding year
            sliderElement.noUiSlider.set(highlights[blockScrolling].year);
        }
        elements = document.getElementsByClassName("story-container");
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove("inFocus");
        }
        document
            .getElementById("container" + blockScrolling)
            .classList.add("inFocus");
        currentBlock = blockScrolling;
    }
}
