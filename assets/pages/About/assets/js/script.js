// ===============================================================
// SIMPLE CAROUSEL WITH SCALING EFFECT
// ===============================================================
// Clean, simple carousel where middle image is biggest and side images are smaller

document.addEventListener('DOMContentLoaded', function() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const leftSideImage = document.querySelector('.side-image.left img');
    const rightSideImage = document.querySelector('.side-image.right img');
    const totalSlides = slides.length;
    
    // IMAGE SOURCES: Store all image sources for easy access
    const imageSources = [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa33EBUEaHm47R-Iar440RHnm3i6eHt8FDbg&s',
        'https://cdn2.steamgriddb.com/icon/851300ee84c2b80ed40f51ed26d866fc.ico',
        'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/3367fa99-0ba6-454c-b947-683f1a9f896d/ddwh3ph-92b34e9e-b5fb-4507-a8e1-1253c19b21b9.png',
        'https://cdn2.steamgriddb.com/icon/7316e11fe78963395fbab4a85d0b8f85/32/256x256.png',
        'https://static.vecteezy.com/system/resources/previews/031/712/156/non_2x/assassin-s-creed-symbol-logo-free-vector.jpg'
    ];
    
    // INITIALIZE: Set up the carousel
    updateCarousel();
    
    // AUTO-PLAY: Change slide every 4 seconds
    setInterval(() => {
        changeSlide(1);
    }, 8000);
    
    // CHANGE SLIDE FUNCTION: Move to next/previous slide
    window.changeSlide = function(direction) {
        currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
        updateCarousel();
    };
    
    // GO TO SPECIFIC SLIDE: For dot navigation
    window.goToSlide = function(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
    };
    
    // UPDATE CAROUSEL: Show current slide and update side images
    function updateCarousel() {
        // UPDATE MAIN SLIDES: Hide all, show current
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        // UPDATE DOTS: Show which slide is active
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // UPDATE SIDE IMAGES: Show previous and next images
        const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        const nextIndex = (currentSlide + 1) % totalSlides;
        
        if (leftSideImage && rightSideImage) {
            leftSideImage.src = imageSources[prevIndex];
            rightSideImage.src = imageSources[nextIndex];
        }
    }
    
    // KEYBOARD NAVIGATION: Arrow keys
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        }
    });
    
    // TOUCH/SWIPE SUPPORT: For mobile
    let startX = 0;
    const carousel = document.querySelector('.simple-carousel');
    
    carousel.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', function(e) {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                changeSlide(1); // Swipe left = next slide
            } else {
                changeSlide(-1); // Swipe right = previous slide
            }
        }
    });
});
