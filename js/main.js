// DOM references
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');
const navToggle = document.querySelector('.nav-toggle');
const navLinksContainer = document.querySelector('.nav-links');

// Add shadow to nav when page is scrolled
function handleNavScroll() {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// Highlight the nav link matching the current section in view
function highlightActiveNav() {
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop <= window.innerHeight / 2) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

// Toggle mobile nav open/closed
navToggle.addEventListener('click', () => {
  navLinksContainer.classList.toggle('open');
});

// Close mobile nav when a link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinksContainer.classList.remove('open');
  });
});

// Run nav functions on scroll
window.addEventListener('scroll', () => {
  handleNavScroll();
  highlightActiveNav();
}, { passive: true });

// Set initial state on page load
handleNavScroll();
highlightActiveNav();

// Scroll reveal — fade elements in as they enter the viewport
const revealTargets = [
  ...document.querySelectorAll('.project-card'),
  ...document.querySelectorAll('.timeline-entry'),
  ...document.querySelectorAll('.about-grid'),
  ...document.querySelectorAll('.contact-grid'),
  ...document.querySelectorAll('.section-title'),
  document.querySelector('.contact-intro'),
].filter(Boolean);

revealTargets.forEach(el => el.classList.add('reveal'));

// IntersectionObserver fires when elements enter the viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // stop watching once revealed
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => observer.observe(el));

// Contact form
const sendBtn = document.getElementById('send-btn');
const formStatus = document.getElementById('form-status');

// Returns true if value is non-empty
function isValid(value) {
  return value.trim().length > 0;
}

// Basic email format check
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

sendBtn.addEventListener('click', () => {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  // Reset status
  formStatus.textContent = '';
  formStatus.style.color = 'var(--accent)';

  // Validate fields before sending
  if (!isValid(name)) {
    formStatus.style.color = '#ff6b6b';
    formStatus.textContent = '// please enter your name';
    return;
  }

  if (!isValid(email) || !isValidEmail(email)) {
    formStatus.style.color = '#ff6b6b';
    formStatus.textContent = '// please enter a valid email';
    return;
  }

  if (!isValid(message)) {
    formStatus.style.color = '#ff6b6b';
    formStatus.textContent = '// message cannot be empty';
    return;
  }

  // Disable button while request is in flight
  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';

  // Send to Formspree — forwards submission to email inbox
  fetch('https://formspree.io/f/xvzjbgvy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ name, email, message })
  })
    .then(response => {
      if (response.ok) {
        formStatus.style.color = 'var(--accent)';
        formStatus.textContent = '// message sent. talk soon.';
        // Clear form on success
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('message').value = '';
      } else {
        formStatus.style.color = '#ff6b6b';
        formStatus.textContent = '// something went wrong. try again.';
      }
    })
    .catch(() => {
      formStatus.style.color = '#ff6b6b';
      formStatus.textContent = '// failed to send. check your connection.';
    })
    .finally(() => {
      // Always re-enable button
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send Message';
    });
});