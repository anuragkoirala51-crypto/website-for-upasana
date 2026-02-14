// ===== DOM Elements =====
const loadingScreen = document.getElementById('loading');
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
const starCanvas = document.getElementById('starCanvas');
const particlesContainer = document.getElementById('particles');
const startButton = document.getElementById('startButton');
const envelope = document.getElementById('envelopeContainer');
const passwordModal = document.getElementById('passwordModal');
const passwordInput = document.getElementById('passwordInput');
const submitPassword = document.getElementById('submitPassword');
const errorMessage = document.getElementById('errorMessage');
const letterReveal = document.getElementById('letterReveal');
const heroTextElements = document.querySelectorAll('.hero-text .reveal-text');
const impactCards = document.querySelectorAll('.impact-card');
const flipCards = document.querySelectorAll('.flip-card');

// Proposal Elements
const proposalScreen = document.getElementById('proposal-screen');
const btnYes = document.getElementById('p-yes');
const btnNo = document.getElementById('p-no');
const proposalHearts = document.getElementById('proposalHearts');

// ===== Proposal Logic & Runaway Button =====
let noTouchCount = 0;

function moveNoButton() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const btnRect = btnNo.getBoundingClientRect();

    // Calculate safe boundaries
    const maxX = screenWidth - btnRect.width - 20;
    const maxY = screenHeight - btnRect.height - 20;

    // Generate random coordinates
    let randomX = Math.random() * maxX;
    let randomY = Math.random() * maxY;

    // Ensure it doesn't just jump to the same spot
    btnNo.style.position = 'fixed';
    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;

    noTouchCount++;
}

btnNo.addEventListener('mouseover', moveNoButton);
btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
}, { passive: false });

// YES Button Event
btnYes.addEventListener('click', () => {
    // Save to session storage
    sessionStorage.setItem('valentine_accepted', 'true');

    // Play sound & music
    bgMusic.play().catch(e => console.log("Autoplay blocked"));
    bgMusic.volume = 0.2; // Soft background volume
    musicToggle.classList.add('playing');

    // Heart Pop Animation
    for (let i = 0; i < 15; i++) {
        createPopHeart();
    }

    // Fade out proposal
    proposalScreen.style.opacity = '0';
    setTimeout(() => {
        proposalScreen.style.display = 'none';
        window.scrollTo(0, 0);
        startHeroAnimation(); // Start hero animations only after acceptance
    }, 1000);
});

function createPopHeart() {
    const heart = document.createElement('div');
    heart.className = 'p-pop-heart';
    heart.innerHTML = '💖';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = Math.random() * 100 + 'vh';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
}

// Background hearts for proposal
function createProposalHearts() {
    if (!proposalScreen || proposalScreen.style.display === 'none') return;

    const heart = document.createElement('span');
    heart.innerHTML = ['❤️', '💖', '💕', '💗', '💓'][Math.floor(Math.random() * 5)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
    heart.style.animationDuration = (Math.random() * 3 + 3) + 's';

    proposalHearts.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
}

const proposalHeartInterval = setInterval(createProposalHearts, 300);

// Check if already accepted
if (sessionStorage.getItem('valentine_accepted') === 'true') {
    proposalScreen.style.display = 'none';
}

// ===== Loading Screen =====
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        // If proposal already accepted, start hero animation immediately
        if (sessionStorage.getItem('valentine_accepted') === 'true') {
            startHeroAnimation();
        }
    }, 2000);
});

// ===== Hero Text Animation =====
function startHeroAnimation() {
    heroTextElements.forEach((el, index) => {
        const delay = parseInt(el.dataset.delay) * 800;
        setTimeout(() => {
            el.classList.add('visible');
        }, delay);
    });
}

// ===== Star Canvas Animation =====
const ctx = starCanvas.getContext('2d');
let stars = [];

function resizeCanvas() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
    initStars();
}

function initStars() {
    stars = [];
    const numStars = Math.floor((starCanvas.width * starCanvas.height) / 3000);
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * starCanvas.width,
            y: Math.random() * starCanvas.height,
            radius: Math.random() * 1.5 + 0.5,
            opacity: Math.random(),
            twinkleSpeed: Math.random() * 0.02 + 0.005
        });
    }
}

function drawStars() {
    ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);

    stars.forEach(star => {
        star.opacity += star.twinkleSpeed;
        if (star.opacity >= 1 || star.opacity <= 0.2) {
            star.twinkleSpeed = -star.twinkleSpeed;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        if (star.radius > 1) {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.1})`;
            ctx.fill();
        }
    });

    requestAnimationFrame(drawStars);
}

resizeCanvas();
drawStars();
window.addEventListener('resize', resizeCanvas);

// ===== Floating Particles =====
function createParticles() {
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';

        const colors = ['#FFB6C1', '#FF6B9D', '#FFC0CB', '#FFD700', '#E6E6FA'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        particlesContainer.appendChild(particle);
    }
}

createParticles();

// ===== Music Button Logic =====
let isMuted = true;
bgMusic.volume = 0.2;

musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.classList.add('playing');
        musicToggle.classList.remove('muted');
    } else {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
        musicToggle.classList.add('muted');
    }
});

// Initialize music toggle state based on play status
bgMusic.onplay = () => {
    musicToggle.classList.add('playing');
    musicToggle.classList.remove('muted');
};
bgMusic.onpause = () => {
    musicToggle.classList.remove('playing');
    musicToggle.classList.add('muted');
};

// ===== Smooth Scroll =====
startButton.addEventListener('click', () => {
    document.getElementById('section1').scrollIntoView({ behavior: 'smooth' });
});

// ===== Scroll Animations (Intersection Observer) =====
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

impactCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.15}s`;
    observer.observe(card);
});

// ===== Flip Cards =====
flipCards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
});

// ===== Password Protected Letter =====
function openPasswordModal(e) {
    if (e) e.preventDefault();
    passwordModal.classList.add('active');
    passwordInput.focus();
}

envelope.addEventListener('click', openPasswordModal);
envelope.addEventListener('touchstart', openPasswordModal, { passive: false });

passwordModal.addEventListener('click', (e) => {
    if (e.target === passwordModal) {
        passwordModal.classList.remove('active');
        errorMessage.classList.remove('show');
        passwordInput.value = '';
    }
});

submitPassword.addEventListener('click', checkPassword);
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

function checkPassword() {
    const password = passwordInput.value;
    if (password === '0909') {
        passwordModal.classList.remove('active');
        letterReveal.classList.add('active');
    } else {
        errorMessage.classList.add('show');
        passwordInput.value = '';
        passwordInput.classList.add('shake');
        setTimeout(() => passwordInput.classList.remove('shake'), 500);
    }
}

// ===== Parallax Effect =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const moon = document.querySelector('.moon');
    if (moon) {
        moon.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// ===== Section Fade In Animation =====
const sections = document.querySelectorAll('.section');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    sectionObserver.observe(section);
});

// ===== Touch Support for Flip Cards =====
flipCards.forEach(card => {
    card.addEventListener('touchstart', (e) => {
        card.classList.toggle('flipped');
    }, { passive: true });
});

// ===== Prevent zoom on double tap =====
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// ===== Wrong Password Shake =====
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    .shake { animation: shake 0.3s ease-in-out; }
`;
document.head.appendChild(style);

console.log('%c❤️ Made with love for Upasana ❤️', 'color: #FF6B9D; font-size: 20px; font-weight: bold;');
