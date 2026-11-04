# Geocaching → Google Maps

A userscript for [Tampermonkey](https://www.tampermonkey.net/) that puts a small Google Maps icon next to the GPS coordinates on geocaching.com cache pages. One click opens the location in Google Maps in a new tab.

## What it does

- Puts an icon next to the cache's main coordinates.
- Also works with corrected coordinates: if you change them through Geocaching, the icon immediately points to the new location.
- Recognises coordinates in the additional waypoints table and in the cache description.

Coordinates in the Geocaching format (`N 52° 22.123 E 004° 53.456`) are converted to decimal degrees and opened via `https://www.google.com/maps/search/?api=1&query=lat,lon`.

## Installation

1. Install the Tampermonkey extension in your browser.
2. Click [this install link](https://raw.githubusercontent.com/WorlockM/geocaching-gmaps/main/geocaching-gmaps.user.js). Tampermonkey will offer to install the script.
3. Open a cache page on geocaching.com.

Tampermonkey fetches new versions automatically through the `@updateURL` in the script.
