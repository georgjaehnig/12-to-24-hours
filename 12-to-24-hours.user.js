// ==UserScript==
// @name         12 to 24 hours
// @description  Replaces 11:45 PM to 23:45 on google.com/flights
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Georg Jähnig
// @match        https://www.google.com/flights*
// @grant        none
// @version      0.1
// @copyright    2018, Georg Jähnig
// @author       Georg Jähnig
// @license      MIT
// @include      *
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  function replace(matches) {

    // Get values.
    var hours = parseInt(matches[1]);
    var minutes = parseInt(matches[2]);
    var AMPM = matches[3];

    // Set hour.
    if (AMPM == "PM" && hours < 12) hours = hours + 12;
    if (AMPM == "AM" && hours == 12) hours = hours - 12;

    var sHours = hours.toString();
    var sMinutes = minutes.toString();

    // Append leading zeros.
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;

    // Replace with 24h format.
    var time24h = (sHours +':'+sMinutes);

    return time24h;
  }

  function checkMutation(mutation) {
    var matches = mutation.target.innerHTML.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/)
    if (matches) {
      mutation.target.innerHTML = replace(matches);
    }
  }

  var mutationObserver = new MutationObserver(function(mutations) {
    mutations.forEach(checkMutation);
  });

  mutationObserver.observe(document.documentElement, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true
  });

})();
