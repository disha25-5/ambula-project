document.addEventListener('DOMContentLoaded', () => {

    // --- Dynamic Greeting ---
    const greetingElement = document.querySelector('.greeting h1');
    if (greetingElement) {
        const now = new Date();
        const currentHour = now.getHours(); // Get hour in 24-hour format (0-23)
        let greetingText = '';

        if (currentHour >= 5 && currentHour < 12) {
            greetingText = 'Good morning';
        } else if (currentHour >= 12 && currentHour < 17) { // 12 PM to 4:59 PM
            greetingText = 'Good afternoon';
        } else { // 5 PM onwards until 4:59 AM
            greetingText = 'Good evening';
        }

        // Assuming the name "Divyanshi" is static for now,
        // or would come from user data later
        const userName = "Divyanshi"; // Keep this or replace with dynamic user name if available

        greetingElement.textContent = `${greetingText}, ${userName}`;
    }
    // --- End Dynamic Greeting ---


    // --- Carousel Code (from previous step) ---
    const carouselTrack = document.querySelector('.carousel-track');
    // ... (rest of your existing carousel JS code remains here) ...
    const slides = carouselTrack ? Array.from(carouselTrack.children).filter(el => el.classList.contains('carousel-slide')) : [];
    const nextButton = document.querySelector('.carousel-button.next'); // Optional
    const prevButton = document.querySelector('.carousel-button.prev'); // Optional
    const dotsNav = document.querySelector('.carousel-nav');

     // Exit if carousel elements aren't found or no slides
    if (!carouselTrack || slides.length === 0 || !dotsNav) {
        console.log("Carousel elements not found or no slides.");
        // Don't return here anymore, allow greeting code to run even if carousel fails
        // return;
    } else { // Only run carousel logic if elements are found

        let slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;
        let autoSlideInterval; // Define interval variable

        // --- Create Navigation Dots ---
        dotsNav.innerHTML = ''; // Clear existing dots first
        slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dotsNav.appendChild(dot);

            dot.addEventListener('click', () => {
                moveToSlide(index);
                stopAutoSlide(); // Stop auto-slide on manual interaction
            });
        });
        const dots = Array.from(dotsNav.children);

        // --- Function to move slides ---
        const moveToSlide = (targetIndex) => {
            slideWidth = slides[0].getBoundingClientRect().width;
            if (targetIndex < 0 || targetIndex >= slides.length) {
                 console.warn("Target index out of bounds:", targetIndex);
                 return;
            }
            carouselTrack.style.transform = `translateX(-${slideWidth * targetIndex}px)`;
            dots[currentIndex]?.classList.remove('active');
            dots[targetIndex]?.classList.add('active');
            currentIndex = targetIndex;
            updateButtonStates();
        };

        // --- Update Nav Button States ---
        const updateButtonStates = () => {
             if (prevButton) { prevButton.disabled = currentIndex === 0; }
            if (nextButton) { nextButton.disabled = currentIndex === slides.length - 1;}
        }

        // --- Button Event Listeners ---
        nextButton?.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) { moveToSlide(currentIndex + 1); stopAutoSlide(); }
        });
        prevButton?.addEventListener('click', () => {
             if (currentIndex > 0) { moveToSlide(currentIndex - 1); stopAutoSlide(); }
        });

        // --- Auto-slide functionality ---
        const startAutoSlide = (interval = 5000) => {
            stopAutoSlide();
            console.log("Starting auto-slide");
            autoSlideInterval = setInterval(() => {
                let nextIndex = (currentIndex + 1) % slides.length;
                moveToSlide(nextIndex);
            }, interval);
        };
        const stopAutoSlide = () => {
            console.log("Stopping auto-slide");
            clearInterval(autoSlideInterval);
        };

        // --- Pause auto-slide on hover ---
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopAutoSlide);
            carouselContainer.addEventListener('mouseleave', startAutoSlide);
        }

        // --- Recalculate on resize ---
         let resizeTimeout;
         window.addEventListener('resize', () => {
             clearTimeout(resizeTimeout);
             resizeTimeout = setTimeout(() => {
                 console.log("Resizing carousel");
                 slideWidth = slides.length > 0 ? slides[0].getBoundingClientRect().width : 0;
                 carouselTrack.style.transition = 'none';
                 carouselTrack.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
                 void carouselTrack.offsetWidth;
                 carouselTrack.style.transition = 'transform 0.5s ease-in-out';
             }, 250);
         });

        // --- Initial Setup ---
         updateButtonStates();
        startAutoSlide();

    } // End of the 'else' block for carousel logic


}); // End DOMContentLoaded