window.onload = () => {
    const map = new L.map("map", {
        center: [-6, -60],
        zoom: 5
    });
    const layerOptions = {
        maxZoom: 7
    };
    const customOption1 = L.Control.extend({
        options: {
            position: "bottomcenter"
        },

        onAdd: function(map) {
            let container = L.DomUtil.get("option1");
            container.onclick = () => {
                document.getElementById("testContent").innerHTML =
                    "This is description for Option 1";
                document.getElementById("descriptions").style.display = "block";
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
                document.getElementById("testContent").innerHTML =
                    "You selected Option 2";
                document.getElementById("descriptions").style.display = "block";
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
};
