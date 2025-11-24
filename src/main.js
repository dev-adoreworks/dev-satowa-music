import './scss/style.scss';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import gsap from 'gsap';
import Lenis from '@studio-freight/lenis';

// Initialize Lenis (Inertial Scroll)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Initialize Swiper
const swiper = new Swiper('.p-videos__carousel', {
    slidesPerView: 1.2,
    spaceBetween: 20,
    centeredSlides: false,
    loop: false,
    breakpoints: {
        768: {
            slidesPerView: 3,
            spaceBetween: 30,
            centeredSlides: false,
        }
    },
    navigation: {
        nextEl: '.p-videos__next',
        prevEl: '.p-videos__prev',
    },
});

// Video Modal Logic
const modal = document.querySelector('.c-video-modal');
const iframe = document.getElementById('youtube-iframe');
const closeBtn = document.querySelector('.c-video-modal__close');
const overlay = document.querySelector('.c-video-modal__overlay');

if (modal && iframe) {
    document.querySelectorAll('.p-video-card').forEach(card => {
        card.addEventListener('click', () => {
            const videoId = card.dataset.youtubeId;
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            modal.classList.add('is-active');
            lenis.stop(); // Stop scrolling when modal is open
        });
    });

    const closeModal = () => {
        modal.classList.remove('is-active');
        iframe.src = '';
        lenis.start(); // Resume scrolling
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
}

// Mouse Follower
const cursor = document.querySelector('.c-cursor');
if (cursor) {
    // Initial state
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.2,
            ease: "power2.out"
        });
    });

    // Hover effects for links and buttons
    const hoverElements = document.querySelectorAll('a, button, .p-video-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('is-hover');
            gsap.to(cursor, { scale: 1.5, duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('is-hover');
            gsap.to(cursor, { scale: 1, duration: 0.3 });
        });
    });
}

// Music Player Logic
const trackItems = document.querySelectorAll('.p-track-item');
const albumArt = document.querySelector('.p-player__image-wrap img');
const albumTitle = document.querySelector('.p-player__overlay-text h3');
const albumArtist = document.querySelector('.p-player__overlay-text span');
const currentAudio = new Audio();
let currentlyPlayingBtn = null;

trackItems.forEach(item => {
    // Hover effect for PC: Change album art
    item.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 768) { // Only on PC
            const newImage = item.dataset.image;
            const titleGroup = item.querySelector('.p-track-item__title-group');
            const title = titleGroup.querySelector('.p-track-item__title').textContent;

            if (albumArt && newImage) {
                // Simple fade out/in could be added here, but direct switch for responsiveness
                albumArt.src = newImage;
            }
            if (albumTitle) {
                albumTitle.textContent = title;
            }
        }
    });

    // Playback Logic
    const playBtn = item.querySelector('.p-track-item__play');
    const audioUrl = item.dataset.audio;

    if (playBtn && audioUrl) {
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent bubbling if needed

            if (currentlyPlayingBtn === playBtn && !currentAudio.paused) {
                // Pause current
                currentAudio.pause();
                playBtn.classList.remove('is-playing');
                currentlyPlayingBtn = null;
            } else {
                // Play new
                if (currentlyPlayingBtn) {
                    currentlyPlayingBtn.classList.remove('is-playing');
                    currentAudio.pause();
                }

                currentAudio.src = audioUrl;
                currentAudio.play().catch(error => console.error("Playback failed:", error));
                playBtn.classList.add('is-playing');
                currentlyPlayingBtn = playBtn;

                // Also update album art on click (for both PC and SP)
                const newImage = item.dataset.image;
                if (albumArt && newImage) {
                    albumArt.src = newImage;
                }
            }
        });
    }
});

// Reset album art on mouse leave from track list (optional, maybe keep last hovered)
const trackList = document.querySelector('.p-track-list');
if (trackList) {
    trackList.addEventListener('mouseleave', () => {
        // Optional: Reset to default or keep last
    });
}

// Hamburger Menu
const hamburger = document.querySelector('.c-hamburger');
const mobileNav = document.querySelector('.l-mobile-nav');
const closeNav = document.querySelector('.l-mobile-nav__close');

if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
        mobileNav.classList.add('is-active');
        lenis.stop();
    });

    if (closeNav) {
        closeNav.addEventListener('click', () => {
            mobileNav.classList.remove('is-active');
            lenis.start();
        });
    }

    document.querySelectorAll('.l-mobile-nav__link').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('is-active');
            lenis.start();
        });
    });
}
