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

De website draait als Dokku-app `trouwen` op `95.216.174.120`. De werkende HTTPS-url is https://trouwen.server.mathijsenchantal.nl/.

Voor regulier onderhoud heeft deployen met `git push` de voorkeur: de broncode, Dockerfile en websitebestanden horen dan bij dezelfde commit. De huidige deploy is via een op de server gebouwde Docker-image uitgevoerd. Dat was een praktische uitwijkroute vanwege de grote fotomap en de kleine `/tmp`-partitie, maar koppelt de live website niet aan een commit uit deze repository.

Onderstaande opdrachten zijn bedoeld voor PowerShell, vanuit de projectmap. Git, OpenSSH en een toegestane SSH-sleutel zijn vereist.

### Eenmalig voorbereiden voor git push

De repository bevat momenteel nog geen Dockerfile. Maak in de hoofdmap een bestand met de naam `Dockerfile` met deze inhoud; dit is dezelfde buildopzet die nu op de server staat:

```dockerfile
FROM nginx:stable-alpine

COPY index.html styles.css script.js /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80
```

Controleer de Dokku-SSH-toegang en voeg de remote toe:

```powershell
ssh dokku@95.216.174.120 apps:list
git remote add dokku dokku@95.216.174.120:trouwen
git remote -v
```

Dit staat los van `origin`, dat naar GitHub verwijst. Bestaat de remote `dokku` al, controleer dan het adres in plaats van hem opnieuw toe te voegen. Werkt SSH niet, laat dan eerst de publieke sleutel op de server voor Dokku registreren; deel nooit je private sleutel.

Commit de Dockerfile en alle bedoelde wijzigingen, inclusief gebruikte afbeeldingen en gegenereerde WebP-bestanden. Controleer voor het committen wat je hebt gestaged. Niet-gecommitte wijzigingen gaan niet mee met een git-deploy.

### Eerste overstap vanaf de image-deploy

Dokku verwacht voor deze app de remote branch `master`. De lokale branch mag anders heten: `HEAD:master` pusht de huidige commit naar die deploybranch.

De bestaande Dokku-repository is door `git:from-image` opgebouwd en heeft een andere geschiedenis dan deze repository. Daarom is bij deze eerste overstap bewust een geschiedenisvervanging nodig. Controleer dat je de huidige image-deploy wilt vervangen en voer de volgende opdrachten alleen uit als elke vorige opdracht is geslaagd:

```powershell
git fetch dokku master
$expected = git rev-parse refs/remotes/dokku/master
git push "--force-with-lease=refs/heads/master:$expected" dokku HEAD:master
```

De lease weigert de push als de serverbranch sinds de fetch is gewijzigd. Gebruik dit alleen voor de eerste migratie naar je eigen Git-geschiedenis, niet als standaard deployopdracht. Dit wijzigt niet de GitHub-remote.

Deze overstap is nog niet uitgevoerd of end-to-end getest. De image-deploy is nog steeds de actuele deploymethode. De server heeft slechts 464 MiB op `/tmp`; loopt de git-build tegen ruimtegebrek aan, los dan eerst de tijdelijke buildopslag op of gebruik de image-route hieronder. Ga niet blind bestanden opruimen of herhaaldelijk force-pushen.

### Volgende deploys

Na de eenmalige overstap:

```powershell
git status
git push dokku HEAD:master
```

Commit je wijzigingen eerst. Dokku bouwt met de Dockerfile en vervangt de draaiende container na geslaagde deploymentchecks. Een push naar `origin` publiceert alleen naar GitHub en deployt deze Dokku-app niet automatisch. Push desgewenst dezelfde commit apart naar GitHub.

### Bestaande image-route als fallback

De buildmap `/var/tmp/trouwen-deploy` op de server bevat al de Dockerfile en afbeeldingen. Voor wijzigingen aan HTML, CSS en JavaScript:

```powershell
scp index.html styles.css script.js root@95.216.174.120:/var/tmp/trouwen-deploy/
```

Upload bij gewijzigde afbeeldingen ook de assets:

```powershell
scp -r assets root@95.216.174.120:/var/tmp/trouwen-deploy/
```

Voer na een geslaagde upload de build en deploy uit:

```powershell
ssh root@95.216.174.120 'set -eu; cd /var/tmp; tag=manual-$(date +%Y%m%d%H%M%S); docker build -t trouwen-site:$tag /var/tmp/trouwen-deploy; dokku git:from-image trouwen trouwen-site:$tag; nginx -t'
```

Deze route uploadt werkbestanden, ook zonder commit. `scp` verwijdert geen oude bestanden uit de servermap. Wissel na de overstap niet ongemerkt terug naar `git:from-image`: daarmee krijgt de Dokku-repository opnieuw een afwijkende geschiedenis. Een volgende git-push kan dan weer een expliciete migratie vereisen.

### Controleren en beveiligen

Na elke deploy:

```powershell
curl.exe --fail --silent --show-error --output NUL https://trouwen.server.mathijsenchantal.nl/
curl.exe --silent --show-error --output NUL --write-out '%{http_code}' https://trouwen.server.mathijsenchantal.nl/assets/fotos_moments/display/MOMENTSToFocusOn-PREVIEW0001.webp
```

De homepage moet bereikbaar zijn; de tweede opdracht moet zonder login `401` teruggeven. Test daarnaast in de browser het inloggen, openen en bladeren van foto's en opnieuw afsluiten van de galerij. Bij problemen kun je de logs volgen met `ssh dokku@95.216.174.120 logs trouwen --tail`.

De fotobeveiliging zit in de nginx-configuratie op de host, niet in de Docker-image. De configuratie uit `deploy/nginx-auth.conf` staat op de server als `/home/dokku/trouwen/nginx.conf.d/auth.conf`. Het wachtwoordbestand staat uitsluitend op de server in `/etc/nginx/auth/trouwen.htpasswd`; neem het wachtwoord of dit bestand nooit op in Git of een Docker-image. TLS-certificaten worden ook op de server beheerd. Deze bestaande hostinstellingen blijven bij een normale app-deploy behouden, maar moeten bij een nieuwe server apart worden ingericht.

Een publieke GitHub-repository of een oude GitHub Pages-publicatie valt niet onder deze wachtwoordbeveiliging. Publiceer de privefoto's daar niet als ze uitsluitend via de beveiligde site toegankelijk mogen zijn.
