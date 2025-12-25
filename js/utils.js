/*
* Read geojson file
* @param {string} filename - The name of the geojson file to load
* @return {object} The FeatureCollection as loaded from the data file
*/
export async function getGeojsonCollection(filename) {
    const resp = await fetch(`data/${filename}`);
    const data = await resp.json();
    return data;
}

/**
* Find all unique values of a specified property in GeoJSON features.
*
* @param {object} geojsonData The GeoJSON object (FeatureCollection).
* @param {string} propertyName The name of the property to check.
* @returns {Array<any>} An array of unique values.
*/
function getUniquePropertyValues(geojsonData, propertyName) {
    if (!geojsonData || !Array.isArray(geojsonData.features)) {
        throw new Error("Invalid GeoJSON FeatureCollection");
    }
    
    const values = geojsonData.features
    .map(feature => feature.properties?.[propertyName])
    .filter(value => value !== undefined && value !== null);
    
    return [...new Set(values)];
}

/**
* Populate options of a drop-down menu
*
* @param {string} dropdownId - The id of the dropdown element
* @param {object} geojsonData - The GeoJSON FeatureCollection with data
* @param {string} propertyName - The property name which contains option values
* @param {string} defaultText - The text to display for the default option
*/
export function populateDropdownOptions(dropdownId, geojsonData, propertyName, defaultText = 'Please choose an option') {
    // Get the dropdown element
    const dropdownElement = document.getElementById(dropdownId);
    // Clear existing options
    dropdownElement.innerHTML = '';
    // Turn disabled off
    dropdownElement.disabled = false;
    
    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = defaultText;
    dropdownElement.appendChild(defaultOption);
    
    // Create array of unique property values
    const optionsArray = getUniquePropertyValues(geojsonData, propertyName);
    
    // Populate new options
    optionsArray.forEach(value => {
        const option = document.createElement('option');     
        option.value = value;
        option.textContent = value;
        dropdownElement.appendChild(option);
    });
}

/**
* Listen for changes in a dropdown menu and dispatch an event containing the value of the selection
* @param {string} dropdownId - The id of the dropdown element
* @param {string} eventName - The name of the event to dispatch on change
* @param {EventTarget} eventBus - The event bus to dispatch the event on
*/
export function setupDropdownChangeListener(dropdownId, eventName, eventBus) {
    const dropdownElement = document.getElementById(dropdownId);
    dropdownElement.addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        const customEvent = new CustomEvent(eventName, { detail: { value: selectedValue } });
        eventBus.dispatchEvent(customEvent);
        // Logging for debugging
        console.log(`Dropdown change listener set up for #${dropdownId}, dispatching event: ${eventName} with value: ${dropdownElement.value}`);
    });
}

/**
* Filter a geoJSON FeatureCollection so that only features with specified property value are included
* @param {object} geojsonData - The GeoJSON FeatureCollection
* @param {string} propertyName - The property name to filter on
* @param {any} propertyValue - The property value to match
* @returns {object} - A new GeoJSON FeatureCollection with filtered features
*/
function filterGeojsonByProperty(geojsonData, propertyName, propertyValue) {
    if (!geojsonData || !Array.isArray(geojsonData.features)) {
        throw new Error("Invalid GeoJSON FeatureCollection");
    }
    
    const filteredFeatures = geojsonData.features.filter(feature => 
        feature.properties?.[propertyName] === propertyValue
    );
    
    const returnData = {
        type: "FeatureCollection",
        features: filteredFeatures
    };
    
    return returnData;
}

/**
* When a specified event is received on the event bus, filter the provided geoJSON data
* by the property and value specified in the event detail, then populate a new dropdown menu
* with the filtered data. Then, dispatch the filtered data to the event bus using a specified name.
* 
* @param {EventTarget} eventBus - The event bus to listen on
* @param {object} geojsonData - The GeoJSON FeatureCollection to filter
* @param {string} eventName - The name of the event to listen for
* @param {string} filteringPropertyName - The property name to filter on
* @param {string} filteredPropertyName - The property name to be filtered
* @param {string} dropdownId - The id of the dropdown element
* @param {string} defaultText - The text to display for the default option
*/
export function cascadeDropdown(eventBus, geojsonData, eventName, filteringPropertyName, filteredPropertyName, dropdownId, defaultText) {
    eventBus.addEventListener(eventName, (event) => {
        const propertyValue = event.detail.value;
        const filteredData = filterGeojsonByProperty(geojsonData, filteringPropertyName, propertyValue, event);
        populateDropdownOptions(dropdownId, filteredData, filteredPropertyName, defaultText);
        // Logging for debugging
        console.log(`New dropdown populated for: ${dropdownId}, filtering by ${filteringPropertyName}=${propertyValue}`);
    });
}


