// ===================================
// NATIVA SALVADOR - JAVASCRIPT
// ===================================

// ===================================
// DOM ELEMENTS
// ===================================
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const scrollTopBtn = document.getElementById('scrollTop');
const faqQuestions = document.querySelectorAll('.faq-question');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

// ===================================
// DATE & TIME DISPLAY
// ===================================
function updateDateTime() {
    const dateTimeElement = document.getElementById('dateTime');
    const now = new Date();
    
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    const formattedDate = now.toLocaleDateString('pt-BR', options);
    dateTimeElement.textContent = formattedDate;
}

// Update date/time every minute
updateDateTime();
setInterval(updateDateTime, 60000);

// ===================================
// MOBILE MENU TOGGLE
// ===================================
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Change icon
        const icon = menuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// SCROLL TO TOP BUTTON
// ===================================
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
    
    // Add shadow to header on scroll
    const header = document.querySelector('.header');
    if (window.pageYOffset > 0) {
        header.style.boxShadow = '0 2px 16px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
});

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// FAQ ACCORDION
// ===================================
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isActive = question.classList.contains('active');
        
        // Close all other FAQs
        faqQuestions.forEach(q => {
            q.classList.remove('active');
            q.nextElementSibling.classList.remove('active');
        });
        
        // Toggle current FAQ
        if (!isActive) {
            question.classList.add('active');
            answer.classList.add('active');
        }
    });
});

// ===================================
// CONTACT FORM HANDLING
// ===================================
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            package: document.getElementById('package').value,
            date: document.getElementById('date').value,
            guests: document.getElementById('guests').value,
            message: document.getElementById('message').value
        };
        
        // Validate form
        if (!formData.name || !formData.email || !formData.phone) {
            showFormMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showFormMessage('Por favor, insira um e-mail válido.', 'error');
            return;
        }
        
        // Simulate form submission
        showFormMessage('Enviando sua solicitação...', 'success');
        
        // In a real application, you would send this data to a server
        setTimeout(() => {
            // Create WhatsApp message
            const whatsappMessage = createWhatsAppMessage(formData);
            const whatsappURL = `https://wa.me/5571999999999?text=${encodeURIComponent(whatsappMessage)}`;
            
            // Show success message
            showFormMessage(
                'Sua solicitação foi recebida! Redirecionando para WhatsApp...',
                'success'
            );
            
            // Reset form
            contactForm.reset();
            
            // Redirect to WhatsApp after 2 seconds
            setTimeout(() => {
                window.open(whatsappURL, '_blank');
            }, 2000);
        }, 1000);
    });
}

// ===================================
// HELPER FUNCTIONS
// ===================================
function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Hide message after 5 seconds for errors
    if (type === 'error') {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

function createWhatsAppMessage(data) {
    let message = '🌴 *SOLICITAÇÃO DE RESERVA - NATIVA SALVADOR* 🌴\n\n';
    message += `*Nome:* ${data.name}\n`;
    message += `*E-mail:* ${data.email}\n`;
    message += `*Telefone:* ${data.phone}\n`;
    
    if (data.package) {
        const packages = {
            'essencial': 'Essencial - R$ 8.900',
            'premium': 'Premium - R$ 12.500',
            'vip': 'VIP Exclusivo - R$ 18.900',
            'custom': 'Personalizado'
        };
        message += `*Pacote:* ${packages[data.package]}\n`;
    }
    
    if (data.date) {
        message += `*Data Preferencial:* ${formatDate(data.date)}\n`;
    }
    
    if (data.guests) {
        message += `*Número de Pessoas:* ${data.guests}\n`;
    }
    
    if (data.message) {
        message += `\n*Mensagem:*\n${data.message}\n`;
    }
    
    message += '\n_Aguardo retorno com mais informações!_';
    
    return message;
}

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// ===================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll(
    '.feature-card, .roteiro-card, .pricing-card, .testimonial-card, .inclusion-item'
);

animateElements.forEach(element => {
    observer.observe(element);
});

// ===================================
// PRICING CARD HOVER EFFECTS
// ===================================
const pricingCards = document.querySelectorAll('.pricing-card');
pricingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.borderColor = 'var(--primary-color)';
    });
    
    card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('featured')) {
            card.style.borderColor = 'transparent';
        }
    });
});

// ===================================
// LAZY LOADING IMAGES
// ===================================
const images = document.querySelectorAll('img');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            
            img.onload = () => {
                img.style.opacity = '1';
            };
            
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => {
    imageObserver.observe(img);
});

// ===================================
// HERO PARALLAX EFFECT
// ===================================
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        hero.style.backgroundPositionY = `${scrolled * parallaxSpeed}px`;
    });
}

// ===================================
// STATS COUNTER ANIMATION
// ===================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Observe stats section for counter animation
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = document.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    if (!isNaN(text)) {
                        animateCounter(stat, parseInt(text));
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// ===================================
// ROTEIRO CARD CLICK TRACKING
// ===================================
const roteiroCards = document.querySelectorAll('.roteiro-card');
roteiroCards.forEach(card => {
    card.addEventListener('click', () => {
        const day = card.getAttribute('data-day');
        const title = card.querySelector('.roteiro-title').textContent;
        console.log(`Clicked: Day ${day} - ${title}`);
        
        // Add pulse animation
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = 'pulse 0.5s ease';
        }, 10);
    });
});

// ===================================
// PRICE CALCULATION HELPER
// ===================================
function calculateGroupDiscount(basePrice, numberOfPeople) {
    if (numberOfPeople >= 6) {
        return basePrice * 0.9; // 10% discount
    }
    return basePrice;
}

// Add price calculator to guests input
const guestsInput = document.getElementById('guests');
if (guestsInput) {
    guestsInput.addEventListener('change', () => {
        const guests = parseInt(guestsInput.value);
        if (guests >= 6) {
            showFormMessage(
                `🎉 Grupo de ${guests} pessoas elegível para desconto de 10%!`,
                'success'
            );
        }
    });
}

// ===================================
// SOCIAL MEDIA TRACKING
// ===================================
const socialLinks = document.querySelectorAll('.social-link, .footer-social a');
socialLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const platform = link.querySelector('i').classList[1].replace('fa-', '');
        console.log(`Social media click: ${platform}`);
    });
});

// ===================================
// TESTIMONIAL CAROUSEL (OPTIONAL)
// ===================================
const testimonialCards = document.querySelectorAll('.testimonial-card');
let currentTestimonial = 0;

function showTestimonial(index) {
    testimonialCards.forEach((card, i) => {
        if (i === index) {
            card.style.transform = 'scale(1.05)';
            card.style.boxShadow = 'var(--shadow-lg)';
        } else {
            card.style.transform = 'scale(1)';
            card.style.boxShadow = 'var(--shadow-md)';
        }
    });
}

// Auto-rotate testimonials every 5 seconds
if (testimonialCards.length > 0) {
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }, 5000);
}

// ===================================
// PHONE NUMBER FORMATTING
// ===================================
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            if (value.length > 6) {
                value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            } else if (value.length > 0) {
                value = value.replace(/(\d{0,2})/, '($1');
            }
        }
        
        e.target.value = value;
    });
}

// ===================================
// COPY TO CLIPBOARD (FOR SOCIAL HANDLES)
// ===================================
const socialHandles = document.querySelectorAll('.social-handle, .footer-handle');
socialHandles.forEach(handle => {
    handle.style.cursor = 'pointer';
    handle.title = 'Clique para copiar';
    
    handle.addEventListener('click', () => {
        const text = handle.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const originalText = handle.textContent;
            handle.textContent = '✓ Copiado!';
            handle.style.color = '#25D366';
            
            setTimeout(() => {
                handle.textContent = originalText;
                handle.style.color = '';
            }, 2000);
        });
    });
});

// ===================================
// PREVENT FORM DOUBLE SUBMISSION
// ===================================
if (contactForm) {
    let isSubmitting = false;
    
    contactForm.addEventListener('submit', (e) => {
        if (isSubmitting) {
            e.preventDefault();
            return false;
        }
        isSubmitting = true;
        
        setTimeout(() => {
            isSubmitting = false;
        }, 3000);
    });
}

// ===================================
// EASTER EGG - KONAMI CODE
// ===================================
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        document.body.style.animation = 'rainbow 3s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// ===================================
// CONSOLE BRANDING
// ===================================
console.log('%c🌴 Nativa Salvador - The Soul of Bahia 🌴', 'font-size: 20px; color: #D85E38; font-weight: bold;');
console.log('%cDesenvolvido com ❤️ para experiências autênticas', 'font-size: 12px; color: #6B6B6B;');
console.log('%c@NATIVASALVADOR.TUR', 'font-size: 14px; color: #2C5F4F; font-weight: bold;');

// ===================================
// PERFORMANCE MONITORING
// ===================================
window.addEventListener('load', () => {
    const loadTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    console.log(`⚡ Site carregado em ${loadTime}ms`);
});

// ===================================
// SERVICE WORKER REGISTRATION (OPTIONAL)
// ===================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}

// ===================================
// EXPORT FUNCTIONS FOR TESTING
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateGroupDiscount,
        formatDate,
        createWhatsAppMessage
    };
}