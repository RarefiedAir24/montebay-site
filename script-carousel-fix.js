// Blog Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.blog-carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (!carousel || slides.length === 0) {
        return;
    }
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Initialize: show first slide
    if (slides[0]) {
        slides[0].classList.add('active');
    }
    
    function showSlide(index) {
        // Remove active class from all slides
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Add active class to current slide
        if (slides[index]) {
            slides[index].classList.add('active');
            currentSlide = index;
        }
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prev);
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
        const section = carousel?.closest('section');
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
});
