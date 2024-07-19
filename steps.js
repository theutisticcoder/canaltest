let stepCount = 0;
let threshold = 12; // Adjust this value based on sensitivity
let previousMagnitude = 0;

if ('Accelerometer' in window) {
    try {
        const accelerometer = new Accelerometer({ frequency: 20 });

        accelerometer.addEventListener('reading', () => {
            const magnitude = Math.sqrt(
                accelerometer.x * accelerometer.x +
                accelerometer.y * accelerometer.y +
                accelerometer.z * accelerometer.z
            );

            if (Math.abs(magnitude - previousMagnitude) > threshold) {
                stepCount++;
                document.getElementById('steps').textContent = stepCount;
            }

            previousMagnitude = magnitude;
        });

        accelerometer.start();
    } catch (error) {
        console.error('Accelerometer not supported:', error);
        document.getElementById('steps').textContent = 'Accelerometer not supported.';
    }
} else {
    document.getElementById('steps').textContent = 'Accelerometer not supported on this device.';
}
