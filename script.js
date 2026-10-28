const WEDDING_DATE = new Date("2026-09-18T14:00:00+02:00");
const MINUTE_IN_MS = 60 * 1000;
const DAY_IN_MS = 24 * 60 * MINUTE_IN_MS;

function anniversaryAtYear(year) {
  return Date.UTC(
    year,
    WEDDING_DATE.getUTCMonth(),
    WEDDING_DATE.getUTCDate(),
    WEDDING_DATE.getUTCHours(),
    WEDDING_DATE.getUTCMinutes()
  );
}

function updateAnniversary() {
  const now = new Date();
  const elapsedYears = document.getElementById("elapsed-years");
  const yearUnit = document.getElementById("year-unit");

  if (now < WEDDING_DATE) {
    yearUnit.hidden = true;
    document.getElementById("elapsed-days").textContent = "0";
    document.getElementById("elapsed-hours").textContent = "0";
    document.getElementById("elapsed-minutes").textContent = "0";
    return;
  }

  let years = now.getUTCFullYear() - WEDDING_DATE.getUTCFullYear();
  let anniversary = anniversaryAtYear(WEDDING_DATE.getUTCFullYear() + years);

  if (now.getTime() < anniversary) {
    years -= 1;
    anniversary = anniversaryAtYear(WEDDING_DATE.getUTCFullYear() + years);
  }

  const elapsedMs = now.getTime() - anniversary;
  const elapsedDays = Math.floor(elapsedMs / DAY_IN_MS);
  const elapsedHours = Math.floor((elapsedMs % DAY_IN_MS) / (60 * MINUTE_IN_MS));
  const elapsedMinutes = Math.floor((elapsedMs % (60 * MINUTE_IN_MS)) / MINUTE_IN_MS);

  elapsedYears.textContent = String(years);
  yearUnit.hidden = years === 0;
  document.getElementById("elapsed-days").textContent = String(elapsedDays);
  document.getElementById("days-label").textContent = elapsedDays === 1 ? "dag" : "dagen";
  document.getElementById("elapsed-hours").textContent = String(elapsedHours);
  document.getElementById("elapsed-minutes").textContent = String(elapsedMinutes);
  document.getElementById("minutes-label").textContent =
    elapsedMinutes === 1 ? "minuut" : "minuten";
}

function updateGalleryLayout() {
    const gallery = document.querySelector(".gallery");
    if (!gallery) {
      return;
    }
    const galleryStyle = getComputedStyle(gallery);
    const columnCount = galleryStyle.gridTemplateColumns.trim().split(/\s+/).length;
    const columnGap = parseFloat(galleryStyle.columnGap);
    const rowHeight = parseFloat(galleryStyle.gridAutoRows);
    const rowGap = parseFloat(galleryStyle.rowGap);
    const columnWidth =
      (gallery.clientWidth - columnGap * (columnCount - 1)) / columnCount;

    if (columnWidth <= 0) {
      return;
    }

    gallery.querySelectorAll(".gallery__item").forEach((item) => {
      const image = item.querySelector("img");
      const imageWidth = Number(image.getAttribute("width"));
      const imageHeight = Number(image.getAttribute("height"));

      if (
        !Number.isFinite(imageWidth) ||
        !Number.isFinite(imageHeight) ||
        imageWidth <= 0 ||
        imageHeight <= 0
      ) {
        console.error(`Cannot lay out gallery image without dimensions: ${image.src}`);
        return;
      }

      const renderedHeight = (columnWidth * imageHeight) / imageWidth;
      const rowSpan = Math.ceil((renderedHeight + rowGap) / (rowHeight + rowGap));
      item.style.gridRowEnd = `span ${rowSpan}`;
    });
}

function initPhotoViewer(loadFullSize) {
  const gallery = document.querySelector(".gallery");
  const photoViewer = document.getElementById("photo-viewer");
  const viewerImage = document.getElementById("photo-viewer-image");
  const viewerStatus = document.getElementById("photo-viewer-status");
  const closeButton = document.getElementById("photo-viewer-close");
  const previousButton = document.getElementById("photo-viewer-previous");
  const nextButton = document.getElementById("photo-viewer-next");
  const photoLinks = Array.from(gallery.querySelectorAll(".gallery__link"));
  let currentPhotoIndex = 0;
  let photoRequestVersion = 0;

  async function showPhoto(index) {
    currentPhotoIndex = (index + photoLinks.length) % photoLinks.length;
    const requestedVersion = ++photoRequestVersion;
    const link = photoLinks[currentPhotoIndex];
    const image = link.querySelector("img");
    let fullSizeReady = false;

    viewerImage.width = Number(image.getAttribute("width"));
    viewerImage.height = Number(image.getAttribute("height"));
    viewerImage.alt = image.alt;
    viewerImage.setAttribute("aria-busy", "true");
    viewerStatus.textContent = "Foto laden...";
    viewerStatus.dataset.loading = "true";
    viewerStatus.hidden = false;
    if (image.getAttribute("src")) {
      viewerImage.src = image.src;
    } else {
      viewerImage.removeAttribute("src");
      loadFullSize(image, "thumbnails").then((url) => {
        if (photoRequestVersion === requestedVersion && !fullSizeReady) {
          viewerImage.src = url;
        }
      }).catch(() => {});
    }
    photoViewer.setAttribute(
      "aria-label",
      `Foto ${currentPhotoIndex + 1} van ${photoLinks.length}: ${image.alt}`
    );
    try {
      const displayUrl = await loadFullSize(image);
      const fullSizeImage = new Image();
      fullSizeImage.src = displayUrl;
      await fullSizeImage.decode();
      if (photoRequestVersion === requestedVersion) {
        fullSizeReady = true;
        viewerImage.src = displayUrl;
        viewerImage.setAttribute("aria-busy", "false");
        viewerStatus.dataset.loading = "false";
        viewerStatus.hidden = true;
      }
    } catch {
      if (photoRequestVersion === requestedVersion) {
        viewerImage.setAttribute("aria-busy", "false");
        viewerStatus.dataset.loading = "false";
        viewerStatus.textContent = "De scherpe foto kon niet worden geladen.";
      }
    }
  }

  gallery.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const link = event.target.closest(".gallery__link");
    if (!(link instanceof HTMLAnchorElement)) {
      return;
    }

    const index = photoLinks.indexOf(link);
    if (index === -1) {
      return;
    }

    event.preventDefault();
    showPhoto(index);
    photoViewer.showModal();
  });

  previousButton.addEventListener("click", () => {
    showPhoto(currentPhotoIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    showPhoto(currentPhotoIndex + 1);
  });

  closeButton.addEventListener("click", () => {
    photoViewer.close();
  });

  photoViewer.addEventListener("close", () => {
    photoRequestVersion++;
    viewerImage.setAttribute("aria-busy", "false");
    viewerStatus.hidden = true;
  });

  photoViewer.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      photoViewer.close();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPhoto(currentPhotoIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showPhoto(currentPhotoIndex + 1);
    }
  });

  photoViewer.addEventListener("click", (event) => {
    if (event.target === photoViewer) {
      photoViewer.close();
    }
  });
}

function initGalleryAccess() {
  const form = document.getElementById("gallery-access");
  const passwordInput = document.getElementById("gallery-password");
  const submitButton = form.querySelector("button");
  const status = document.getElementById("gallery-status");
  const template = document.getElementById("gallery-template");
  const lockButton = document.getElementById("gallery-lock");

  function photoVariantUrl(source, variant) {
    const url = new URL(source, document.baseURI);
    url.pathname = url.pathname.replace(/\/([^/]+)\.jpg$/i, `/${variant}/$1.webp`);
    return url.href;
  }

  lockButton.addEventListener("click", () => window.location.reload());

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const passwordBytes = new TextEncoder().encode(`gasten:${passwordInput.value}`);
    const authorization = `Basic ${btoa(String.fromCharCode(...passwordBytes))}`;
    passwordInput.value = "";
    submitButton.disabled = true;
    status.textContent = "Foto's laden...";

    async function fetchPhoto(url) {
      const response = await fetch(url, {
        headers: { Authorization: authorization },
        credentials: "omit",
        cache: "no-store"
      });
      if (response.status === 401) {
        throw new Error("Het wachtwoord klopt niet.");
      }
      if (!response.ok || !response.headers.get("Content-Type")?.startsWith("image/")) {
        throw new Error("De foto's zijn nu niet bereikbaar. Probeer het opnieuw.");
      }
      return response.blob();
    }

    try {
      const firstLink = template.content.querySelector(".gallery__link");
      const firstThumbnailUrl = photoVariantUrl(firstLink.getAttribute("href"), "thumbnails");
      const firstPhoto = await fetchPhoto(firstThumbnailUrl);
      const content = template.content.cloneNode(true);
      const images = Array.from(content.querySelectorAll(".gallery img"));
      const requests = new Map();
      images.forEach((image) => {
        image.removeAttribute("src");
        image.loading = "eager";
      });
      images[0].src = URL.createObjectURL(firstPhoto);
      requests.set(firstThumbnailUrl, Promise.resolve(images[0].src));

      function loadPhoto(url) {
        if (!requests.has(url)) {
          const request = fetchPhoto(url).then((photo) => URL.createObjectURL(photo));
          requests.set(url, request);
          request.catch(() => requests.delete(url));
        }
        return requests.get(url);
      }

      function loadImage(image) {
        return loadPhoto(photoVariantUrl(image.closest("a").href, "thumbnails")).then((url) => {
          image.src = url;
        });
      }

      document.getElementById("gallery-content").replaceChildren(content);
      form.hidden = true;
      lockButton.hidden = false;
      document.getElementById("trouwfilm").hidden = false;
      initPhotoViewer((image, variant = "display") => loadPhoto(photoVariantUrl(image.closest("a").href, variant)));
      updateGalleryLayout();

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            loadImage(entry.target).catch(() => {
              entry.target.alt = "Deze foto kon niet worden geladen.";
            });
          }
        });
      }, { rootMargin: "400px" });
      images.forEach((image) => observer.observe(image));
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : "Inloggen is niet gelukt.";
      passwordInput.focus();
    } finally {
      submitButton.disabled = false;
    }
  });
}

updateAnniversary();
window.setInterval(updateAnniversary, MINUTE_IN_MS);
initGalleryAccess();
updateGalleryLayout();
window.addEventListener("resize", updateGalleryLayout);
