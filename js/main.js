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

// In user-results section, listen for final stop selection and display results
events.addEventListener('stopData', (event) => {
    const resultElement = document.querySelector('#user-results-contents');
    const resultData = event.detail.data;
    
    // Clear previous results
    resultElement.innerHTML = '';
    
    if (resultData.features.length === 0 | resultData.features.length > 1) {
        resultElement.textContent = `Please make a valid selection using the drop-down menus above.`;
        return;
    }
    
    // Pull out relevant fields from the result
    const resultsFields = resultData.features[0].properties;
    const routeId = resultsFields.route_id;
    const tripHeadsign = resultsFields.trip_headsign;
    const weekPeriod = resultsFields.week_period;
    const timeOfDay = resultsFields.time_of_day;
    const stopName = resultsFields.stop_name;
    const arrivalsBeforeCuts = resultsFields.arrivals_before_cuts;
    const arrivalsDuringCuts = resultsFields.arrivals_during_cuts;
    const arrivalsChange = resultsFields.percent_change;
    const waitTimeDifference = resultsFields.expected_wait_time_difference;

    // Some derived calculations for display
    const arrivalsChangePercent = (arrivalsChange >= 0) ? `an increase of ${Math.round(arrivalsChange * 100)}%` : `a decrease of ${Math.abs(Math.round(arrivalsChange * 100))}%`;
    const waitTimeDifferenceText = (waitTimeDifference >= 0) ? `${waitTimeDifference} minutes longer` : `${Math.abs(waitTimeDifference)} minutes shorter`;
    
    // Display the results
    resultElement.innerHTML = 
        `<p>For your trip <i>(Route ${routeId} going towards ${tripHeadsign} during ${weekPeriod}s starting at ${stopName}</i>),
        an average of <b>${arrivalsBeforeCuts}</b> buses came in the ${timeOfDay} before the August 2025 service cuts.</p>

        <p>However, during the cuts, an average of <b>${arrivalsDuringCuts}</b> buses came, <b>${arrivalsChangePercent}</b> from the pre-cut average.
        This meant that on average you waited <b>${waitTimeDifferenceText}</b> for your bus during the period of the service cuts.</p>`;
    
});
