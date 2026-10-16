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
    });
  });
}

updateAnniversary();
window.setInterval(updateAnniversary, MINUTE_IN_MS);
initStyleChoices();
