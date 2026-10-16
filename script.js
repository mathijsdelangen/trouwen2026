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

function initStyleChoices() {
  document.querySelectorAll("[data-theme-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      document.documentElement.dataset.theme = button.dataset.themeChoice;
      document.querySelectorAll("[data-theme-choice]").forEach((choice) => {
        choice.setAttribute("aria-pressed", String(choice === button));
      });
    });
  });

  document.querySelectorAll("[data-layout-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      document.documentElement.dataset.layout = button.dataset.layoutChoice;
      document.querySelectorAll("[data-layout-choice]").forEach((choice) => {
        choice.setAttribute("aria-pressed", String(choice === button));
      });
      updateGalleryLayout();
    });
  });
}

function initPhotoViewer() {
  const gallery = document.querySelector(".gallery");
  const photoViewer = document.getElementById("photo-viewer");
  const viewerImage = document.getElementById("photo-viewer-image");
  const closeButton = document.getElementById("photo-viewer-close");
  const previousButton = document.getElementById("photo-viewer-previous");
  const nextButton = document.getElementById("photo-viewer-next");
  const photoLinks = Array.from(gallery.querySelectorAll(".gallery__link"));
  let currentPhotoIndex = 0;

  function showPhoto(index) {
    currentPhotoIndex = (index + photoLinks.length) % photoLinks.length;
    const link = photoLinks[currentPhotoIndex];
    const image = link.querySelector("img");

    viewerImage.width = Number(image.getAttribute("width"));
    viewerImage.height = Number(image.getAttribute("height"));
    viewerImage.src = link.href;
    viewerImage.alt = image.alt;
    photoViewer.setAttribute(
      "aria-label",
      `Foto ${currentPhotoIndex + 1} van ${photoLinks.length}: ${image.alt}`
    );
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

updateAnniversary();
window.setInterval(updateAnniversary, MINUTE_IN_MS);
initStyleChoices();
initPhotoViewer();
updateGalleryLayout();
window.addEventListener("resize", updateGalleryLayout);
