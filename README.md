# Geocaching → Google Maps

Een userscript voor [Tampermonkey](https://www.tampermonkey.net/) dat op cachepagina's van geocaching.com een klein Google Maps-icoontje naast de GPS-coördinaten zet. Eén klik en de locatie opent in Google Maps in een nieuw tabblad.

## Wat het doet

- Zet een icoontje naast de hoofdcoördinaten van de cache.
- Werkt ook met gecorrigeerde coördinaten: past je ze aan via Geocaching, dan wijst het icoontje direct naar de nieuwe locatie.
- Herkent coördinaten in de tabel met extra waypoints en in de cachebeschrijving.

Coördinaten in het Geocaching-formaat (`N 52° 22.123 E 004° 53.456`) worden omgerekend naar decimale graden en geopend via `https://www.google.com/maps/search/?api=1&query=lat,lon`.

## Installatie

1. Installeer de Tampermonkey-extensie in je browser.
2. Klik op [deze installatielink](https://raw.githubusercontent.com/WorlockM/geocaching-gmaps/main/geocaching-gmaps.user.js). Tampermonkey biedt dan aan het script te installeren.
3. Open een cachepagina op geocaching.com.

Tampermonkey haalt nieuwe versies automatisch op via de `@updateURL` in het script.
