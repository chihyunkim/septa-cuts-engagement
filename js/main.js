import { getGeojsonCollection } from './utils.js';
import { initMap } from './map.js';

// Events in event bus:
// - userLocationAcquired: { detail: { lat, lng } }
const events = new EventTarget();

const mapElement = document.querySelector('#map');
const septaNetwork = await getGeojsonCollection('septa_routes.json');






initMap(mapElement, septaNetwork);





