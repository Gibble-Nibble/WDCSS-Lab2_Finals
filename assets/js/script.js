/*
    ENHANCED PORTFOLIO JAVASCRIPT
    
    This file contains all the interactive functionality for the website:
    1. Carousel auto-play and navigation
    2. Scroll effects (navbar changes, section animations)
    3. Animated counters (statistics that count up)
    4. Skill progress bars (animated when scrolled into view)
    5. Floating elements interactions
    6. Smooth scrolling and loading animations
    
    The code is organized into modular functions for better readability and maintenance.
*/

// 
// MAIN INITIALIZATION: Wait for the page to fully load, then start all features
// DOMContentLoaded fires when HTML is completely loaded and parsed
//
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();          // Start carousel functionality
    initScrollEffects();     // Set up scroll-based animations and navbar changes
    initAnimatedCounters();  // Prepare counter animations (but don't run them yet)
    initSkillBars();         // Prepare skill bar animations (but don't run them yet)
    initSimpleHero();        // Simple hero section animation (replaces complex floating elements)
});

/*
    CAROUSEL FUNCTIONALITY
    
    Features:
    - Auto-play: Automatically moves to next slide every 5 seconds
    - User interaction: Stops auto-play when user clicks, resumes after 8 seconds
    - Keyboard navigation: Arrow keys control slides
    - Mouse interaction: Pause on hover, resume when mouse leaves
*/
function initCarousel() {
    // Get all the radio button controls for the carousel
    const carouselInputs = document.querySelectorAll('input[name="carousel"]');
    let currentSlide = 0;                    // Track which slide is currently showing
    const totalSlides = carouselInputs.length;  // How many slides total (4)
    let autoplayInterval;                    // Store the auto-play timer

    // 
    // AUTO-PLAY FUNCTION: Moves to next slide automatically
    //
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            // Calculate next slide (loops back to 0 after last slide)
            currentSlide = (currentSlide + 1) % totalSlides;
            
            // Check the corresponding radio button to show that slide
            if (carouselInputs[currentSlide]) {
                carouselInputs[currentSlide].checked = true;
            }
        }, 8000);  // Move to next slide every x seconds
    }

    //
    // STOP AUTO-PLAY: Clear the automatic timer
    //
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Start auto-play immediately when page loads
    startAutoplay();

    //
    // USER INTERACTION: Stop auto-play when user manually changes slides
    //
    carouselInputs.forEach((input, index) => {
        input.addEventListener('change', () => {
            if (input.checked) {
                currentSlide = index;        // Update current slide tracker
                stopAutoplay();              // Stop automatic movement
                setTimeout(startAutoplay, 10000);  // Resume auto-play after 8 seconds of no interaction
            }
        });
    });

    //
    // MOUSE INTERACTION: Pause on hover, resume when mouse leaves
    //
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoplay);   // Pause when mouse enters
        carousel.addEventListener('mouseleave', startAutoplay);  // Resume when mouse leaves
    }

    //
    // KEYBOARD NAVIGATION: Left/Right arrow keys control slides
    //
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            // Move to previous slide (wraps to last slide if on first)
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            if (carouselInputs[currentSlide]) {
                carouselInputs[currentSlide].checked = true;
                stopAutoplay();
                setTimeout(startAutoplay, 8000);
            }
        } else if (e.key === 'ArrowRight') {
            // Move to next slide (wraps to first slide if on last)
            currentSlide = (currentSlide + 1) % totalSlides;
            if (carouselInputs[currentSlide]) {
                carouselInputs[currentSlide].checked = true;
                stopAutoplay();
                setTimeout(startAutoplay, 8000);
            }
        }
    });
}

/*
    SCROLL EFFECTS AND ANIMATIONS
    
    This function handles:
    1. Navbar appearance changes when scrolling
    2. Section animations when they come into view (using Intersection Observer API)
    3. Triggering specific animations like skill bars and counters
*/
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    //
    // NAVBAR SCROLL EFFECT: Change navbar appearance when user scrolls down
    // - When scrolled more than 100px, add 'scrolled' class for styling changes
    //
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');      // Add scrolled styling
        } else {
            navbar.classList.remove('scrolled');   // Remove scrolled styling
        }
    });

    /*
        INTERSECTION OBSERVER: Modern way to detect when elements come into view
        
        This is much better than constantly checking scroll position because:
        - It's more performant (browser optimized)
        - It only fires when elements actually enter/leave the viewport
        - It handles complex cases like elements being partially visible
    */
    
    // Configuration for the observer
    const observerOptions = {
        threshold: 0.1,                           // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px'          // Start animation 50px before element enters view
    };

    // Create the observer with a callback function
    const observer = new IntersectionObserver((entries) => {
        // entries is an array of all elements being observed
        entries.forEach(entry => {
            // entry.isIntersecting is true when element comes into view
            if (entry.isIntersecting) {
                // FADE IN ANIMATION: Make the section visible and slide up
                entry.target.style.opacity = '1';              // Fade in
                entry.target.style.transform = 'translateY(0)'; // Slide to final position
                
                /*
                    SPECIFIC SECTION ANIMATIONS: Trigger special animations for certain sections
                    - Skills section: animate the progress bars
                    - About section: animate the counting numbers
                */
                
                // Check if this is the skills section, then animate skill bars
                if (entry.target.classList.contains('skills-section')) {
                    animateSkillBars();     // Start skill bar animations
                }
                
                // Check if this is the about section, then animate counters
                if (entry.target.classList.contains('about-preview')) {
                    animateCounters();      // Start number counting animations
                }
            }
        });
    }, observerOptions);

    /*
        SETUP SECTIONS FOR ANIMATION: Prepare sections to be animated
        - Initially hide them (opacity: 0) and move them down (translateY: 30px)
        - Add smooth transitions so they animate nicely when made visible
        - Tell the observer to watch these sections
    */
    document.querySelectorAll('.featured-section, .skills-section, .about-preview').forEach(section => {
        section.style.opacity = '0';                                          // Start invisible
        section.style.transform = 'translateY(30px)';                         // Start 30px below final position
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease'; // Smooth 0.8s animation
        observer.observe(section);                                             // Watch this section for visibility changes
    });
}

/*
    ANIMATED COUNTERS: Numbers that count up from 0 to target value
    
    This creates an impressive effect where statistics count up when they come into view.
    Used for "50 Projects Completed", "5 Years Experience", etc.
*/
function initAnimatedCounters() {
    // Define the animation function and make it globally accessible
    window.animateCounters = function() {
        // Find all elements with the class 'stat-number'
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            // Get the final number from the data-target attribute
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;                    // Animation duration: 2 seconds
            const step = target / (duration / 16);    // How much to increase each frame (16ms = ~60fps)
            let current = 0;                          // Start counting from 0
            
            /*
                COUNTING ANIMATION: Use setInterval to increment the number
                - Runs every 16ms (approximately 60 frames per second)
                - Increments by 'step' amount each time
                - Stops when it reaches the target number
            */
            const timer = setInterval(() => {
                current += step;                      // Increase the current number
                
                if (current >= target) {
                    current = target;                 // Don't go over the target
                    clearInterval(timer);             // Stop the animation
                }
                
                // Update the display with the current number (rounded down)
                counter.textContent = Math.floor(current);
            }, 16);  // Run every 16 milliseconds for smooth animation
        });
    };
}

/*
    SKILL BARS ANIMATION: Progress bars that fill up to show skill levels
    
    Each skill has a data-progress attribute (like data-progress="90" for 90%)
    When animated, the bars grow from 0% to their target percentage
*/
function initSkillBars() {
    // Define the animation function and make it globally accessible
    window.animateSkillBars = function() {
        // Find all skill progress bar elements
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach((bar, index) => {
            // Stagger the animations: each bar starts 200ms after the previous one
            setTimeout(() => {
                // Get the target percentage from the data-progress attribute
                const progress = bar.getAttribute('data-progress');
                // Animate the width to the target percentage
                bar.style.width = progress + '%';
            }, index * 200);  // 200ms delay between each bar animation
        });
    };
}

/*
    SIMPLIFIED HERO INITIALIZATION: Clean, simple animations
    
    Replaces the complex floating elements with a simple, elegant fade-in effect.
    Focuses attention on the content rather than distracting animations.
*/
function initSimpleHero() {
    // Simple fade-in effect on page load
    const heroSection = document.querySelector('.hero-content-simple');
    
    if (heroSection) {
        // Start hidden
        heroSection.style.opacity = '0';
        heroSection.style.transform = 'translateY(30px)';
        
        // Fade in after a short delay
        setTimeout(() => {
            heroSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroSection.style.opacity = '1';
            heroSection.style.transform = 'translateY(0)';
        }, 300);
    }
}

/*
    SMOOTH SCROLLING: Enhanced navigation for anchor links
    
    When clicking navigation links that start with "#" (like #about, #contact),
    scroll smoothly to the target section instead of jumping instantly
*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();  // Stop the default jump behavior
        
        // Find the target element using the href attribute
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Smooth scroll to the target element
            target.scrollIntoView({
                behavior: 'smooth',    // Smooth scrolling animation
                block: 'start'         // Align to the top of the element
            });
        }
    });
});

/*
    SIMPLIFIED LOADING ANIMATIONS: Clean page load effects
    
    - Adds a 'loaded' class to the body for any CSS-based loading effects
    - The hero section has its own initialization in initSimpleHero()
*/
window.addEventListener('load', () => {
    // Add loaded class to body (can be used for CSS transitions)
    document.body.classList.add('loaded');
});

/* ===== END OF JAVASCRIPT ===== */
