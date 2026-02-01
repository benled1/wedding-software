/**
 * Save the Date - Main JavaScript
 * Handles countdown timer and calendar integration
 */

// ==========================================================================
// Configuration - EDIT THESE VALUES
// ==========================================================================

const CONFIG = {
    // Wedding date and time (format: 'YYYY-MM-DDTHH:MM:SS')
    weddingDate: '2026-08-29T16:00:00',

    // Event details for calendar
    event: {
        title: 'Tea & Ben\'s Wedding',
        location: 'Langley, British Columbia',
        description: 'We\'re getting married! More details to follow.',
        duration: 6 // hours
    }
};

// ==========================================================================
// Countdown Timer
// ==========================================================================

function updateCountdown() {
    const weddingDate = new Date(CONFIG.weddingDate);
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
        // Wedding day has arrived!
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';

        document.querySelector('.countdown-label').textContent = 'The day is here!';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(3, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// ==========================================================================
// Calendar Integration
// ==========================================================================

function formatDateForGoogle(date) {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
}

function formatDateForICS(date) {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, -1);
}

function generateGoogleCalendarUrl() {
    const startDate = new Date(CONFIG.weddingDate);
    const endDate = new Date(startDate.getTime() + CONFIG.event.duration * 60 * 60 * 1000);

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: CONFIG.event.title,
        dates: `${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}`,
        details: CONFIG.event.description,
        location: CONFIG.event.location
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function generateICSContent() {
    const startDate = new Date(CONFIG.weddingDate);
    const endDate = new Date(startDate.getTime() + CONFIG.event.duration * 60 * 60 * 1000);

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Save the Date//Wedding//EN
BEGIN:VEVENT
DTSTART:${formatDateForICS(startDate)}Z
DTEND:${formatDateForICS(endDate)}Z
SUMMARY:${CONFIG.event.title}
DESCRIPTION:${CONFIG.event.description}
LOCATION:${CONFIG.event.location}
END:VEVENT
END:VCALENDAR`;

    return icsContent;
}

function downloadICS() {
    const icsContent = generateICSContent();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'save-the-date.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function generateOutlookUrl() {
    const startDate = new Date(CONFIG.weddingDate);
    const endDate = new Date(startDate.getTime() + CONFIG.event.duration * 60 * 60 * 1000);

    const params = new URLSearchParams({
        path: '/calendar/action/compose',
        rru: 'addevent',
        subject: CONFIG.event.title,
        startdt: startDate.toISOString(),
        enddt: endDate.toISOString(),
        body: CONFIG.event.description,
        location: CONFIG.event.location
    });

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

// ==========================================================================
// Event Listeners
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    const calendarBtn = document.getElementById('calendarBtn');
    const calendarDropdown = document.getElementById('calendarDropdown');
    const googleCal = document.getElementById('googleCal');
    const appleCal = document.getElementById('appleCal');
    const outlookCal = document.getElementById('outlookCal');

    // Toggle dropdown
    calendarBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        calendarDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        calendarDropdown.classList.remove('active');
    });

    // Prevent dropdown from closing when clicking inside it
    calendarDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Google Calendar
    googleCal.addEventListener('click', function(e) {
        e.preventDefault();
        window.open(generateGoogleCalendarUrl(), '_blank');
        calendarDropdown.classList.remove('active');
    });

    // Apple Calendar (downloads .ics file)
    appleCal.addEventListener('click', function(e) {
        e.preventDefault();
        downloadICS();
        calendarDropdown.classList.remove('active');
    });

    // Outlook Calendar
    outlookCal.addEventListener('click', function(e) {
        e.preventDefault();
        window.open(generateOutlookUrl(), '_blank');
        calendarDropdown.classList.remove('active');
    });

    // Initialize parallax
    initParallax();
});

// ==========================================================================
// Parallax Background
// ==========================================================================

function initParallax() {
    const layers = document.querySelectorAll('.parallax-layer[data-speed]');

    if (layers.length === 0) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    function updateParallax() {
        const scrollY = window.pageYOffset;

        layers.forEach(layer => {
            const speed = parseFloat(layer.dataset.speed) || 0.5;
            const yPos = -(scrollY * speed);
            layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });

        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    // Initial position
    updateParallax();
}
