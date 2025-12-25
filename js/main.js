import * as utils from './utils.js';
import * as dropdown from './dropdown.js';
import { initMap } from './map.js';

// Events in event bus:
// - userLocationAcquired: { detail: { lat, lng } }
const events = new EventTarget();

const mapElement = document.querySelector('#map');
const septaNetwork = await utils.getGeojsonCollection('septa_routes.json');

// Read routes JSON data
const arrivalsAndStops = await utils.getGeojsonCollection('arrivals_and_stops.json');

// Initialize map
initMap(mapElement, septaNetwork);

// Populate route dropdown and set up listener
dropdown.populateDropdown(events, arrivalsAndStops, 'route', 'route_id', 'Please choose your route');

// Populate trip direction dropdown based on selected route
dropdown.cascadeDropdown(events, 'routeData', 'direction', 'trip_headsign', 'Please choose your trip direction');

// Populate day of week dropdown based on previous selections
dropdown.cascadeDropdown(events, 'directionData', 'weekday', 'week_period', 'Please choose the day of the week');
    
// Populate day of week dropdown based on previous selections
dropdown.cascadeDropdown(events, 'weekdayData', 'time', 'time_of_day', 'Please choose your stop');

// Populate stop dropdown based on previous selections
dropdown.cascadeDropdown(events, 'timeData', 'stop', 'stop_name', 'Please choose your stop');
