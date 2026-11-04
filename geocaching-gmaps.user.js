// ==UserScript==
// @name         Geocaching → Google Maps
// @namespace    https://github.com/WorlockM/geocaching-gmaps
// @version      1.0.3
// @description  Adds a clickable icon next to GPS coordinates on geocaching.com that opens the location in Google Maps.
// @match        https://www.geocaching.com/geocache/*
// @match        https://www.geocaching.com/seek/cache_details.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=maps.google.com
// @homepageURL  https://github.com/WorlockM/geocaching-gmaps
// @supportURL   https://github.com/WorlockM/geocaching-gmaps/issues
// @license      MIT
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // Recognises the Geocaching format "N 52° 22.123 E 004° 53.456" (degrees + decimal minutes).
  const COORD_SOURCE =
    "([NS])\\s*(\\d{1,2})\\s*°\\s*(\\d{1,2}(?:[.,]\\d+)?)\\s*['′]?\\s*,?\\s*" +
    "([EWO])\\s*(\\d{1,3})\\s*°\\s*(\\d{1,2}(?:[.,]\\d+)?)\\s*['′]?";

  // Parts of the page that can contain coordinates in addition to the main coordinates.
  const EXTRA_ROOTS = [
    '#ctl00_ContentBody_Waypoints',
    '#ctl00_ContentBody_ShortDescription',
    '#ctl00_ContentBody_LongDescription',
  ];

  const PIN_SVG =
    '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">' +
    '<path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>' +
    '<circle fill="#fff" cx="12" cy="9" r="2.6"/></svg>';

  function toDecimal(hemisphere, degrees, minutes) {
    const value = parseInt(degrees, 10) + parseFloat(minutes.replace(',', '.')) / 60;
    return /[SW]/i.test(hemisphere) ? -value : value;
  }

  function mapsUrl(match) {
    const lat = toDecimal(match[1], match[2], match[3]).toFixed(6);
    const lon = toDecimal(match[4], match[5], match[6]).toFixed(6);
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
  }

  function createIcon(url) {
    const link = document.createElement('a');
    link.className = 'gcgm-link';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.title = 'Open in Google Maps';
    link.innerHTML = PIN_SVG;
    if (url) link.href = url;
    // Prevents the click from also opening Geocaching's coordinates popup.
    link.addEventListener('click', (e) => e.stopPropagation());
    return link;
  }

  function addStyles() {
    const style = document.createElement('style');
    style.textContent =
      '.gcgm-link{display:inline-flex;align-items:center;vertical-align:middle;' +
      'margin-left:6px;line-height:0;text-decoration:none;cursor:pointer}' +
      '.gcgm-link:hover svg{transform:scale(1.2)}' +
      '.gcgm-link svg{transition:transform .1s}';
    document.head.appendChild(style);
  }

  // Main coordinates: the icon goes next to #uxLatLon and follows modified
  // (corrected) coordinates as soon as the user enters them.
  function handleMainCoords() {
    const el = document.getElementById('uxLatLon');
    if (!el) return;

    let link = null;
    const update = () => {
      const match = new RegExp(COORD_SOURCE, 'i').exec(el.textContent);
      if (!match) {
        if (link) link.hidden = true;
        return;
      }
      if (!link) {
        link = createIcon();
        el.insertAdjacentElement('afterend', link);
      }
      link.href = mapsUrl(match);
      link.hidden = false;
    };

    update();
    new MutationObserver(update).observe(el, { childList: true, characterData: true, subtree: true });
  }

  function linkifyTextNode(node) {
    const text = node.nodeValue;
    const re = new RegExp(COORD_SOURCE, 'gi');
    const fragment = document.createDocumentFragment();
    let last = 0;
    let match;

    while ((match = re.exec(text)) !== null) {
      fragment.appendChild(document.createTextNode(text.slice(last, match.index)));
      const wrapper = document.createElement('span');
      wrapper.className = 'gcgm-done';
      wrapper.textContent = match[0];
      wrapper.appendChild(createIcon(mapsUrl(match)));
      fragment.appendChild(wrapper);
      last = re.lastIndex;
    }
    fragment.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(fragment, node);
  }

  function linkifyIn(root) {
    const test = new RegExp(COORD_SOURCE, 'i');
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.closest('a, script, style, textarea, .gcgm-done, #uxLatLon')) {
          return NodeFilter.FILTER_REJECT;
        }
        return test.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      },
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(linkifyTextNode);
  }

  addStyles();
  handleMainCoords();
  EXTRA_ROOTS.forEach((selector) => {
    const root = document.querySelector(selector);
    if (root) linkifyIn(root);
  });
})();
