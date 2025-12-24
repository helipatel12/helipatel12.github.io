// Typing Effect
const text = ["Computer Science Undergraduate", "Data Scientist", "Software Developer"];
let count = 0;
let index = 0;
let currentText = "";
let letter = "";

(function type() {
    if (count === text.length) {
        count = 0;
    }
    currentText = text[count];
    letter = currentText.slice(0, ++index);
    
    const typingElement = document.getElementById("typing");
    if (typingElement) {
        typingElement.textContent = letter;
    }
    
    if (letter.length === currentText.length) {
        count++;
        index = 0;
        setTimeout(type, 2000); // Wait before typing next word
    } else {
        setTimeout(type, 100); // Typing speed
    }
}());

// Mobile Menu Toggle
function toggleMenu() {
    document.querySelector('.sidebar').classList.toggle('active');
}

// Portfolio Filter
function filterWorks(category) {
    const items = document.querySelectorAll('.portfolio-item');
    const buttons = document.querySelectorAll('.filter-btn');

    // Update active button style
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    items.forEach(item => {
        if (category === 'all') {
            item.style.display = 'block';
        } else {
            if (item.classList.contains(category)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        }
    });
}

// Simple logic to set active nav link on click
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Close sidebar on mobile after clicking
        if (window.innerWidth <= 992) {
            document.querySelector('.sidebar').classList.remove('active');
        }
    });
});