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

    // --- Modal Functionality & API Integration ---
    const artistCards = document.querySelectorAll('.artist-card');
    const modal = document.getElementById('artistModal');
    const modalCloseButton = document.querySelector('.modal-close-button');
    const modalArtistName = document.getElementById('modalArtistName');
    const modalArtistBio = document.getElementById('modalArtistBio');
    const modalArtistAlbums = document.getElementById('modalArtistAlbums');

    const API_KEY = "2"; // Test API key for TheAudioDB

    artistCards.forEach(card => {
        card.addEventListener('click', async () => {
            const artistName = card.querySelector('h3').textContent.trim();
            if (!artistName) {
                console.error("Artist name not found in card.");
                return;
            }

            // Show loading state in modal
            modalArtistName.textContent = artistName;
            modalArtistBio.textContent = 'Loading biography...';
            modalArtistAlbums.innerHTML = '<li>Loading albums...</li>';
            modal.style.display = 'block';

            try {
                // Fetch artist details (for bio and ID)
                const searchUrl = `https://www.theaudiodb.com/api/v1/json/${API_KEY}/search.php?s=${encodeURIComponent(artistName)}`;
                const artistResponse = await fetch(searchUrl);
                if (!artistResponse.ok) throw new Error(`HTTP error! status: ${artistResponse.status} for artist search`);
                const artistData = await artistResponse.json();

                let biography = 'Biography not available.';
                let artistId = null;

                if (artistData.artists && artistData.artists.length > 0) {
                    const artist = artistData.artists[0];
                    biography = artist.strBiographyEN || artist.strBiographyDE || 'Biography not available in English or German.'; // Fallback
                    artistId = artist.idArtist;
                } else {
                     modalArtistBio.textContent = 'Artist details not found.';
                }
                modalArtistBio.textContent = biography;

                // Fetch albums/discography using artist name (simpler than using ID if discography endpoint works well)
                // TheAudioDB's discography.php endpoint is simpler for just album names and years.
                // Or use album.php?i={artistId} if more album details are needed and artistId was found.
                // For this example, let's try discography.php first.

                const discographyUrl = `https://www.theaudiodb.com/api/v1/json/${API_KEY}/discography.php?s=${encodeURIComponent(artistName)}`;
                const discographyResponse = await fetch(discographyUrl);
                if (!discographyResponse.ok) throw new Error(`HTTP error! status: ${discographyResponse.status} for discography`);
                const discographyData = await discographyResponse.json();

                modalArtistAlbums.innerHTML = ''; // Clear loading message
                if (discographyData.album && discographyData.album.length > 0) {
                    discographyData.album.forEach(album => {
                        const listItem = document.createElement('li');
                        listItem.textContent = `${album.strAlbum} (${album.intYearReleased || 'Year N/A'})`;
                        modalArtistAlbums.appendChild(listItem);
                    });
                } else {
                    modalArtistAlbums.innerHTML = '<li>Album information not available.</li>';
                }

            } catch (error) {
                console.error('Error fetching artist data:', error);
                modalArtistBio.textContent = 'Could not load biography. Please try again later.';
                modalArtistAlbums.innerHTML = '<li>Could not load albums. Please try again later.</li>';
            }
        });
    });

    // Close modal when the close button is clicked
    modalCloseButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
