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
    loadSelect('registers-with-boundaries-select', 'https://geo-registers-prototype.herokuapp.com/public/mock-data/registers-with-boundaries');
    if ($("#boundary-entries-select").length) {
      $("#registers-with-boundaries-select").change(updateBoundaryEntriesSelect);
    }
  }
  
  if ($("#registers-with-locations-select").length) {
    loadSelect('registers-with-locations-select', 'https://geo-registers-prototype.herokuapp.com/public/mock-data/registers-with-locations');
    if ($("#location-entries").length) {
      $("#registers-with-locations-select").change(updateLocationEntriesSelect);
    }
  }
  
})

// DD
function loadSelect(element, fromLocation) {
  var jqxhr = $.get(fromLocation, { element: element })
  .done(function(data) {
    var $el = $("#" + element);
    $el.empty();
    splitData = data.split("\n");
    $.each(splitData, function(loopNumber, value) {
      $el.append($("<option></option>").attr("value", value).text(value));
    });

    // Cascade update the boundary entries if that select exists (checks for empty to stop recursive loop)
    if ( ($("#boundary-entries-select").length) && (!($("#boundary-entries-select").find(":selected").text()))) {
      updateBoundaryEntriesSelect();
    }
    
    // Cascade update the location entries if that select exists (checks for empty to stop recursive loop)
    if ( ($("#location-entries").length) && (!($("#location-entries").find(":selected").text()))) {
      updateLocationEntriesSelect();
    }

  });
}

// DD
// What to do when registers-with-boundaries-select is changed
function updateBoundaryEntriesSelect() {
  boundaryRegisterValue = $("#registers-with-boundaries-select").find(":selected").text()
  url = "https://geo-registers-prototype.herokuapp.com/public/mock-data/" + boundaryRegisterValue;
  loadSelect('boundary-entries-select', url);
}

// DD
// What to do when registers-with-locations-select is changed
function updateLocationEntriesSelect() {
  locationRegisterValue = $("#registers-with-locations-select").find(":selected").text()
  url = "https://geo-registers-prototype.herokuapp.com/public/mock-data/" + locationRegisterValue;
  loadSelect('location-entries', url);
}

// DD
// Map init
var map;
var kmlBoundaryLayer = null;
var kmlLocationsLayer = null;
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
// Request SQL-mediated data
function doRequest(request) {
  // Okay, first we build the request
  url = "https://geo-registers-prototype.herokuapp.com/public/mock-data/";
  if (request == "get-boundary") {
    url = url + $("#registers-with-boundaries-select").find(":selected").text() + "_" + $("#boundary-entries-select").find(":selected").text();

alert(url);


  }

  // Next we update the SQL command box
  commandUrl = url + "_command";
  var jqxhr = $.get(commandUrl)
  .done(function(data) {
    $("#command-box").text(data);
  });

  // Finally we get and then display the map data

}