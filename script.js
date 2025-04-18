const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 100);
});


const menuBtn = document.querySelector('.menu-btn');
const mainNav = document.querySelector('.main-nav');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
    if (!menuOpen) {
        menuBtn.classList.add('active');
        mainNav.classList.add('active');
        menuOpen = true;
        // Prevent scrolling when menu is open
        document.body.style.overflow = 'hidden';
    } else {
        menuBtn.classList.remove('active');
        mainNav.classList.remove('active');
        menuOpen = false;
        // Restore scrolling when menu is closed
        document.body.style.overflow = '';
    }
});

// Close menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (menuOpen) {
            menuBtn.classList.remove('active');
            mainNav.classList.remove('active');
            menuOpen = false;
            document.body.style.overflow = '';
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (menuOpen && !e.target.closest('.main-nav') && !e.target.closest('.menu-btn')) {
        menuBtn.classList.remove('active');
        mainNav.classList.remove('active');
        menuOpen = false;
        document.body.style.overflow = '';
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (!targetElement) return;
        
        // Remove active class from all links and add to clicked link
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        this.classList.add('active');
        
        // Calculate scroll position
        const headerOffset = 80; // Height of fixed header
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        // Smooth scroll with improved performance
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// Enhanced scroll spy with better performance
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

// Use Intersection Observer for better performance
const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -79% 0px',
    threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to corresponding link
            const activeLink = document.querySelector(`a[href="#${entry.target.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference, otherwise use system preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.body.classList.toggle('light-theme', currentTheme === 'light');
    themeToggle.querySelector('i').classList.toggle('fa-sun', currentTheme === 'dark');
    themeToggle.querySelector('i').classList.toggle('fa-moon', currentTheme === 'light');
} else {
    document.body.classList.toggle('light-theme', !prefersDarkScheme.matches);
    themeToggle.querySelector('i').classList.toggle('fa-sun', prefersDarkScheme.matches);
    themeToggle.querySelector('i').classList.toggle('fa-moon', !prefersDarkScheme.matches);
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    
    themeToggle.querySelector('i').classList.toggle('fa-sun', !isLight);
    themeToggle.querySelector('i').classList.toggle('fa-moon', isLight);
    
    // Add ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    themeToggle.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 1000);
});

const revealElements = document.querySelectorAll('.hero-content, .about-content, .work-grid, .contact-content');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${index * 0.1}s`;
            entry.target.classList.add('revealed');
            
            // Add floating animation to child elements
            const children = entry.target.children;
            Array.from(children).forEach((child, i) => {
                child.style.animation = `float ${3 + i * 0.5}s ease-in-out infinite`;
                child.style.animationDelay = `${i * 0.2}s`;
            });
        }
    });
}, {
    threshold: 0.1
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// Parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    document.querySelectorAll('.parallax').forEach(element => {
        const speed = element.dataset.speed || 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

const textReveal = document.querySelectorAll('.glitch, .name, .subtitle, .section-header h2');

textReveal.forEach(text => {
    const letters = text.textContent.split('');
    text.textContent = '';
    
    letters.forEach((letter, i) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.animationDelay = `${i * 0.05}s`;
        text.appendChild(span);
    });
});

const workItems = document.querySelectorAll('.work-item');

workItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const rotateX = (y - rect.height / 2) / 10;
        const rotateY = -(x - rect.width / 2) / 10;
        
        item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        item.style.transition = 'none';
        
        // Add glow effect
        const glow = `radial-gradient(circle at ${x}px ${y}px, rgba(var(--primary-rgb), 0.3), transparent)`;
        item.style.background = glow;
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        item.style.transition = 'all 0.5s ease';
        item.style.background = 'none';
    });
});

// Dynamic image tilt effect
const images = document.querySelectorAll('.work-image, .project-image, .image-container');

images.forEach(container => {
    container.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = container.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        
        const maxTilt = 15;
        const tiltX = (maxTilt / 2 - x * maxTilt).toFixed(2);
        const tiltY = (y * maxTilt - maxTilt / 2).toFixed(2);
        
        container.style.transform = `perspective(1000px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale3d(1.05, 1.05, 1.05)`;
        
        // Add shine effect
        const shine = container.querySelector('.shine') || document.createElement('div');
        if (!shine.classList.contains('shine')) {
            shine.classList.add('shine');
            container.appendChild(shine);
        }
        
        const moveX = (x * 100).toFixed(2);
        const moveY = (y * 100).toFixed(2);
        shine.style.background = `radial-gradient(circle at ${moveX}% ${moveY}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 80%)`;
    });
    
    container.addEventListener('mouseleave', () => {
        container.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        const shine = container.querySelector('.shine');
        if (shine) {
            shine.remove();
        }
    });
});

(function() {
    emailjs.init("m-GY-WgZVADtG_r0S");
})();

const form = document.querySelector('.contact-form');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
   
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
   
    const formData = {
        from_name: form.querySelector('[name="name"]').value,
        from_email: form.querySelector('[name="email"]').value,
        message: form.querySelector('[name="message"]').value
    };
   
    emailjs.send("m-GY-WgZVADtG_r0S", "template_fhsr0kt", formData)
        .then(() => {
           
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
            form.reset();
            
           
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = 'Message sent successfully! I\'ll get back to you soon.';
            form.appendChild(successMessage);
            
           
            setTimeout(() => {
                successMessage.remove();
                submitBtn.innerHTML = 'Send Message';
                submitBtn.disabled = false;
            }, 3000);
        })
        .catch((error) => {
            
            submitBtn.innerHTML = '<i class="fas fa-times"></i> Error';
            
            
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.innerHTML = 'Sorry, there was an error sending your message. Please try again.';
            form.appendChild(errorMessage);
            
           
            setTimeout(() => {
                errorMessage.remove();
                submitBtn.innerHTML = 'Send Message';
                submitBtn.disabled = false;
            }, 3000);
            
            console.error('Error:', error);
        });
}); 

document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Remove any existing messages
    const existingMsg = this.querySelector('.success-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    // Get form values
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;
    
    // Create and show success message immediately
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.innerHTML = `
        <i class="fas fa-check-circle"></i>
        Email sent successfully!
    `;
    successMsg.style.cssText = `
        background-color: var(--primary);
        color: white;
        padding: 15px;
        border-radius: 8px;
        margin-top: 20px;
        text-align: center;
        font-size: 16px;
        animation: fadeIn 0.5s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    `;
    
    // Clear form
    this.reset();
    
    // Show success message
    this.appendChild(successMsg);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        successMsg.style.animation = 'fadeOut 0.5s ease-in-out';
        setTimeout(() => successMsg.remove(), 500);
    }, 3000);
});

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);

// Global Ripple Effect
function createRipple(event) {
    const element = event.currentTarget;
    
    // Remove existing ripples
    const existingRipple = element.querySelector('.ripple');
    if (existingRipple) {
        existingRipple.remove();
    }
    
    // Create new ripple
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    element.appendChild(ripple);
    
    // Get click position relative to element
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    // Position and size the ripple
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    // Remove ripple after animation
    ripple.addEventListener('animationend', () => ripple.remove());
}

// Add ripple effect to all interactive elements
const rippleElements = document.querySelectorAll(`
    .btn,
    .nav-link,
    .theme-toggle,
    .work-item,
    .project-item,
    .social-links a,
    .menu-btn
`);

rippleElements.forEach(element => {
    element.addEventListener('click', createRipple);
});

// Special handling for form inputs
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', (e) => {
        const rect = input.getBoundingClientRect();
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        input.appendChild(ripple);
        
        // Center the ripple
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${rect.width / 2 - size / 2}px`;
        ripple.style.top = `${rect.height / 2 - size / 2}px`;
        
        // Remove ripple after animation
        ripple.addEventListener('animationend', () => ripple.remove());
    });
});