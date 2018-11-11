
window.onload = () => {
    const map = new L.map('map', {
        center: [51.505, -0.09],
        zoom: 4
    }).addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));
};