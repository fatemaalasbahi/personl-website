const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#nav-links");
const header = document.querySelector(".site-header");

function setNavExpanded(isExpanded) {
  if (!navToggle || !navLinks) return;
  navToggle.setAttribute("aria-expanded", String(isExpanded));
  navLinks.classList.toggle("is-open", isExpanded);
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    setNavExpanded(!expanded);
  });

  navLinks.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof HTMLAnchorElement && target.classList.contains("nav-link")) {
      setNavExpanded(false);
    }
  });
}

function updateHeaderElevation() {
  if (!header) return;
  const elevated = window.scrollY > 6;
  header.setAttribute("data-elevate", elevated ? "true" : "false");
}

updateHeaderElevation();
window.addEventListener("scroll", updateHeaderElevation, { passive: true });

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

// Active section highlighting
const sectionIds = ["home", "about", "projects", "skills", "experience", "contact"];
const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const linkById = new Map(
  sectionIds.map((id) => [id, document.querySelector(`.nav-links a[href="#${id}"]`)]),
);

function clearCurrent() {
  for (const link of linkById.values()) {
    if (link) link.removeAttribute("aria-current");
  }
}

if ("IntersectionObserver" in window && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

      if (!visible?.target?.id) return;
      clearCurrent();
      const link = linkById.get(visible.target.id);
      if (link) link.setAttribute("aria-current", "page");
    },
    { rootMargin: "-20% 0px -70% 0px", threshold: [0.05, 0.1, 0.2, 0.3] },
  );

  for (const section of sections) observer.observe(section);
}

// Demo toast for the placeholder form
const toast = document.querySelector(".toast");
const toastClose = document.querySelector(".toast-close");
const toastButton = document.querySelector("[data-toast]");

function openToast() {
  if (!toast) return;
  toast.hidden = false;
  toastClose?.focus();
}

function closeToast() {
  if (!toast) return;
  toast.hidden = true;
  toastButton?.focus();
}

toastButton?.addEventListener("click", openToast);
toastClose?.addEventListener("click", closeToast);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && toast && !toast.hidden) closeToast();
});

