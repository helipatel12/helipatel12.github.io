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


// ===============================
// EMAILJS + GOOGLE SHEETS
// ===============================

(function () {
  emailjs.init("WlX3Jo0kqcdiohAHP");
})();

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // UI: Sending
  formStatus.style.display = "block";
  formStatus.style.color = "#2563eb";
  formStatus.textContent = "Sending message...";

  // 1️⃣ Send email to YOU
  emailjs.sendForm(
    "service_lvoz2mj",
    "template_s5tiyfs",
    this
  )
  .then(() => {

    // 2️⃣ Auto-reply to USER
    return emailjs.sendForm(
      "service_lvoz2mj",
      "template_w2eto5z",
      this
    );
  })
  .then(() => {

    // 3️⃣ Save data to Google Sheets
    return fetch(
      "https://script.google.com/macros/s/AKfycbxeNoIp6C2A7tSrB6WsavFyHm18oXgQCnos5B9eV3XDSo5TchluI4c_iOW4C0mEQiibTQ/exec",
      {
        method: "POST",
        body: new URLSearchParams({
          name: contactForm.name.value,
          email: contactForm.email.value,
          message: contactForm.message.value
        })
      }
    );
  })

  .then(() => {
    // ✅ Success
    formStatus.style.color = "green";
    formStatus.textContent = "✅ Message sent successfully!";
    contactForm.reset();
  })
  .catch((error) => {
    console.error(error);
    formStatus.style.color = "red";
    formStatus.textContent = "❌ Something went wrong. Please try again.";
  });
});





// ===============================
// CUSTOM CURSOR
// ===============================
const cursor = document.getElementById("cursor");
const amount = 20;
const sineDots = Math.floor(amount * 0.3);
const width = 26;
const idleTimeout = 150;
let lastFrame = 0;
let mousePosition = {x: 0, y: 0};
let dots = [];
let timeoutID;
let idle = false;

class Dot {
    constructor(index = 0) {
        this.index = index;
        this.anglespeed = 0.05;
        this.x = 0;
        this.y = 0;
        this.scale = 1 - 0.05 * index;
        this.range = width / 2 - width / 2 * this.scale + 2;
        this.limit = width * 0.75 * this.scale;
        this.element = document.createElement("span");
        TweenMax.set(this.element, {scale: this.scale});
        cursor.appendChild(this.element);
    }

    lock() {
        this.lockX = this.x;
        this.lockY = this.y;
        this.angleX = Math.PI * 2 * Math.random();
        this.angleY = Math.PI * 2 * Math.random();
    }

    draw(delta) {
        if (!idle || this.index <= sineDots) {
            TweenMax.set(this.element, {x: this.x, y: this.y});
        } else {
            this.angleX += this.anglespeed;
            this.angleY += this.anglespeed;
            this.y = this.lockY + Math.sin(this.angleY) * this.range;
            this.x = this.lockX + Math.sin(this.angleX) * this.range;
            TweenMax.set(this.element, {x: this.x, y: this.y});
        }
    }
}

function initCursor() {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);
    lastFrame += new Date();
    buildDots();
    render();
}

function startIdleTimer() {
    timeoutID = setTimeout(goInactive, idleTimeout);
    idle = false;
}

function resetIdleTimer() {
    clearTimeout(timeoutID);
    startIdleTimer();
}

function goInactive() {
    idle = true;
    for (let dot of dots) {
        dot.lock();
    }
}

function buildDots() {
    for (let i = 0; i < amount; i++) {
        let dot = new Dot(i);
        dots.push(dot);
    }
}

const onMouseMove = event => {
    mousePosition.x = event.clientX - width / 2;
    mousePosition.y = event.clientY - width / 2;
    resetIdleTimer();
};

const onTouchMove = event => {
    mousePosition.x = event.touches[0].clientX - width / 2;
    mousePosition.y = event.touches[0].clientY - width / 2;
    resetIdleTimer();
};

const render = timestamp => {
    const delta = timestamp - lastFrame;
    positionCursor(delta);
    lastFrame = timestamp;
    requestAnimationFrame(render);
};

const positionCursor = delta => {
    let x = mousePosition.x;
    let y = mousePosition.y;
    dots.forEach((dot, index, dots) => {
        let nextDot = dots[index + 1] || dots[0];
        dot.x = x;
        dot.y = y;
        dot.draw(delta);
        if (!idle || index <= sineDots) {
            const dx = (nextDot.x - dot.x) * 0.35;
            const dy = (nextDot.y - dot.y) * 0.35;
            x += dx;
            y += dy;
        }
    });
};

// Initialize cursor after DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor);
} else {
    initCursor();
}