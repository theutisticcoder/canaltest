var stepCount = 0;

if(localStorage.getItem("steps") != null){
     stepCount = localStorage.getItem("steps");

}
let threshold = 12; // Adjust this value based on sensitivity
let previousMagnitude = 0;
function alerter(){
    const stepnot = new Notification("Your steps are currently " + stepCount);
    setTimeout(alerter, 86400000);
}
async function notifyMe() {
    if (!("Notification" in window)) {
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
            alerter();
        }
      });
    }
  
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
  }
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
                document.querySelector("progress").value = steps;
                if(document.querySelector("progress").value >= 410549){ const finished = new Notification("You walked the canal!")}
                document.getElementById('steps').textContent = stepCount;
                localStorage.setItem("steps", stepCount)
            }
            
            previousMagnitude = magnitude;
        });
        notifyMe();
        accelerometer.start();
       
    } catch (error) {
        console.error('Accelerometer not supported:', error);
        document.getElementById('steps').textContent = 'Accelerometer not supported.';
    }
} else {
    document.getElementById('steps').textContent = 'Accelerometer not supported on this device.';
}

