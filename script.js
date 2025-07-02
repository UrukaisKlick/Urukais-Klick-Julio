// Basic script for future interactivity (e.g., animations, dynamic content loading)

document.addEventListener('DOMContentLoaded', () => {
    console.log('Los Elegidos del Rock - Document Loaded');

    // Smooth scroll for anchor links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    for (let link of smoothScrollLinks) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            let targetId = this.getAttribute('href');
            if (targetId.length > 1 && document.querySelector(targetId)) {
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }

    // Timeline scroll animation
    const timelineItems = document.querySelectorAll('.timeline-item');

    const isInViewport = el => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    const runOnScroll = () => {
        timelineItems.forEach(item => {
            if (isInViewport(item)) {
                // Check if half of the element is visible to trigger animation sooner
                const rect = item.getBoundingClientRect();
                const elementHeight = rect.bottom - rect.top;
                if (rect.top <= (window.innerHeight || document.documentElement.clientHeight) - elementHeight / 2) {
                    item.classList.add('visible');
                }
            }
        });
    };

    // Initial check
    runOnScroll();

    // Listen for scroll events
    window.addEventListener('scroll', runOnScroll);

});
