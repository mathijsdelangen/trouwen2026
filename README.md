# Mathijs & Chantal — Ons verhaal

Een statische herinneringspagina met de trouwfoto's, een plek voor de trouwfilm en een subtiele teller sinds de trouwdag. De pagina gebruikt alleen HTML, CSS en JavaScript en kan op iedere statische hosting worden gepubliceerd.

## Inhoud aanpassen

- De trouwdatum en het moment waarop de teller begint staan bovenaan in `script.js` als `WEDDING_DATE`.
- Voeg foto's toe aan `assets/fotos_moments/` en pas de galerij in `index.html` aan; foto's staan op opnamedatum en vloeien speels van boven naar beneden.
- Klik op een galerijfoto om de volledige foto te bekijken; Escape, de sluitknop of naast de foto klikken sluit de viewer.
- Blader in de viewer met de pijltjestoetsen of de knoppen op het beeld; na de laatste foto begint de galerij weer vooraan.
- Vervang het filmvlak in `index.html` later door een video-element of een ingesloten video.
- De fotograafvermelding en Instagram-link staan direct bij de fotogalerij.

## Vormgeving

De website gebruikt het vaste kleurthema Zand en de foto-indeling Raster. Bezoekers kunnen deze keuzes niet aanpassen.

De galerij behoudt de oorspronkelijke beeldverhoudingen en snijdt geen foto's af. De verspringende indeling volgt de chronologische volgorde zo veel mogelijk van boven naar beneden, zonder gekleurde fotovakken.

De keuzes staan als `data-theme` en `data-layout` op het `<html>`-element in `index.html`.

## Publiceren

Upload de bestanden en de map `assets/` naar een statische host, zoals GitHub Pages, Netlify of Vercel.
