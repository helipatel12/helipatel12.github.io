// ===============================
// TYPING EFFECT
// ===============================
const words = ["Software Developer", "Data Scientist", "Computer Engineer"];
let wordIndex = 0;
let charIndex = 0;
const typingElement = document.getElementById("typing");

function type() {
  if (charIndex < words[wordIndex].length) {
    typingElement.textContent += words[wordIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, 100);
  } else {
    setTimeout(erase, 2000);
  }
}

function erase() {
  if (charIndex > 0) {
    typingElement.textContent = words[wordIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, 50);
  } else {
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(type, 500);
  }
}

document.addEventListener("DOMContentLoaded", type);

// ===============================
// THEME TOGGLE
// ===============================
const themeBtn = document.getElementById("theme-toggle-btn");
const themeIcon = document.getElementById("theme-icon");
const html = document.documentElement;

themeBtn.addEventListener("click", () => {
  const isDark = html.getAttribute("data-theme") === "dark";

  if (isDark) {
    html.removeAttribute("data-theme");
    themeIcon.classList.replace("fa-sun", "fa-moon");
    localStorage.setItem("theme", "light");
  } else {
    html.setAttribute("data-theme", "dark");
    themeIcon.classList.replace("fa-moon", "fa-sun");
    localStorage.setItem("theme", "dark");
  }
});

window.addEventListener("load", () => {
  if (localStorage.getItem("theme") === "dark") {
    html.setAttribute("data-theme", "dark");
    themeIcon.classList.replace("fa-moon", "fa-sun");
  }
});

// ===============================
// PROJECT FILTER (SINGLE SOURCE)
// ===============================
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const category = card.dataset.category;
      card.style.display =
        filter === "all" || category.includes(filter)
          ? "block"
          : "none";
    });
  });
});
