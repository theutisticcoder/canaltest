// Check for device motion support and secure context (HTTPS)
if (window.DeviceMotionEvent && window.isSecureContext) {
    let steps = 0;
    let lastAcceleration = { x: null, y: null, z: null };
    const threshold = 1.5; // Sensitivity for step detection (adjust as needed)
    const strideLengthInFeet = 2.5; // Average adult male stride length in feet

    // Constants for conversion
    const feetInMile = 5280;
    const kmInMile = 1.609344;
    const feetInKilometer = 3280.84;

    const stepsElement = document.getElementById('steps');
    const milesElement = document.getElementById('miles');
    const kilometersElement = document.getElementById('kilometers');

    // Function to update the display
    function updateDisplay() {
        // Calculate miles
        const miles = (steps * strideLengthInFeet) / feetInMile;

        // Calculate kilometers
        const kilometers = miles * kmInMile;

        // Update the HTML elements
        stepsElement.textContent = steps;
        milesElement.textContent = miles.toFixed(2); // Display 2 decimal places
        kilometersElement.textContent = kilometers.toFixed(2);
    }

    // Event listener for device motion
    window.addEventListener('devicemotion', (event) => {
        const acceleration = event.accelerationIncludingGravity;
        if (!lastAcceleration.x) {
            lastAcceleration = acceleration;
            return;
        }

        // Calculate the difference in acceleration since the last frame
        const deltaX = Math.abs(acceleration.x - lastAcceleration.x);
        const deltaY = Math.abs(acceleration.y - lastAcceleration.y);
        const deltaZ = Math.abs(acceleration.z - lastAcceleration.z);

        // Detect a step when a significant change in acceleration occurs
        if (deltaX + deltaY + deltaZ > threshold) {
            steps++;
            updateDisplay();
        }

        lastAcceleration = acceleration;
    });
} else {
    // Graceful degradation for unsupported or insecure browsers
    alert("Device motion is not supported or the page is not served over HTTPS. Pedometer functionality will not work.");
}
