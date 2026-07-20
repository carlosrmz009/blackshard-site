const appContainer = document.getElementById('appContainer');
const navTrack = document.getElementById('navTrack');
const navItems = document.querySelectorAll('.nav-item');
const swipeIndicator = document.getElementById('swipeIndicator');

function updateNav() {
    const isMobile = window.innerWidth <= 768;
    const scrollLeft = appContainer.scrollLeft;
    const windowWidth = window.innerWidth;
    
    // Determine active index
    const activeIndex = Math.round(scrollLeft / windowWidth);
    
    navItems.forEach((item, index) => {
        if (index === activeIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Hide swipe indicator if scrolled past the first page
    if (swipeIndicator) {
        if (scrollLeft > 50) {
            swipeIndicator.style.opacity = '0';
        } else {
            swipeIndicator.style.opacity = '1';
        }
    }

    if (isMobile) {
        // Continuous, robotic, strictly-bound scroll translation
        const exactScroll = scrollLeft / windowWidth;
        const indexFloor = Math.floor(exactScroll);
        const indexCeil = Math.ceil(exactScroll);
        const remainder = exactScroll - indexFloor;
        
        const getCenter = (idx) => {
            if (!navItems[idx]) return 0;
            // We use standard offsets rather than getBoundingClientRect to avoid reflow costs
            return navItems[idx].offsetLeft + navItems[idx].offsetWidth / 2;
        };
        
        const centerFloor = getCenter(indexFloor);
        const centerCeil = getCenter(indexCeil);
        
        const currentCenter = centerFloor + (centerCeil - centerFloor) * remainder;
        const translateX = (windowWidth / 2) - currentCenter;
        
        // Use a tiny, negligible transition to keep it smooth but strictly tied to the finger
        navTrack.style.transform = `translateX(${translateX}px)`;
    } else {
        navTrack.style.transform = 'translateX(0)';
    }
}

appContainer.addEventListener('scroll', updateNav, { passive: true });
window.addEventListener('resize', updateNav);

// Add click navigation
navItems.forEach((item, idx) => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        appContainer.scrollTo({
            left: idx * window.innerWidth,
            behavior: 'smooth'
        });
    });
});

// Initial setup
// Need a tiny timeout to ensure fonts/layout are loaded before calculating offsets
setTimeout(updateNav, 100);
