const WEDDING_DATE = new Date("2026-09-18T14:00:00+02:00");
const DAY_GUEST_PASSWORD = "liefde2026";
const EVENING_GUEST_PASSWORD = "feest2026";
const SESSION_KEY = "bruiloft_toegang";
const RSVP_EMAIL = "mathijsenchantalgaantrouwen@gmail.com";

const ACCESS_LEVEL_DAY = "dag";
const ACCESS_LEVEL_EVENING = "avond";

const DAY_TIMELINE_ITEMS = [
  { time: "13:30", label: "Inloop gasten" },
  { time: "14:00", label: "Ceremonie" },
  { time: "15:00", label: "Toost & borrel" },
  { time: "17:00", label: "Diner" },
  { time: "20:00", label: "Feest" },
  { time: "01:00", label: "Einde" },
];

const EVENING_TIMELINE_ITEMS = [
  { time: "20:00", label: "Aanwezig feest" },
  { time: "20:30", label: "Start feest" },
  { time: "01:00", label: "Einde" },
];

const els = {
  title: document.getElementById("timer-title"),
  heroEyebrow: document.getElementById("hero-eyebrow"),
  heroLead: document.getElementById("hero-lead"),
  metaDescription: document.getElementById("meta-description"),
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
  planningTitle: document.getElementById("planning-title"),
  planningTimeline: document.getElementById("planning-timeline"),
  planningNote: document.getElementById("planning-note"),
  rsvpForm: document.getElementById("rsvp-form"),
  rsvpFeedback: document.getElementById("rsvp-feedback"),
};

let isMarriedMode = null;

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatDutchDate(date, includeTime = true) {
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Amsterdam",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
    options.hour12 = false;
  }

  return new Intl.DateTimeFormat("nl-NL", options).format(date);
}

function updateWeddingCopy(married) {
  if (isMarriedMode === married) {
    return;
  }

  const weddingDateText = married
    ? formatDutchDate(WEDDING_DATE, false)
    : formatDutchDate(WEDDING_DATE, true);

  if (!married) {
    document.title = "Mathijs en Chantal gaan trouwen!";
    if (els.metaDescription) {
      els.metaDescription.setAttribute(
        "content",
        "Welkom op onze huwelijkswebsite. Bekijk de afteller tot onze trouwdag."
      );
    }
    if (els.heroEyebrow) {
      els.heroEyebrow.textContent = "Wij gaan trouwen!";
    }
    if (els.heroLead) {
      els.heroLead.innerHTML = `We kijken er enorm naar uit om op <strong>${weddingDateText}</strong> elkaar het jawoord te geven.`;
    }
    isMarriedMode = false;
    return;
  }

  document.title = "Mathijs en Chantal zijn getrouwd!";
  if (els.metaDescription) {
    els.metaDescription.setAttribute(
      "content",
      "Welkom op onze huwelijkswebsite. Bekijk hoelang we al getrouwd zijn."
    );
  }
  if (els.heroEyebrow) {
    els.heroEyebrow.textContent = "Wij zijn getrouwd!";
  }
  if (els.heroLead) {
    els.heroLead.innerHTML = `Wij hebben elkaar op <strong>${weddingDateText}</strong> het jawoord gegeven.`;
  }
  isMarriedMode = true;
}

function updateTimer() {
  const now = new Date();
  const diffMs = WEDDING_DATE.getTime() - now.getTime();

  if (diffMs > 0) {
    updateWeddingCopy(false);

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    els.title.textContent = "Aftellen tot onze bruiloft";
    els.countdownView.classList.remove("hidden");
    els.marriedView.classList.add("hidden");

    els.days.textContent = String(days);
    els.hours.textContent = pad(hours);
    els.minutes.textContent = pad(minutes);
    els.seconds.textContent = pad(seconds);
    return;
  }

  updateWeddingCopy(true);

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

function setPlanningForAccessLevel(accessLevel) {
  if (!els.planningTimeline || !els.planningTitle || !els.planningNote) {
    return;
  }

  const isEveningGuest = accessLevel === ACCESS_LEVEL_EVENING;
  const timelineItems = isEveningGuest ? EVENING_TIMELINE_ITEMS : DAY_TIMELINE_ITEMS;

  els.planningTitle.textContent = "Programma";
  els.planningNote.textContent = "";

  els.planningTimeline.innerHTML = timelineItems
    .map((item) => `<li><span>${item.time}</span> ${item.label}</li>`)
    .join("");
}

function showPrivateContent(accessLevel) {
  setPlanningForAccessLevel(accessLevel);
  els.privateContent.classList.remove("hidden");
  els.feedback.textContent = "Toegang toegestaan. Veel plezier met lezen!";
  els.feedback.className = "feedback feedback--ok";
}

function handleAccess(event) {
  event.preventDefault();
  const value = els.passwordInput.value.trim();

  let accessLevel = null;

  if (value === DAY_GUEST_PASSWORD) {
    accessLevel = ACCESS_LEVEL_DAY;
  } else if (value === EVENING_GUEST_PASSWORD) {
    accessLevel = ACCESS_LEVEL_EVENING;
  }

  if (accessLevel) {
    sessionStorage.setItem(SESSION_KEY, accessLevel);
    showPrivateContent(accessLevel);
    els.passwordInput.value = "";
    return;
  }

  els.feedback.textContent = "Onjuiste code. Probeer opnieuw.";
  els.feedback.className = "feedback feedback--error";
}

function initAccess() {
  const accessLevel = sessionStorage.getItem(SESSION_KEY);
  const hasKnownAccessLevel =
    accessLevel === ACCESS_LEVEL_DAY || accessLevel === ACCESS_LEVEL_EVENING;

  if (hasKnownAccessLevel) {
    showPrivateContent(accessLevel);
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
  updateTimer();
  setInterval(updateTimer, 1000);
  initAccess();
  initRsvp();
}

init();
