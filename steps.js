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
  document.getElementById('start').addEventListener('click', () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('devicemotion', handleMotion);
                } else {
                    alert('Permission to access motion sensors was denied.');
                }
            })
            .catch(console.error);
    } else {
        window.addEventListener('devicemotion', handleMotion);
    }
});

function handleMotion(e){
    const acceleration = e.accelerationIncludingGravity;
    if (acceleration.x !== null && acceleration.y !== null && acceleration.z !== null) {
        const magnitude = Math.sqrt(
            acceleration.x * acceleration.x +
            acceleration.y * acceleration.y +
            acceleration.z * acceleration.z
        );

        if (Math.abs(magnitude - previousMagnitude) > threshold) {
            stepCount++;
            document.querySelector("progress").value = steps;
            if(document.querySelector("progress").value >= 410549){ const finished = new Notification("You walked the canal!")}
            document.getElementById('steps').textContent = stepCount;
            localStorage.setItem("steps", stepCount)
        }
        
        previousMagnitude = magnitude;
    };
    notifyMe();
    accelerometer.start();
}