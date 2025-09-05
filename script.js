// Register the service worker for PWA functionality
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service Worker registered!', reg))
        .catch(err => console.error('Service Worker registration failed:', err));
}

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const distanceEl = document.getElementById('distance');
const storyOutput = document.getElementById('story-output');

let watchId = null;
let totalDistance = 0; // in meters
let positions = [];

startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    totalDistance = 0;
    positions = [];
    storyOutput.innerHTML = '<p>Tracking has started...</p>';

    watchId = navigator.geolocation.watchPosition(handlePosition, handleError, {
        enableHighAccuracy: true
    });
});

stopBtn.addEventListener('click', () => {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
    }
    startBtn.disabled = false;
    stopBtn.disabled = true;

    // Convert meters to miles for the story
    const distanceInMiles = totalDistance * 0.000621371;
    if (distanceInMiles > 0.01) { // Only generate if they moved a bit
        generateStory(distanceInMiles);
    } else {
        storyOutput.innerHTML = '<p>You didn\'t travel far enough to generate a story.</p>';
    }
});

function handlePosition(position) {
    positions.push(position.coords);
    if (positions.length > 1) {
        const lastPos = positions[positions.length - 2];
        const currentPos = positions[positions.length - 1];
        totalDistance += calculateDistance(lastPos.latitude, lastPos.longitude, currentPos.latitude, currentPos.longitude);
    }
    // Update display in miles
    distanceEl.textContent = (totalDistance * 0.000621371).toFixed(2);
}

function handleError(error) {
    console.error('Geolocation error:', error);
    storyOutput.innerHTML = `<p>Error: ${error.message}. Please enable location services.</p>`;
}

// Haversine formula to calculate distance between two lat/lon points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
}

// Function to call our backend
async function generateStory(distance) {
    storyOutput.innerHTML = '<p>Crafting your story... ✨</p>';
    try {
        const response = await fetch('/generate-story', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ distance: distance.toFixed(2) })
        });
        const data = await response.json();
        if (data.story) {
            storyOutput.innerHTML = `<p>${data.story}</p>`;
        } else {
            throw new Error('No story returned.');
        }
    } catch (error) {
        console.error('Error fetching story:', error);
        storyOutput.innerHTML = '<p>Sorry, we couldn\'t generate a story right now. Please try again later.</p>';
    }
}