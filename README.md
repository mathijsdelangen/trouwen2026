# Trouwwebsite (one-pager)

Dit is een volledig statische website (HTML/CSS/JavaScript), dus je kunt dit hosten op bijna elke host zonder speciale serversoftware.

## Bestanden

- `index.html` – structuur en inhoud
- `styles.css` – opmaak + responsive design
- `script.js` – countdown + toegangscontrole
- `assets/ons-placeholder.svg` – tijdelijke foto

## Snelle aanpassingen

### 1) Wachtwoord aanpassen
Open `script.js` en wijzig:

```js
const SITE_PASSWORD = "liefde2026";
```

> Let op: dit is een simpele client-side bescherming (voldoende tegen toevallige bezoekers, niet tegen technische inspectie van broncode).

### 2) Kleuren aanpassen
Open `styles.css` en wijzig de CSS-variabelen bovenaan onder `:root`.

Of kies direct een van de ingebouwde palettes door in `index.html` het `data-theme` attribuut op `<html>` te wijzigen:

- `terragroen` (default)
- `salie-klei`
- `mos-zand`
- `eucalyptus-terracotta`

Voorbeeld:

```html
<html lang="nl" data-theme="salie-klei">
```

### 3) Foto vervangen
Plaats jullie foto in `assets/` en wijzig de `src` van de hero-afbeelding in `index.html`.

### 4) Inhoud aanpassen
- Locatie: sectie **Locatie**
- Planning: sectie **Dagplanning**
- FAQ: sectie **Veelgestelde vragen**
- Later foto's toevoegen: sectie **Foto's**

## Tijdlogica
De trouwdatum staat in `script.js`:

```js
const WEDDING_DATE = new Date("2026-09-18T14:00:00+02:00");
```

Voor de trouwdatum: countdown.
Na de trouwdatum: duur van het huwelijk sinds dat moment.

## Publiceren
Upload alle bestanden en mappen één-op-één naar je webhosting (of GitHub Pages / Netlify / Vercel static hosting).
