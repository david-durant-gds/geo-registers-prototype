/* global $ */
/* global GOVUK */

// Warn about using the kit in production
if (
  window.sessionStorage && window.sessionStorage.getItem('prototypeWarning') !== 'false' &&
  window.console && window.console.info
) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
  window.sessionStorage.setItem('prototypeWarning', true)
}

$(document).ready(function () {
  // Use GOV.UK shim-links-with-button-role.js to trigger a link styled to look like a button,
  // with role="button" when the space key is pressed.
  GOVUK.shimLinksWithButtonRole.init()

  // Show and hide toggled content
  // Where .multiple-choice uses the data-target attribute
  // to toggle hidden content
  var showHideContent = new GOVUK.ShowHideContent()
  showHideContent.init()

  // DD
  // "length" is used to check for existance
  if ($("#registers-with-boundaries-select").length) {
    url = dataUrl + "request=boundaryList";
    loadSelect('registers-with-boundaries-select', url);
    if ($("#boundary-entries-select").length) {
      $("#registers-with-boundaries-select").change(updateBoundaryEntriesSelect);
    }
  }
  
  // DD
  // "length" is used to check for existance
  if ($("#registers-with-locations-select").length) {
    url = dataUrl + "request=locationList"
    loadSelect('registers-with-locations-select', url);
    if ($("#location-entries-select").length) {
      $("#registers-with-locations-select").change(updateLocationEntriesSelect);
    }
  }
    
})

// DD
// Use test data
var MOCK_DATA = true;

// DD
// Data supply root URL
var dataUrl = "http://get.data.com/getData?";

// DD
function loadSelect(element, fromLocation) {

  // Convert to using test data if needed
  if (MOCK_DATA) {
    fromLocation = convertToMockDataLocation(fromLocation);
  }

  var jqxhr = $.get(fromLocation, { element: element })
  .done(function(data) {
    var $el = $("#" + element);
    $el.empty();
    splitData = data.split("\n");
    $.each(splitData, function(loopNumber, value) {
      $el.append($("<option></option>").attr("value", value).text(value));
    });

    // Cascade update the boundary entries if that select exists (checks for empty to stop recursive loop)
    boundaryEntriesSelect = $("#boundary-entries-select").find(":selected").text();
    registersWithBoundariesSelect = $("#registers-with-boundaries-select").find(":selected").text();
    if ( ($("#boundary-entries-select").length) && (!(boundaryEntriesSelect)) && (registersWithBoundariesSelect != "")) {
      updateBoundaryEntriesSelect();
    }
    
    // Cascade update the location entries if that select exists (checks for empty to stop recursive loop)
    locationEntriesSelect = $("#location-entries-select").find(":selected").text();
    registersWithLocationsSelect = $("#registers-with-locations-select").find(":selected").text();
    if ( ($("#location-entries-select").length) && (!(locationEntriesSelect)) && (registersWithLocationsSelect != "")) {
      updateLocationEntriesSelect();
    }

  });
}

// DD
// What to do when registers-with-boundaries-select is changed
function updateBoundaryEntriesSelect() {
  boundaryRegisterValue = $("#registers-with-boundaries-select").find(":selected").text()
  url = dataUrl + "request=boundaryEntries&boundaryType=" + boundaryRegisterValue;
  loadSelect('boundary-entries-select', url);
}

// DD
// What to do when registers-with-locations-select is changed
function updateLocationEntriesSelect() {
  locationRegisterValue = $("#registers-with-locations-select").find(":selected").text()
  url = dataUrl + "request=locationEntries&locationType=" + locationRegisterValue;
  loadSelect('location-entries-select', url);
}

// DD
// Request SQL-mediated data
function doRequest(request) {

  // Get data if it exists
  var boundariesSelect;
  if ($("#registers-with-boundaries-select").length) {
    boundariesSelect = $("#registers-with-boundaries-select").find(":selected").text();
  }

  var locationsSelect;
  if ($("#registers-with-locations-select").length) {
    locationsSelect = $("#registers-with-locations-select").find(":selected").text();
  }

  var boundaryEntries;
  if ($("#boundary-entries-select").length) {
    boundaryEntries = $("#boundary-entries-select").find(":selected").text();
  }

  var locationEntries;
  if ($("#location-entries-select").length) {
    locationEntries = $("#location-entries-select").find(":selected").text();
  }

  var latitude;
  if ($("#latitude").length) {
    latitude = $("#latitude").val();
  }

  var longitude;
  if ($("#longitude").length) {
    longitude = $("#longitude").val();
  }

  // Okay, first we build the request
  url = dataUrl + "request=" + request;
  switch(request) {
    case "get-boundary":
      url = url + "&boundaryType=" + boundariesSelect + "&boundaryEntry=" + boundaryEntries;
      break;
    case "get-location":
      url = url + "&locationType=" + locationsSelect + "&locationEntry=" + locationEntries;
      break;
    case "boundary-for-point":
      url = url + "&boundaryType=" + boundariesSelect + "&locationType=" + locationsSelect + "&locationEntry=" + locationEntries;
      break;
    case "locations-within-boundary":
      url = url + "&boundaryType=" + boundariesSelect + "&locationType=" + locationsSelect;
      break;
    case "nearest-loc-to-point":
      url = url + "&locationType=" + locationsSelect + "&boundaryType=" + boundariesSelect + "&latitude=" + latitude + "&longitude=" + longitude;
      break;
    case "nearest-loc-in-boundary":
      break;
  }

  // Next we update the SQL command box
  commandUrl = url + "&command=true";
  // Convert to using test data if needed
  if (MOCK_DATA) {
    commandUrl = convertToMockDataLocation(commandUrl);
  }
  var jqxhr = $.get(commandUrl)
  .done(function(data) {
    $("#command-box").val(data);
  });

  // Finally we get and then display the map data
  if (kmlLayer != null) {
    kmlLayer.setMap(null);
  }

  // Cache busting addition to URL
  kmlUrl = url + "&kml=true";
  // Convert to using test data if needed
  if (MOCK_DATA) {
    kmlUrl = convertToMockDataLocation(kmlUrl);
  }
  // This may keep adding new layers which we then hide which probably leaks memory like a sieve but this is only a hacky prototype...
  kmlLayer = new google.maps.KmlLayer({
    url: kmlUrl,
    map: map,
    zIndex: 0
  });  
  
  
// FOR DEBUGGING - START
//    url: 'http://localhost:3000/public/mock-data/local-authority_birmingham-metropolitan-district.kml?dummy=1492710501646361',
//    url: 'https://geo-registers-prototype.herokuapp.com/public/mock-data/local-authority_birmingham-metropolitan-district.kml?dummy=1492710501646361',
//    url: 'https://enigmatic-dusk-83533.herokuapp.com/data/local-authority_birmingham-metropolitan-district.kml?dummy=1492711151082', 
//        google.maps.event.addListener(kmlLayer, 'status_changed', function () {
//           console.log('KML load: ' + kmlLayer.getStatus());
//           if (kmlLayer.getStatus() != 'OK') {
//             $('#maps-error').text('[' + kmlLayer.getStatus() + '] Google Maps could not load the layer. Please try again later.');
//           }
//        });       
// FOR DEBUGGING - END


}

// DD
// Map init
var map;
var kmlLayer = null;
function initMap() {
  // Don't know why this is being called on pages without a map div but...
  if (window.location.pathname.includes("map")) {    
    var greenwich = {lat: 51.4826, lng: 0.0077};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 6,
      center: greenwich
    });
  }
}

// DD
// Utility function to map from proper data url to mock data location
function convertToMockDataLocation(url) {
  console.log("Data URL : " + url);
  mockDataLocation = "/public/mock-data/";
  
  urlParams = new URLSearchParams(url.substring(url.indexOf("?")+1));
  mockDataLocation = mockDataLocation + urlParams.get('request');

  if (urlParams.get('boundaryType')) {
     mockDataLocation = mockDataLocation + "_" + urlParams.get('boundaryType');
  }
  
  if (urlParams.get('boundaryEntry')) {
     mockDataLocation = mockDataLocation + "_" + urlParams.get('boundaryEntry');
  }
  
  if (urlParams.get('locationType')) {
     mockDataLocation = mockDataLocation + "_" + urlParams.get('locationType');
  }

  if (urlParams.get('locationEntry')) {
     mockDataLocation = mockDataLocation + "_" + urlParams.get('locationEntry');
  }

  if (urlParams.get('command')) {
     mockDataLocation = mockDataLocation + "_command";
  }

  if (urlParams.get('kml')) {
     mockDataLocation = mockDataLocation + "_kml";
  }

  console.log("Mocked URL : " + mockDataLocation);
  return mockDataLocation;
}

// DD
// Utility function to log remote file to console
function logRemoteFile(url) {
  console.log("URL : " + url);
  var jqxhr = $.get(urrl)
  .done(function(data) {
    console.log("Data : " + data);
  });
}