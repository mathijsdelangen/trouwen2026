const WEDDING_DATE = new Date("2026-09-18T14:00:00+02:00");
const SITE_PASSWORD = "liefde2026"; // Pas dit aan naar jullie eigen wachtwoord.
const SESSION_KEY = "bruiloft_toegang";
const RSVP_EMAIL = "jullie@email.nl"; // Pas dit aan naar jullie e-mailadres.

const els = {
  title: document.getElementById("timer-title"),
  timezoneNote: document.getElementById("timezone-note"),
  countdownView: document.getElementById("countdown-view"),
  marriedView: document.getElementById("married-view"),
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  marriedYears: document.getElementById("married-years"),
  marriedDays: document.getElementById("married-days"),
  marriedHours: document.getElementById("married-hours"),
  marriedMinutes: document.getElementById("married-minutes"),
  accessForm: document.getElementById("access-form"),
  passwordInput: document.getElementById("wachtwoord"),
  feedback: document.getElementById("access-feedback"),
  privateContent: document.getElementById("private-content"),
  rsvpForm: document.getElementById("rsvp-form"),
  rsvpFeedback: document.getElementById("rsvp-feedback"),
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateTimer() {
  const now = new Date();
  const diffMs = WEDDING_DATE.getTime() - now.getTime();

  if (diffMs > 0) {
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    els.title.textContent = "Nog tot onze bruiloft";
    els.countdownView.classList.remove("hidden");
    els.marriedView.classList.add("hidden");

    els.days.textContent = String(days);
    els.hours.textContent = pad(hours);
    els.minutes.textContent = pad(minutes);
    els.seconds.textContent = pad(seconds);
    return;
  }

  const marriedMs = now.getTime() - WEDDING_DATE.getTime();
  const marriedTotalMinutes = Math.floor(marriedMs / (1000 * 60));
  const marriedTotalHours = Math.floor(marriedTotalMinutes / 60);
  const marriedTotalDays = Math.floor(marriedTotalHours / 24);

  const years = Math.floor(marriedTotalDays / 365.2425);
  const daysLeft = Math.floor(marriedTotalDays - years * 365.2425);
  const hoursLeft = marriedTotalHours % 24;
  const minutesLeft = marriedTotalMinutes % 60;

  els.title.textContent = "Getrouwd sinds";
  els.countdownView.classList.add("hidden");
  els.marriedView.classList.remove("hidden");

  els.marriedYears.textContent = String(years);
  els.marriedDays.textContent = String(daysLeft);
  els.marriedHours.textContent = pad(hoursLeft);
  els.marriedMinutes.textContent = pad(minutesLeft);
}

function showPrivateContent() {
  els.privateContent.classList.remove("hidden");
  els.feedback.textContent = "Toegang toegestaan. Veel plezier met lezen!";
  els.feedback.className = "feedback feedback--ok";
}

function handleAccess(event) {
  event.preventDefault();
  const value = els.passwordInput.value.trim();

  if (value === SITE_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, "ok");
    showPrivateContent();
    els.passwordInput.value = "";
    return;
  }

  els.feedback.textContent = "Onjuist wachtwoord. Probeer opnieuw.";
  els.feedback.className = "feedback feedback--error";
}

function initAccess() {
  const isUnlocked = sessionStorage.getItem(SESSION_KEY) === "ok";
  if (isUnlocked) {
    showPrivateContent();
  }

  els.accessForm.addEventListener("submit", handleAccess);
}

function handleRsvp(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const naam = String(formData.get("naam") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const aantal = String(formData.get("aantal") || "").trim();
  const aanwezig = String(formData.get("aanwezig") || "").trim();
  const opmerking = String(formData.get("opmerking") || "").trim();

  const subject = `RSVP bruiloft - ${naam}`;
  const bodyLines = [
    "Hallo!",
    "",
    "Hierbij onze RSVP:",
    `Naam: ${naam}`,
    `E-mail: ${email}`,
    `Aanwezig: ${aanwezig}`,
    `Aantal personen: ${aantal}`,
    `Opmerking/dieetwensen: ${opmerking || "-"}`,
  ];
  const body = bodyLines.join("\n");

  const mailto = `mailto:${encodeURIComponent(RSVP_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  els.rsvpFeedback.textContent = "Je e-mailapp wordt geopend met jullie RSVP.";
  els.rsvpFeedback.className = "feedback feedback--ok";

  window.location.href = mailto;
}

function initRsvp() {
  if (!els.rsvpForm || !els.rsvpFeedback) {
    return;
  }

  els.rsvpForm.addEventListener("submit", handleRsvp);
}

function init() {
  els.timezoneNote.textContent = `Tijdzone trouwdatum: Europe/Amsterdam (${WEDDING_DATE.toLocaleString("nl-NL", {
    timeZone: "Europe/Amsterdam",
    dateStyle: "full",
    timeStyle: "short",
  })})`;

  updateTimer();
  setInterval(updateTimer, 1000);
  initAccess();
  initRsvp();
}

init();
