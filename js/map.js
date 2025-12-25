/**
* Initialize the Leaflet map with base layers and controls
* @param {HTMLElement} mapElement - DOM element to attach the map to
* @param {Object} initialData - GeoJSON data to display on the map
*/
async function initMap(mapElement, initialData) {
    // Initialize the Leaflet map
    map = L.map(mapElement, {
        center: [39.95, -75.19], // Philadelphia coordinates
        zoom: 10,
    });
    
    // Add base tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);
    
    // Load initial data  
    const initialLayer = L.geoJSON(initialData, {
        style: feature => {
           return { color: '#be9b0eff' };
        }
    });
    initialLayer.addTo(map);
    map.fitBounds(initialLayer.getBounds());
}

export { initMap };