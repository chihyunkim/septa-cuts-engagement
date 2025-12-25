import * as utils from './utils.js';
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
utils.populateDropdownOptions('route-select', arrivalsAndStops, 'route_id', 'Please choose your route');
utils.setupDropdownChangeListener('route-select', 'routeSelected', events);

// Populate trip direction dropdown based on selected route
utils.cascadeDropdown(events, arrivalsAndStops, 'routeSelected', 'route_id', 'trip_headsign', 'direction-select', 'Please choose your trip direction');
utils.setupDropdownChangeListener('direction-select', 'directionSelected', events);
    
// Populate day of week dropdown based on previous selections
utils.cascadeDropdown(events, arrivalsAndStops, 'directionSelected', 'trip_headsign', 'week_period', 'weekday-select', 'Please choose your day of the week');
utils.setupDropdownChangeListener('weekday-select', 'weekdaySelected', events);

// Populate day of week dropdown based on previous selections
utils.cascadeDropdown(events, arrivalsAndStops, 'weekdaySelected', 'week_period', 'time_of_day', 'time-select', 'Please choose your time of day');
utils.setupDropdownChangeListener('time-select', 'timeSelected', events);

// Populate day of week dropdown based on previous selections
utils.cascadeDropdown(events, arrivalsAndStops, 'weekdaySelected', 'week_period', 'time_of_day', 'time-select', 'Please choose your time of day');
utils.setupDropdownChangeListener('time-select', 'timeSelected', events);

// Populate stop dropdown based on previous selections
utils.cascadeDropdown(events, arrivalsAndStops, 'timeSelected', 'time_of_day', 'stop_name', 'stop-select', 'Please choose your stop');
utils.setupDropdownChangeListener('stop-select', 'stopSelected', events);
