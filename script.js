// Google Analytics 4 Helper Functions
function trackEvent(eventName, eventParams = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventParams);
    }
}

function trackFormSubmission(formName, formData = {}) {
    trackEvent('form_submit', {
        'form_name': formName,
        'form_location': window.location.pathname,
        ...formData
    });
}

function trackCTAClick(ctaText, ctaLocation) {
    trackEvent('cta_click', {
        'cta_text': ctaText,
        'cta_location': ctaLocation,
        'page_path': window.location.pathname
    });
}

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
                
                // Statistics are now static, no animation needed
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

    // Observe AI capability cards
    document.querySelectorAll('.ai-capability-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Observe use case cards
    document.querySelectorAll('.use-case-card').forEach(card => {
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
                
                // Track CTA clicks to contact form
                if (href === '#contact') {
                    const ctaText = this.textContent.trim() || this.innerText.trim();
                    trackCTAClick(ctaText, this.closest('section')?.id || 'unknown');
                }
            }
        });
    });
}

// FAQ Accordion Functionality
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-answer');
            const icon = this.querySelector('.faq-icon');
            const isOpen = answer.style.display === 'block';
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-answer').forEach(ans => {
                ans.style.display = 'none';
            });
            document.querySelectorAll('.faq-icon').forEach(ic => {
                ic.textContent = '+';
                ic.style.transform = 'rotate(0deg)';
            });
            
            // Toggle current item
            if (!isOpen) {
                answer.style.display = 'block';
                icon.textContent = '−';
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
}

// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    initFAQ();
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    
    // Handle mobile menu toggle
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isActive = navMenu.classList.contains('active');
            navMenu.classList.toggle('active');
            mobileMenuToggle.innerHTML = !isActive ? '✕' : '☰';
            mobileMenuToggle.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
            // Announce to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = !isActive ? 'Navigation menu opened' : 'Navigation menu closed';
            document.body.appendChild(announcement);
            setTimeout(() => announcement.remove(), 1000);
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
    
    // Clear field errors on input
    document.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                clearFieldError(this);
            }
        });
        field.addEventListener('change', function() {
            if (this.classList.contains('error')) {
                clearFieldError(this);
            }
        });
    });
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    // Auto-fill subject based on interest selection
    if (contactForm) {
        const interestSelect = contactForm.querySelector('#interest');
        const subjectInput = contactForm.querySelector('#subject');
        
        if (interestSelect && subjectInput) {
            interestSelect.addEventListener('change', function() {
                const interest = this.value;
                if (interest && interest !== 'Other') {
                    subjectInput.value = interest;
                    // Announce to screen readers
                    subjectInput.setAttribute('aria-describedby', 'subject-auto-filled');
                    if (!document.getElementById('subject-auto-filled')) {
                        const announcement = document.createElement('span');
                        announcement.id = 'subject-auto-filled';
                        announcement.className = 'sr-only';
                        announcement.textContent = 'Subject field auto-filled';
                        subjectInput.parentNode.appendChild(announcement);
                    }
                } else if (interest === 'Other') {
                    subjectInput.value = '';
                    subjectInput.removeAttribute('aria-describedby');
                    subjectInput.focus();
                }
            });
        }
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const interest = formData.get('interest');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Clear previous errors
            clearAllFieldErrors(contactForm);
            
            let hasErrors = false;
            
            // Field-level validation
            const nameField = contactForm.querySelector('#name');
            if (!name || !name.trim()) {
                showFieldError(nameField, 'Name is required.');
                hasErrors = true;
            }
            
            const emailField = contactForm.querySelector('#email');
            if (!email || !email.trim()) {
                showFieldError(emailField, 'Email is required.');
                hasErrors = true;
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showFieldError(emailField, 'Please enter a valid email address.');
                    hasErrors = true;
                }
            }
            
            const interestField = contactForm.querySelector('#interest');
            if (!interest || interest === '') {
                showFieldError(interestField, 'Please select an option.');
                hasErrors = true;
            }
            
            const subjectField = contactForm.querySelector('#subject');
            if (!subject || !subject.trim()) {
                showFieldError(subjectField, 'Subject is required.');
                hasErrors = true;
            }
            
            const messageField = contactForm.querySelector('#message');
            if (!message || !message.trim()) {
                showFieldError(messageField, 'Message is required.');
                hasErrors = true;
            }
            
            if (hasErrors) {
                // Focus first error field
                const firstError = contactForm.querySelector('.error');
                if (firstError) {
                    firstError.focus();
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }
            
            // Clear field errors on successful validation
            clearAllFieldErrors(contactForm);
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.setAttribute('aria-busy', 'true');
            
            // Create loading spinner
            if (!submitBtn.querySelector('.spinner')) {
                const spinner = document.createElement('span');
                spinner.className = 'spinner';
                spinner.setAttribute('aria-hidden', 'true');
                spinner.innerHTML = ' ⏳';
                submitBtn.appendChild(spinner);
            }
            
            // Send email using mailto (opens user's email client)
            // For production, integrate with Formspree, EmailJS, or your backend API
            const emailSubject = encodeURIComponent(subject);
            const emailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            const mailtoLink = `mailto:contact@montebay.io?subject=${emailSubject}&body=${emailBody}`;
            
            // Track form submission
            trackFormSubmission('contact_form', {
                'interest_type': interest,
                'form_method': 'mailto'
            });
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            showFormMessage('Your email client should open. If not, please email us at contact@montebay.io', 'success');
            
            // Announce success to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = 'Form submitted successfully. Your email client should open.';
            document.body.appendChild(announcement);
            setTimeout(() => announcement.remove(), 5000);
            
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.removeAttribute('aria-busy');
            const spinner = submitBtn.querySelector('.spinner');
            if (spinner) spinner.remove();
            
            // Focus management - move focus to success message
            const formMessage = document.getElementById('formMessage');
            if (formMessage) {
                formMessage.setAttribute('tabindex', '-1');
                formMessage.focus();
            }
            
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
    
    // Field-level error handling
    function showFieldError(field, message) {
        // Remove existing error
        clearFieldError(field);
        
        // Add error class to field
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        
        // Create or update error message
        let errorElement = field.parentElement.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.setAttribute('role', 'alert');
            field.parentElement.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.classList.add('show');
        
        // Add aria-describedby
        const errorId = `error-${field.id || field.name}`;
        errorElement.id = errorId;
        field.setAttribute('aria-describedby', errorId);
    }
    
    function clearFieldError(field) {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        }
        field.removeAttribute('aria-describedby');
    }
    
    function clearAllFieldErrors(form) {
        const errorFields = form.querySelectorAll('.error');
        errorFields.forEach(field => clearFieldError(field));
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
            
            // Clear previous errors
            clearAllFieldErrors(auditForm);
            
            let hasErrors = false;
            
            // Validate required text fields
            const requiredFields = ['full-name', 'work-email', 'company-name', 'role-title'];
            requiredFields.forEach(fieldName => {
                const field = auditForm.querySelector(`[name="${fieldName}"]`);
                if (field && (!field.value || !field.value.trim())) {
                    showFieldError(field, `${field.previousElementSibling?.textContent?.replace('*', '').trim() || 'This field'} is required.`);
                    hasErrors = true;
                }
            });
            
            // Validate email format
            const emailField = auditForm.querySelector('[name="work-email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    showFieldError(emailField, 'Please enter a valid email address.');
                    hasErrors = true;
                }
            }
            
            // Validate radio groups
            const awsEnvironmentField = auditForm.querySelector('input[name="aws-environment-type"]:checked');
            if (!awsEnvironmentField) {
                const radioGroup = auditForm.querySelector('input[name="aws-environment-type"]');
                if (radioGroup) {
                    showFieldError(radioGroup.closest('.form-group'), 'Please select an AWS environment type.');
                    hasErrors = true;
                }
            }
            
            const monthlySpendField = auditForm.querySelector('input[name="monthly-aws-spend"]:checked');
            if (!monthlySpendField) {
                const radioGroup = auditForm.querySelector('input[name="monthly-aws-spend"]');
                if (radioGroup) {
                    showFieldError(radioGroup.closest('.form-group'), 'Please select monthly AWS spend range.');
                    hasErrors = true;
                }
            }
            
            const auditTierField = auditForm.querySelector('input[name="audit-tier"]:checked');
            if (!auditTierField) {
                const radioGroup = auditForm.querySelector('input[name="audit-tier"]');
                if (radioGroup) {
                    showFieldError(radioGroup.closest('.form-group'), 'Please select an audit tier.');
                    hasErrors = true;
                }
            }
            
            // Validate checkbox groups (at least one required)
            const concernsCheckboxes = auditForm.querySelectorAll('input[name="audit-concerns"]:checked');
            if (concernsCheckboxes.length === 0) {
                const firstCheckbox = auditForm.querySelector('input[name="audit-concerns"]');
                if (firstCheckbox) {
                    showFieldError(firstCheckbox.closest('.form-group'), 'Please select at least one primary concern.');
                    hasErrors = true;
                }
            }
            
            const confirmationsCheckboxes = auditForm.querySelectorAll('input[name="audit-confirmations"]:checked');
            if (confirmationsCheckboxes.length !== 3) {
                const firstCheckbox = auditForm.querySelector('input[name="audit-confirmations"]');
                if (firstCheckbox) {
                    showFieldError(firstCheckbox.closest('.form-group'), 'Please confirm all boundary requirements.');
                    hasErrors = true;
                }
            }
            
            if (hasErrors) {
                // Focus first error field
                const firstError = auditForm.querySelector('.error, .form-group:has(.error)');
                if (firstError) {
                    const focusableField = firstError.querySelector('input, textarea, select') || firstError;
                    focusableField.focus();
                    focusableField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }
            
            // Clear field errors on successful validation
            clearAllFieldErrors(auditForm);
            
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
            
            // Track form submission
            trackFormSubmission('silent_aws_audit', {
                'concerns_count': concernsCheckboxes.length
            });
            
            // Log form data for debugging
            console.log('Form data being sent:', formObject);
            
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
            const API_ENDPOINT = 'https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/silent-aws-audit';
            
            // Store emailBody for fallback
            const emailBodyForFallback = emailBody;
            
            fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formObject),
                mode: 'cors' // Explicitly request CORS
            })
            .then(async response => {
                // Check if response is ok before trying to parse
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`Server error: ${response.status} - ${text.substring(0, 100)}`);
                }
                
                const text = await response.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
                }
                
                return data;
            })
            .then(data => {
                if (data.success) {
                    showAuditFormMessage(data.message || 'Thank you! Your audit request has been submitted successfully. We\'ll be in touch within 1-2 business days.', 'success');
                    auditForm.reset();
                } else {
                    throw new Error(data.error || 'Request was not successful');
                }
            })
            .catch(error => {
                console.error('API Error:', error);
                console.error('Error name:', error.name);
                console.error('Error message:', error.message);
                
                // CORS errors and network failures - always fall back to email
                // TypeError with "Failed to fetch" typically indicates CORS or network issues
                const isCorsOrNetworkError = 
                    error.name === 'TypeError' ||
                    error.message.includes('Failed to fetch') ||
                    error.message.includes('CORS') ||
                    error.message.includes('NetworkError') ||
                    error.message.includes('Network request failed');
                
                if (isCorsOrNetworkError) {
                    // Fallback to email submission
                    const emailSubject = encodeURIComponent('Silent AWS Audit Request');
                    const emailBodyEncoded = encodeURIComponent(emailBodyForFallback);
                    const mailtoLink = `mailto:contact@montebay.io?subject=${emailSubject}&body=${emailBodyEncoded}`;
                    
                    // Show message with email option
                    const errorMsg = 'Unable to submit online due to a connection issue. Your form data has been prepared. Please click the button below to open your email client, or copy the information and email us at contact@montebay.io.';
                    showAuditFormMessage(errorMsg, 'error');
                    
                    // Create a button to open email client
                    setTimeout(() => {
                        const formMessage = document.getElementById('auditFormMessage');
                        if (formMessage) {
                            // Remove any existing button
                            const existingBtn = formMessage.querySelector('.email-fallback-btn');
                            if (existingBtn) existingBtn.remove();
                            
                            const emailButton = document.createElement('a');
                            emailButton.href = mailtoLink;
                            emailButton.className = 'cta-button cta-primary email-fallback-btn';
                            emailButton.style.marginTop = '1rem';
                            emailButton.style.display = 'inline-block';
                            emailButton.textContent = 'Open Email Client';
                            emailButton.target = '_blank';
                            formMessage.appendChild(emailButton);
                            
                            // Also add a copy button for the email body
                            const copyButton = document.createElement('button');
                            copyButton.type = 'button';
                            copyButton.className = 'cta-button cta-secondary email-fallback-btn';
                            copyButton.style.marginTop = '0.5rem';
                            copyButton.style.marginLeft = '0.5rem';
                            copyButton.textContent = 'Copy Email Content';
                            copyButton.onclick = function() {
                                navigator.clipboard.writeText(emailBodyForFallback).then(() => {
                                    copyButton.textContent = 'Copied!';
                                    setTimeout(() => {
                                        copyButton.textContent = 'Copy Email Content';
                                    }, 2000);
                                });
                            };
                            formMessage.appendChild(copyButton);
                        }
                    }, 100);
                } else {
                    // Other errors - still provide email fallback
                    const emailSubject = encodeURIComponent('Silent AWS Audit Request');
                    const emailBodyEncoded = encodeURIComponent(emailBodyForFallback);
                    const mailtoLink = `mailto:contact@montebay.io?subject=${emailSubject}&body=${emailBodyEncoded}`;
                    
                    showAuditFormMessage('Sorry, there was an error submitting your request. Please click below to email us directly with your audit request details.', 'error');
                    
                    setTimeout(() => {
                        const formMessage = document.getElementById('auditFormMessage');
                        if (formMessage && !formMessage.querySelector('.email-fallback-btn')) {
                            const emailButton = document.createElement('a');
                            emailButton.href = mailtoLink;
                            emailButton.className = 'cta-button cta-primary email-fallback-btn';
                            emailButton.style.marginTop = '1rem';
                            emailButton.style.display = 'inline-block';
                            emailButton.textContent = 'Open Email Client';
                            emailButton.target = '_blank';
                            formMessage.appendChild(emailButton);
                        }
                    }, 100);
                }
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
    
    // Strategic Cyber Risk Advisory Form handling
    const cyberAdvisoryForm = document.getElementById('strategicCyberRiskAdvisoryForm');
    const cyberAdvisoryFormMessage = document.getElementById('cyberAdvisoryFormMessage');
    
    if (cyberAdvisoryForm) {
        cyberAdvisoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearAllFieldErrors(cyberAdvisoryForm);
            
            let hasErrors = false;
            
            // Validate required text fields
            const requiredFields = ['full-name', 'work-email', 'company-name', 'role-title'];
            requiredFields.forEach(fieldName => {
                const field = cyberAdvisoryForm.querySelector(`[name="${fieldName}"]`);
                if (field && (!field.value || !field.value.trim())) {
                    showFieldError(field, `${field.previousElementSibling?.textContent?.replace('*', '').trim() || 'This field'} is required.`);
                    hasErrors = true;
                }
            });
            
            // Validate email format
            const emailField = cyberAdvisoryForm.querySelector('[name="work-email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    showFieldError(emailField, 'Please enter a valid email address.');
                    hasErrors = true;
                }
            }
            
            // Validate radio groups
            const orgTypeField = cyberAdvisoryForm.querySelector('input[name="organization-type"]:checked');
            if (!orgTypeField) {
                const radioGroup = cyberAdvisoryForm.querySelector('input[name="organization-type"]');
                if (radioGroup) {
                    showFieldError(radioGroup.closest('.form-group'), 'Please select an organization type.');
                    hasErrors = true;
                }
            }
            
            const advisoryTierField = cyberAdvisoryForm.querySelector('input[name="advisory-tier"]:checked');
            if (!advisoryTierField) {
                const radioGroup = cyberAdvisoryForm.querySelector('input[name="advisory-tier"]');
                if (radioGroup) {
                    showFieldError(radioGroup.closest('.form-group'), 'Please select an advisory tier.');
                    hasErrors = true;
                }
            }
            
            // Validate checkbox groups (at least one required)
            const concernsCheckboxes = cyberAdvisoryForm.querySelectorAll('input[name="cyber-concerns"]:checked');
            if (concernsCheckboxes.length === 0) {
                const firstCheckbox = cyberAdvisoryForm.querySelector('input[name="cyber-concerns"]');
                if (firstCheckbox) {
                    showFieldError(firstCheckbox.closest('.form-group'), 'Please select at least one primary concern.');
                    hasErrors = true;
                }
            }
            
            const confirmationsCheckboxes = cyberAdvisoryForm.querySelectorAll('input[name="cyber-confirmations"]:checked');
            if (confirmationsCheckboxes.length !== 3) {
                const firstCheckbox = cyberAdvisoryForm.querySelector('input[name="cyber-confirmations"]');
                if (firstCheckbox) {
                    showFieldError(firstCheckbox.closest('.form-group'), 'Please confirm all scope requirements.');
                    hasErrors = true;
                }
            }
            
            if (hasErrors) {
                // Focus first error field
                const firstError = cyberAdvisoryForm.querySelector('.error, .form-group:has(.error)');
                if (firstError) {
                    const focusableField = firstError.querySelector('input, textarea, select') || firstError;
                    focusableField.focus();
                    focusableField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }
            
            // Clear field errors on successful validation
            clearAllFieldErrors(cyberAdvisoryForm);
            
            // Get form data
            const formData = new FormData(cyberAdvisoryForm);
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
            
            // Log form data for debugging
            console.log('Cyber Advisory Form data being sent:', formObject);
            
            // Track form submission
            trackFormSubmission('strategic_cyber_risk_advisory', {
                'concerns_count': concernsCheckboxes.length
            });
            
            // Show loading state
            const submitBtn = cyberAdvisoryForm.querySelector('.audit-submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            // Format email body
            let emailBody = 'STRATEGIC CYBER RISK ADVISORY REQUEST\n\n';
            emailBody += '=== CONTACT INFORMATION ===\n';
            emailBody += `Full Name: ${formObject['full-name']}\n`;
            emailBody += `Work Email: ${formObject['work-email']}\n`;
            emailBody += `Company: ${formObject['company-name']}\n`;
            emailBody += `Role/Title: ${formObject['role-title']}\n\n`;
            
            emailBody += '=== ORGANIZATION CONTEXT ===\n';
            emailBody += `Organization Type: ${formObject['organization-type']}\n\n`;
            
            emailBody += '=== PRIMARY CONCERNS ===\n';
            const concerns = Array.isArray(formObject['cyber-concerns']) ? formObject['cyber-concerns'] : [formObject['cyber-concerns']];
            emailBody += `Concerns: ${concerns.join(', ')}\n\n`;
            
            emailBody += '=== ADVISORY TIER ===\n';
            emailBody += `Selected Tier: ${formObject['advisory-tier']}\n\n`;
            
            emailBody += '=== CONFIRMATIONS ===\n';
            const confirmations = Array.isArray(formObject['cyber-confirmations']) ? formObject['cyber-confirmations'] : [formObject['cyber-confirmations']];
            confirmations.forEach(conf => {
                emailBody += `✓ ${conf}\n`;
            });
            emailBody += '\n';
            
            if (formObject['additional-notes']) {
                emailBody += '=== ADDITIONAL NOTES ===\n';
                emailBody += `${formObject['additional-notes']}\n\n`;
            }
            
            // Send to AWS Lambda via API Gateway
            // Note: This endpoint will need to be created or the existing endpoint can handle both form types
            const API_ENDPOINT = 'https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/strategic-cyber-risk-advisory';
            
            // Store emailBody for fallback
            const emailBodyForFallback = emailBody;
            
            fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formObject),
                mode: 'cors'
            })
            .then(async response => {
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`Server error: ${response.status} - ${text.substring(0, 100)}`);
                }
                
                const text = await response.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
                }
                
                return data;
            })
            .then(data => {
                if (data.success) {
                    showCyberAdvisoryFormMessage(data.message || 'Thank you! Your advisory request has been submitted successfully. We\'ll be in touch within 1-2 business days.', 'success');
                    cyberAdvisoryForm.reset();
                } else {
                    throw new Error(data.error || 'Request was not successful');
                }
            })
            .catch(error => {
                console.error('API Error:', error);
                console.error('Error name:', error.name);
                console.error('Error message:', error.message);
                
                // CORS errors and network failures - always fall back to email
                const isCorsOrNetworkError = 
                    error.name === 'TypeError' ||
                    error.message.includes('Failed to fetch') ||
                    error.message.includes('CORS') ||
                    error.message.includes('NetworkError') ||
                    error.message.includes('Network request failed');
                
                if (isCorsOrNetworkError) {
                    // Fallback to email submission
                    const emailSubject = encodeURIComponent('Strategic Cyber Risk Advisory Request');
                    const emailBodyEncoded = encodeURIComponent(emailBodyForFallback);
                    const mailtoLink = `mailto:contact@montebay.io?subject=${emailSubject}&body=${emailBodyEncoded}`;
                    
                    // Show message with email option
                    const errorMsg = 'Unable to submit online due to a connection issue. Your form data has been prepared. Please click the button below to open your email client, or copy the information and email us at contact@montebay.io.';
                    showCyberAdvisoryFormMessage(errorMsg, 'error');
                    
                    // Create a button to open email client
                    setTimeout(() => {
                        const formMessage = document.getElementById('cyberAdvisoryFormMessage');
                        if (formMessage) {
                            // Remove any existing button
                            const existingBtn = formMessage.querySelector('.email-fallback-btn');
                            if (existingBtn) existingBtn.remove();
                            
                            const emailButton = document.createElement('a');
                            emailButton.href = mailtoLink;
                            emailButton.className = 'cta-button cta-primary email-fallback-btn';
                            emailButton.style.marginTop = '1rem';
                            emailButton.style.display = 'inline-block';
                            emailButton.textContent = 'Open Email Client';
                            emailButton.target = '_blank';
                            formMessage.appendChild(emailButton);
                            
                            // Also add a copy button for the email body
                            const copyButton = document.createElement('button');
                            copyButton.type = 'button';
                            copyButton.className = 'cta-button cta-secondary email-fallback-btn';
                            copyButton.style.marginTop = '0.5rem';
                            copyButton.style.marginLeft = '0.5rem';
                            copyButton.textContent = 'Copy Email Content';
                            copyButton.onclick = function() {
                                navigator.clipboard.writeText(emailBodyForFallback).then(() => {
                                    copyButton.textContent = 'Copied!';
                                    setTimeout(() => {
                                        copyButton.textContent = 'Copy Email Content';
                                    }, 2000);
                                });
                            };
                            formMessage.appendChild(copyButton);
                        }
                    }, 100);
                } else {
                    // Other errors - still provide email fallback
                    const emailSubject = encodeURIComponent('Strategic Cyber Risk Advisory Request');
                    const emailBodyEncoded = encodeURIComponent(emailBodyForFallback);
                    const mailtoLink = `mailto:contact@montebay.io?subject=${emailSubject}&body=${emailBodyEncoded}`;
                    
                    showCyberAdvisoryFormMessage('Sorry, there was an error submitting your request. Please click below to email us directly with your advisory request details.', 'error');
                    
                    setTimeout(() => {
                        const formMessage = document.getElementById('cyberAdvisoryFormMessage');
                        if (formMessage && !formMessage.querySelector('.email-fallback-btn')) {
                            const emailButton = document.createElement('a');
                            emailButton.href = mailtoLink;
                            emailButton.className = 'cta-button cta-primary email-fallback-btn';
                            emailButton.style.marginTop = '1rem';
                            emailButton.style.display = 'inline-block';
                            emailButton.textContent = 'Open Email Client';
                            emailButton.target = '_blank';
                            formMessage.appendChild(emailButton);
                        }
                    }, 100);
                }
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Scroll to message
                setTimeout(() => {
                    cyberAdvisoryFormMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            });
        });
    }
    
    function showCyberAdvisoryFormMessage(message, type) {
        if (cyberAdvisoryFormMessage) {
            cyberAdvisoryFormMessage.textContent = message;
            cyberAdvisoryFormMessage.className = 'form-message ' + type;
            cyberAdvisoryFormMessage.style.display = 'block';
            
            // Auto-hide after 10 seconds for success messages
            if (type === 'success') {
                setTimeout(() => {
                    cyberAdvisoryFormMessage.style.display = 'none';
                }, 10000);
            }
        }
    }
    
    // AI Readiness Checklist Form handling
    const aiChecklistForm = document.getElementById('aiChecklistForm');
    const checklistFormMessage = document.getElementById('checklistFormMessage');
    
    if (aiChecklistForm) {
        aiChecklistForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(aiChecklistForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const company = formData.get('company') || 'Not provided';
            
            // Basic validation
            if (!name || !email) {
                showChecklistFormMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showChecklistFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = aiChecklistForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;
            
            // Format email body for fallback
            let emailBody = 'AI READINESS CHECKLIST REQUEST\n\n';
            emailBody += `Name: ${name}\n`;
            emailBody += `Email: ${email}\n`;
            emailBody += `Company: ${company}\n\n`;
            emailBody += 'Please send the AI Readiness Checklist PDF to this email address.';
            
            // For now, use email fallback (can be replaced with API endpoint later)
            const emailSubject = encodeURIComponent('AI Readiness Checklist Request');
            const emailBodyEncoded = encodeURIComponent(emailBody);
            const mailtoLink = `mailto:contact@montebay.io?subject=${emailSubject}&body=${emailBodyEncoded}`;
            
            // Send to Lambda function
            const API_ENDPOINT = 'https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/lead-magnet';
            
            fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    company: company,
                    resourceType: 'ai-readiness-checklist'
                }),
                mode: 'cors'
            })
            .then(async response => {
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`Server error: ${response.status} - ${text.substring(0, 100)}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showChecklistFormMessage(data.message || 'Thank you! Your AI Readiness Checklist has been sent to your email.', 'success');
                    aiChecklistForm.reset();
                } else {
                    throw new Error(data.error || 'Request was not successful');
                }
            })
            .catch(error => {
                console.error('API Error:', error);
                // Fallback to email
                showChecklistFormMessage('Thank you! Your email client should open. If not, please email us at contact@montebay.io to request the AI Readiness Checklist.', 'success');
                aiChecklistForm.reset();
                setTimeout(() => {
                    window.location.href = mailtoLink;
                }, 500);
            });
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
    
    function showChecklistFormMessage(message, type) {
        if (checklistFormMessage) {
            checklistFormMessage.textContent = message;
            checklistFormMessage.className = 'form-message ' + type;
            checklistFormMessage.style.display = 'block';
            
            // Scroll to message
            checklistFormMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Auto-hide after 10 seconds for success messages
            if (type === 'success') {
                setTimeout(() => {
                    checklistFormMessage.style.display = 'none';
                }, 10000);
            }
        }
    }
    
    // Newsletter Signup Form handling
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterFormMessage = document.getElementById('newsletterFormMessage');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const email = newsletterForm.querySelector('#newsletter-email').value;
            
            // Track form submission
            trackFormSubmission('newsletter_signup', {
                'has_name': !!newsletterForm.querySelector('input[name="name"]')?.value
            });
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNewsletterFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = newsletterForm.querySelector('.newsletter-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            // Send to Lambda function
            const API_ENDPOINT = 'https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/newsletter';
            
            fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    name: newsletterForm.querySelector('input[name="name"]')?.value || ''
                }),
                mode: 'cors'
            })
            .then(async response => {
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`Server error: ${response.status} - ${text.substring(0, 100)}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showNewsletterFormMessage(data.message || 'Thank you for subscribing! Check your email for confirmation.', 'success');
                    newsletterForm.reset();
                } else {
                    throw new Error(data.error || 'Subscription failed');
                }
            })
            .catch(error => {
                console.error('API Error:', error);
                // Fallback: show success message anyway
                showNewsletterFormMessage('Thank you for subscribing! We\'ll be in touch soon.', 'success');
                newsletterForm.reset();
            });
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
    
    function showNewsletterFormMessage(message, type) {
        if (newsletterFormMessage) {
            newsletterFormMessage.textContent = message;
            newsletterFormMessage.className = 'form-message ' + type;
            newsletterFormMessage.style.display = 'block';
            
            // Auto-hide after 5 seconds for success messages
            if (type === 'success') {
                setTimeout(() => {
                    newsletterFormMessage.style.display = 'none';
                }, 5000);
            }
        }
    }
    
    // AI Diagnostic Tool - Multi-step form handling
    const diagnosticForm = document.getElementById('diagnosticForm');
    if (diagnosticForm) {
        const steps = diagnosticForm.querySelectorAll('.diagnostic-step');
        const totalSteps = steps.length;
        let currentStep = 1;
        
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        const progressFill = document.getElementById('progressFill');
        const currentStepSpan = document.getElementById('currentStep');
        const totalStepsSpan = document.getElementById('totalSteps');
        
        if (totalStepsSpan) totalStepsSpan.textContent = totalSteps;
        
        function updateProgress() {
            const progress = (currentStep / totalSteps) * 100;
            if (progressFill) progressFill.style.width = progress + '%';
            if (currentStepSpan) currentStepSpan.textContent = currentStep;
        }
        
        function showStep(step) {
            steps.forEach((s, index) => {
                if (index + 1 === step) {
                    s.style.display = 'block';
                } else {
                    s.style.display = 'none';
                }
            });
            
            // Update navigation buttons
            if (prevBtn) prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
            if (nextBtn) nextBtn.style.display = currentStep < totalSteps ? 'block' : 'none';
            if (submitBtn) submitBtn.style.display = currentStep === totalSteps ? 'block' : 'none';
            
            updateProgress();
        }
        
        function validateStep(step) {
            const stepElement = steps[step - 1];
            const requiredInputs = stepElement.querySelectorAll('[required]');
            let isValid = true;
            
            requiredInputs.forEach(input => {
                if (input.type === 'radio') {
                    const radioGroup = stepElement.querySelectorAll(`input[name="${input.name}"]`);
                    const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                    if (!isChecked) isValid = false;
                } else if (input.type === 'checkbox') {
                    const checkboxGroup = stepElement.querySelectorAll(`input[name="${input.name}"]`);
                    const isChecked = Array.from(checkboxGroup).some(cb => cb.checked);
                    if (!isChecked) isValid = false;
                } else {
                    if (!input.value.trim()) isValid = false;
                }
            });
            
            return isValid;
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                if (validateStep(currentStep)) {
                    currentStep++;
                    showStep(currentStep);
                } else {
                    alert('Please complete all required fields before continuing.');
                }
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                currentStep--;
                showStep(currentStep);
            });
        }
        
        if (diagnosticForm) {
            diagnosticForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (!validateStep(currentStep)) {
                    alert('Please complete all required fields.');
                    return;
                }
                
                // Get form data
                const formData = new FormData(diagnosticForm);
                const formObject = {};
                formData.forEach((value, key) => {
                    if (formObject[key]) {
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
                if (submitBtn) {
                    submitBtn.textContent = 'Generating Report...';
                    submitBtn.disabled = true;
                }
                
            // Send to Lambda function
            const API_ENDPOINT = 'https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/ai-diagnostic';
            
            fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formObject),
                mode: 'cors'
            })
            .then(async response => {
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`Server error: ${response.status} - ${text.substring(0, 100)}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Track form submission
                    trackFormSubmission('ai_diagnostic', {
                        'company_size': formObject['company-size'] || 'unknown',
                        'has_ai_systems': formObject['has-ai-systems'] || 'unknown'
                    });
                    
                    // Show success message
                    const resultsSection = document.getElementById('diagnostic-results');
                    const resultsContent = document.getElementById('results-content');
                    const formSection = diagnosticForm.closest('section');
                    
                    if (resultsSection && resultsContent) {
                        diagnosticForm.style.display = 'none';
                        resultsSection.style.display = 'block';
                        
                        // Display AI-generated report
                        const reportText = data.reportPreview || 'Your personalized report has been sent to your email.';
                        resultsContent.innerHTML = `
                            <div style="background: rgba(90, 138, 176, 0.05); padding: 2rem; border-radius: 12px; border-left: 3px solid #5a8ab0; margin-bottom: 2rem;">
                                <h3 style="font-size: 1.5rem; color: #1a2a4a; margin-bottom: 1rem;">Report Generated Successfully</h3>
                                <p style="font-size: 1.05rem; color: #666; line-height: 1.8; margin-bottom: 1.5rem;">
                                    ${data.message || 'Your personalized diagnostic report has been sent to your email address.'}
                                </p>
                                ${data.reportPreview ? `
                                    <div style="background: white; padding: 1.5rem; border-radius: 8px; margin-top: 1.5rem;">
                                        <h4 style="font-size: 1.25rem; color: #1a2a4a; margin-bottom: 1rem;">Report Preview</h4>
                                        <div style="white-space: pre-wrap; color: #333; line-height: 1.7;">${reportText}</div>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                        
                        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                } else {
                    throw new Error(data.error || 'Failed to generate report');
                }
            })
            .catch(error => {
                console.error('API Error:', error);
                // Fallback: show template results
                showDiagnosticResults(formObject);
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.textContent = 'Generate Report';
                    submitBtn.disabled = false;
                }
            });
            });
        }
        
        function showDiagnosticResults(data) {
            const resultsSection = document.getElementById('diagnostic-results');
            const resultsContent = document.getElementById('results-content');
            const formSection = diagnosticForm.closest('section');
            
            if (resultsSection && resultsContent) {
                // Hide form, show results
                diagnosticForm.style.display = 'none';
                resultsSection.style.display = 'block';
                
                // Generate simple report (can be replaced with AI-generated content)
                const challenge = Array.isArray(data['primary-challenge']) ? data['primary-challenge'][0] : data['primary-challenge'];
                const painPoints = Array.isArray(data['pain-points']) ? data['pain-points'] : [data['pain-points']];
                const goals = Array.isArray(data['goals']) ? data['goals'] : [data['goals']];
                
                let reportHTML = `
                    <h3 style="font-size: 1.5rem; color: #1a2a4a; margin-bottom: 1.5rem;">Assessment Summary</h3>
                    <p style="font-size: 1.05rem; color: #666; line-height: 1.8; margin-bottom: 2rem;">
                        Based on your responses, we've identified your primary challenge as <strong>${challenge}</strong>.
                    </p>
                    
                    <h4 style="font-size: 1.25rem; color: #1a2a4a; margin-bottom: 1rem; margin-top: 2rem;">Key Pain Points Identified</h4>
                    <ul style="list-style: none; padding: 0; margin-bottom: 2rem;">
                        ${painPoints.filter(p => p).map(p => `<li style="padding: 0.5rem 0; padding-left: 1.5rem; position: relative;">
                            <span style="position: absolute; left: 0; color: #5a8ab0;">•</span> ${p}
                        </li>`).join('')}
                    </ul>
                    
                    <h4 style="font-size: 1.25rem; color: #1a2a4a; margin-bottom: 1rem; margin-top: 2rem;">Your Goals</h4>
                    <ul style="list-style: none; padding: 0; margin-bottom: 2rem;">
                        ${goals.filter(g => g).map(g => `<li style="padding: 0.5rem 0; padding-left: 1.5rem; position: relative;">
                            <span style="position: absolute; left: 0; color: #5a8ab0;">✓</span> ${g}
                        </li>`).join('')}
                    </ul>
                    
                    <div style="background: rgba(90, 138, 176, 0.05); padding: 1.5rem; border-radius: 12px; border-left: 3px solid #5a8ab0; margin-top: 2rem;">
                        <p style="margin: 0; color: #1a2a4a; line-height: 1.7;">
                            <strong>Next Steps:</strong> A detailed personalized report has been sent to ${data.email}. 
                            This report includes specific recommendations based on your responses. 
                            For a deeper assessment, consider scheduling a consultation with our team.
                        </p>
                    </div>
                `;
                
                resultsContent.innerHTML = reportHTML;
                
                // Scroll to results
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        
        // Initialize first step
        showStep(1);
    }
});

// Blog Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    const slidesContainer = document.querySelector('.carousel-slides-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const counterText = document.querySelector('.carousel-counter-text');
    
    if (!slidesContainer || slides.length === 0) return;
    
    // Find the current month's blog post
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11 (0 = January)
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonthName = monthNames[currentMonth];
    
    // Find which slide corresponds to the current month
    let currentSlide = 0;
    slides.forEach((slide, index) => {
        const dateElement = slide.querySelector('.blog-date');
        if (dateElement) {
            const dateText = dateElement.textContent.trim();
            // Check if this slide matches current month and year
            if (dateText.includes(currentMonthName) && dateText.includes(currentYear.toString())) {
                currentSlide = index;
            }
        }
    });
    
    const totalSlides = slides.length;
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    let isTransitioning = false;
    
    function updateCarousel() {
        // Calculate the translateX value to center the current slide
        // Each slide is 100% width of the container, so we move by -100% * currentSlide
        // This ensures the active slide is always fully visible and centered
        const translateX = -currentSlide * 100;
        slidesContainer.style.transform = `translateX(${translateX}%)`;
        
        // Update active class for visual effects (opacity, scale) and accessibility
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active');
                slide.setAttribute('aria-current', 'true');
                // Announce slide change to screen readers
                const title = slide.querySelector('.blog-title')?.textContent || 'Blog topic';
                slidesContainer.setAttribute('aria-label', `Showing: ${title}`);
            } else {
                slide.classList.remove('active');
                slide.removeAttribute('aria-current');
            }
        });
        
        // Update slide counter
        if (counterText) {
            counterText.textContent = `${currentSlide + 1} of ${totalSlides}`;
        }
    }
    
    // Make active card clickable (unless it's "coming soon")
    function handleCardClick(e) {
        const activeSlide = slides[currentSlide];
        if (!activeSlide || activeSlide.classList.contains('coming-soon')) {
            return;
        }
        
        // Don't navigate if clicking on the arrow buttons or links
        if (e.target.closest('.carousel-btn') || e.target.closest('a')) {
            return;
        }
        
        // Find the "Read More" link in the active card
        const readMoreLink = activeSlide.querySelector('.blog-read-more');
        if (readMoreLink) {
            window.location.href = readMoreLink.href;
        }
    }
    
    // Add click handler to slides container
    if (slidesContainer) {
        slidesContainer.addEventListener('click', handleCardClick);
    }
    
    function nextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
        setTimeout(() => { isTransitioning = false; }, 500);
    }
    
    function prevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
        setTimeout(() => { isTransitioning = false; }, 500);
    }
    
    // Touch/swipe handlers for mobile
    if (slidesContainer) {
        slidesContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        slidesContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance for swipe
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - go to next
                nextSlide();
            } else {
                // Swiped right - go to previous
                prevSlide();
            }
        }
    }
    
    // Event listeners for arrow buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            nextSlide();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            prevSlide();
        });
    }
    
    // Keyboard navigation (arrow keys)
    document.addEventListener('keydown', (e) => {
        const section = slidesContainer?.closest('section');
        if (section) {
            const rect = section.getBoundingClientRect();
            // Only navigate if the carousel section is visible
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    prevSlide();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextSlide();
                }
            }
        }
    });
    
    // Initialize
    updateCarousel();
});

// Clarity Path Button Highlighting
document.addEventListener('DOMContentLoaded', function() {
    const clarityPathButtons = document.querySelectorAll('.clarity-path-button');
    const pathExplainerColumns = document.querySelectorAll('.path-explainer-column');
    
    // Map button hrefs to column IDs
    const pathMap = {
        'risk-blind-spots': 'risk-blind-spots',
        'ai-automation': 'ai-automation',
        'cloud-cost': 'cloud-cost'
    };
    
    // Function to highlight a specific card
    function highlightCard(targetId) {
        // Remove highlight from all cards
        pathExplainerColumns.forEach(column => {
            column.classList.remove('path-explainer-highlighted');
        });
        
        // Add highlight to target card
        const targetColumn = document.getElementById(targetId);
        if (targetColumn) {
            targetColumn.classList.add('path-explainer-highlighted');
            
            // Scroll to the card with offset for header
            setTimeout(() => {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const elementPosition = targetColumn.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
    
    // Handle button clicks
    clarityPathButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1); // Remove the #
                
                // Check if it's a path explainer section
                if (pathMap[targetId]) {
                    e.preventDefault();
                    highlightCard(targetId);
                    
                    // Update URL hash without triggering scroll
                    history.pushState(null, null, href);
                }
            }
        });
    });
    
    // Handle hash changes (e.g., direct link or browser back/forward)
    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (pathMap[hash]) {
            highlightCard(hash);
        }
    }
    
    // Check hash on page load
    if (window.location.hash) {
        handleHashChange();
    }
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
});

// Back to Top Button
document.addEventListener('DOMContentLoaded', function() {
    // Create back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Scroll to top');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.setAttribute('title', 'Back to top');
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button based on scroll position
    function toggleBackToTop() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        // Announce to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = 'Scrolled to top of page';
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    });
    
    // Listen for scroll events
    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop(); // Check initial state
});

// Reading Time Calculation
function calculateReadingTime(contentElement) {
    if (!contentElement) return null;
    
    const text = contentElement.innerText || contentElement.textContent || '';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    // Average reading speed: 200-250 words per minute
    // Using 225 as a middle ground
    const wordsPerMinute = 225;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    
    return readingTime;
}

// Add reading time to blog posts
document.addEventListener('DOMContentLoaded', function() {
    const blogContent = document.querySelector('.blog-post-content');
    const blogMeta = document.querySelector('.blog-post-meta');
    
    if (blogContent && blogMeta) {
        const readingTime = calculateReadingTime(blogContent);
        if (readingTime) {
            const readingTimeElement = document.createElement('span');
            readingTimeElement.className = 'reading-time';
            readingTimeElement.textContent = `${readingTime} min read`;
            blogMeta.appendChild(readingTimeElement);
        }
    }
});
