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
    loadSelect('registers-with-boundaries-select', 'registers-with-boundaries.txt');
    if ($("#boundary-entries").length) {
      $("#registers-with-boundaries-select").change(updateBoundaryEntriesSelect);
    }
  }
  
})

// DD
function loadSelect(element, fromLocation) {
  var jqxhr = $.get("https://geo-registers-prototype.herokuapp.com/mock-data/" + fromLocation, { element: element })
  .done(function(data) {
    var $el = $("#" + element);
    $el.empty();
    splitData = data.split("\n");
      $.each(splitData, function(loopNumber, value) {
          $el.append($("<option></option>").attr("value", value).text(value));
        });
    }
}

// DD
// What to do when registers-with-boundaries-select is changed
function updateBoundaryEntriesSelect() {
}

// DD
// Map stuff
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