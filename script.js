
// Animated statistics counter
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate statistics if visible
                if (entry.target.classList.contains('hero-stats')) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-target'));
                        if (target && stat.textContent === '0') {
                            animateCounter(stat, target);
                        }
                    });
                }
            }
        });
    }, observerOptions);

    // Observe service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Observe hero stats
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        heroStats.style.opacity = '0';
        heroStats.style.transform = 'translateY(20px)';
        heroStats.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(heroStats);
    }

    // Observe value items
    document.querySelectorAll('.value-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

    // Observe product cards and purpose items
    document.querySelectorAll('.product-card, .purpose-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

    // Observe service cards, how items, and fit sections
    document.querySelectorAll('.service-card, .how-item, .fit-section, .services-cta').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#home') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
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
}

// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    
    // Handle mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            mobileMenuToggle.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
        });
    }
    
    // Handle dropdown clicks on mobile
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
    
    // Close menu when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!navMenu.contains(e.target) && !e.target.classList.contains('mobile-menu-toggle')) {
                navMenu.classList.remove('active');
                if (mobileMenuToggle) mobileMenuToggle.innerHTML = '☰';
                dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            if (mobileMenuToggle) mobileMenuToggle.innerHTML = '☰';
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Send email using mailto (opens user's email client)
            // For production, integrate with Formspree, EmailJS, or your backend API
            const emailSubject = encodeURIComponent(subject);
            const emailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            const mailtoLink = `mailto:contact@montebay.io?subject=${emailSubject}&body=${emailBody}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            showFormMessage('Your email client should open. If not, please email us at contact@montebay.io', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Alternative: Use Formspree (uncomment and add your Formspree endpoint)
            /*
            fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    subject: subject,
                    message: message,
                    _replyto: email,
                    _to: 'contact@montebay.io'
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok || response.ok) {
                    showFormMessage('Thank you! Your message has been sent to contact@montebay.io. We\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showFormMessage('Sorry, there was an error sending your message. Please try emailing contact@montebay.io directly.', 'error');
                }
            })
            .catch(error => {
                showFormMessage('Sorry, there was an error sending your message. Please try emailing contact@montebay.io directly.', 'error');
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
            */
        });
    }
    
    function showFormMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = 'form-message ' + type;
            formMessage.style.display = 'block';
            
            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Auto-hide after 5 seconds for success messages
            if (type === 'success') {
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        }
    }
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Silent AWS Audit Form handling
    const auditForm = document.getElementById('silentAwsAuditForm');
    const auditFormMessage = document.getElementById('auditFormMessage');
    
    if (auditForm) {
        auditForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate checkbox groups (at least one required)
            const concernsCheckboxes = auditForm.querySelectorAll('input[name="audit-concerns"]:checked');
            if (concernsCheckboxes.length === 0) {
                showAuditFormMessage('Please select at least one primary concern.', 'error');
                return;
            }
            
            const confirmationsCheckboxes = auditForm.querySelectorAll('input[name="audit-confirmations"]:checked');
            if (confirmationsCheckboxes.length !== 3) {
                showAuditFormMessage('Please confirm all boundary requirements.', 'error');
                return;
            }
            
            // Get form data
            const formData = new FormData(auditForm);
            const formObject = {};
            formData.forEach((value, key) => {
                if (formObject[key]) {
                    // Handle multiple values (checkboxes)
                    if (Array.isArray(formObject[key])) {
                        formObject[key].push(value);
                    } else {
                        formObject[key] = [formObject[key], value];
                    }
                } else {
                    formObject[key] = value;
                }
            });
            
            // Show loading state
            const submitBtn = auditForm.querySelector('.audit-submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            // Format email body
            let emailBody = 'SILENT AWS AUDIT REQUEST\n\n';
            emailBody += '=== CONTACT INFORMATION ===\n';
            emailBody += `Full Name: ${formObject['full-name']}\n`;
            emailBody += `Work Email: ${formObject['work-email']}\n`;
            emailBody += `Company: ${formObject['company-name']}\n`;
            emailBody += `Role/Title: ${formObject['role-title']}\n\n`;
            
            emailBody += '=== AWS ENVIRONMENT ===\n';
            emailBody += `Environment Type: ${formObject['aws-environment-type']}\n`;
            emailBody += `Monthly AWS Spend: ${formObject['monthly-aws-spend']}\n\n`;
            
            emailBody += '=== AUDIT FOCUS ===\n';
            const concerns = Array.isArray(formObject['audit-concerns']) ? formObject['audit-concerns'] : [formObject['audit-concerns']];
            emailBody += `Primary Concerns: ${concerns.join(', ')}\n\n`;
            
            emailBody += '=== AUDIT TIER ===\n';
            emailBody += `Selected Tier: ${formObject['audit-tier']}\n\n`;
            
            emailBody += '=== CONFIRMATIONS ===\n';
            const confirmations = Array.isArray(formObject['audit-confirmations']) ? formObject['audit-confirmations'] : [formObject['audit-confirmations']];
            confirmations.forEach(conf => {
                emailBody += `✓ ${conf}\n`;
            });
            emailBody += '\n';
            
            if (formObject['additional-context']) {
                emailBody += '=== ADDITIONAL CONTEXT ===\n';
                emailBody += `${formObject['additional-context']}\n\n`;
            }
            
            emailBody += '=== DELIVERY ACKNOWLEDGMENT ===\n';
            emailBody += `✓ ${formObject['delivery-acknowledgment']}\n`;
            
            // Send to AWS Lambda via API Gateway
            const API_ENDPOINT = 'https://bisrhls8q9.execute-api.us-east-1.amazonaws.com/prod/montebay/silent-aws-audit';
            
            fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formObject)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAuditFormMessage(data.message, 'success');
                    auditForm.reset();
                } else {
                    showAuditFormMessage(data.error || 'Sorry, there was an error submitting your request. Please try again or email contact@montebay.io directly.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showAuditFormMessage('Sorry, there was an error submitting your request. Please try again or email contact@montebay.io directly.', 'error');
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Scroll to message
                setTimeout(() => {
                    auditFormMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            });
        });
    }
    
    function showAuditFormMessage(message, type) {
        if (auditFormMessage) {
            auditFormMessage.textContent = message;
            auditFormMessage.className = 'form-message ' + type;
            auditFormMessage.style.display = 'block';
            
            // Auto-hide after 10 seconds for success messages
            if (type === 'success') {
                setTimeout(() => {
                    auditFormMessage.style.display = 'none';
                }, 10000);
            }
        }
    }
});

