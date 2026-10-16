# Mathijs & Chantal — Ons verhaal

Een statische herinneringspagina met de trouwfoto's, een plek voor de trouwfilm en een subtiele teller sinds de trouwdag. De pagina gebruikt alleen HTML, CSS en JavaScript en kan op iedere statische hosting worden gepubliceerd.

## Inhoud aanpassen

- De trouwdatum en het moment waarop de teller begint staan bovenaan in `script.js` als `WEDDING_DATE`.
- Voeg foto's toe aan `assets/fotos_moments/` en pas de galerij in `index.html` aan.
- Vervang het filmvlak in `index.html` later door een video-element of een ingesloten video.
- De fotograafvermelding en Instagram-link staan direct bij de fotogalerij.

## Vormgeving

Bezoekers kunnen de kleuren en foto-indeling op de pagina aanpassen:

- Kleuren: eucalyptus, zand, rozenhout en avond.
- Foto-indeling: mozaïek, raster en ruim.

Elke indeling behoudt de originele beeldverhouding van de foto's, zodat personen en details niet worden afgesneden.

De standaardkeuzes staan als `data-theme` en `data-layout` op het `<html>`-element in `index.html`. Alle beschikbare kleuren en indelingen zijn uitgewerkt in `styles.css`.

## Publiceren

Upload de bestanden en de map `assets/` naar een statische host, zoals GitHub Pages, Netlify of Vercel.
