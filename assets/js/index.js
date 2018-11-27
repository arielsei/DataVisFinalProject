let option1Selected = true;
let option2Selected = false;
let sliderElement;

window.onload = () => {
    const maxBounds = [
        [13.390290, -16.332470], //Southwest
        [-59.450451, -109.474930]  //Northeast
    ];
    const map = new L.map("map", {
        center: [-12.8, -69.5],
        zoom: 9,
        maxBounds: maxBounds,
        maxBoundsViscosity: 1.0
    });
    const layerOptions = {
        maxZoom: 12,
        minZoom: 5
    };
    const customOption1 = L.Control.extend({
        options: {
            position: "bottomcenter"
        },

        onAdd: function(map) {
            let container = L.DomUtil.get("option1");
            container.onclick = () => {
                option1Selected = !option1Selected;

                if (option1Selected)
                    document
                        .getElementById("option1")
                        .classList.add("selected");
                else
                    document
                        .getElementById("option1")
                        .classList.remove("selected");
                setPopupContent();
            };
            return container;
        }
    });
    const customOption2 = L.Control.extend({
        options: {
            position: "bottomcenter"
        },

        onAdd: function(map) {
            let container = L.DomUtil.get("option2");

            container.onclick = () => {
                option2Selected = !option2Selected;
                if (option2Selected)
                    document
                        .getElementById("option2")
                        .classList.add("selected");
                else
                    document
                        .getElementById("option2")
                        .classList.remove("selected");

                setPopupContent();
            };
            return container;
        }
    });
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        layerOptions
    ).addTo(map);
    option1 = L.DomUtil.get("option1");
    option2 = L.DomUtil.get("option2");
    const corners = map._controlCorners;
    const container = map._controlContainer;
    corners["bottomcenter"] = L.DomUtil.create(
        "div",
        "leaflet-bottom leaflet-horizontal-center",
        container
    );
    map.addControl(new customOption2());
    map.addControl(new customOption1());
    document.getElementById("option1").classList.add("selected");
    setPopupContent();

    L.TopoJSON = L.GeoJSON.extend({  
        addData: function(jsonData) {    
          if (jsonData.type === 'Topology') {
            for (key in jsonData.objects) {
              geojson = topojson.feature(jsonData, jsonData.objects[key]);
              L.GeoJSON.prototype.addData.call(this, geojson);
            }
          }    
          else {
            L.GeoJSON.prototype.addData.call(this, jsonData);
          }
        }  
      });
    const topoLayer = new L.TopoJSON();

    readJsonFile("assets/data/mineria_1985.geojson.json", function(text){
        var data = JSON.parse(text);
        topoLayer.addData(data);
        topoLayer.addTo(map);
    });

    // readJsonFile("assets/data/geojson/mineria_short.geojson", function(text){
    //     console.log(text);
    //     var data = JSON.parse(text);
    //     console.log(data);
    //     L.geoJSON(data).addTo(map);
    // });
    initializeSlider();
};

function setPopupContent() {
    if (option1Selected && option2Selected) {
        document.getElementById("descriptions").style.display = "block";
        document.getElementById("testContent").innerHTML =
            "This is description for both selected";
    } else if (option1Selected) {
        document.getElementById("descriptions").style.display = "block";

        document.getElementById("testContent").innerHTML =
            "This is description for Option 1";
    } else if (option2Selected) {
        document.getElementById("descriptions").style.display = "block";
        document.getElementById("testContent").innerHTML =
            "This is description for Option 2";
    } else {
        document.getElementById("descriptions").style.display = "none";
    }
}

function readJsonFile(filename, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", filename, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function initializeSlider() {
    sliderElement = document.getElementById('slider');
		noUiSlider.create(sliderElement, {
			start: 1985,
			step: 8,
			range: {
				min: 1985,
				max: 2017
			}
        });
    sliderElement.noUiSlider.on('update', function( values ) {
        console.log(values);
    });
}