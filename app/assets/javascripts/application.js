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
  
  // DD - for map stuff
  var map;
  var kmlBoundaryLayer = null;
  var kmlLocationsLayer = null;
  // If it's a page with a map we need to set it up
  if (window.location.pathname.includes("map")) {
  
alert("*sigh*");
  
    var greenwich = {lat: 51.4826, lng: 0.0077};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 6,
      center: greenwich
    });
  }
})
