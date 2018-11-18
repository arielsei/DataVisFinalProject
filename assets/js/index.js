let option1Selected = true;
let option2Selected = false;

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
};

function setPopupContent() {
    console.log("test");
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
