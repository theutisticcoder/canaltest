
var stepCount;
if(localStorage.getItem("steps")){
     stepCount = localStorage.getItem("steps");

}
else{
     stepCount = 0;

}
let threshold = 3; // Adjust this value based on sensitivity
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
                    window.addEventListener('devicemotion', (e)=> {
                        setTimeout(()=> {
                            handleMotion(e)
                        }, 500)
                    });
                } else {
                    alert('Permission to access motion sensors was denied.');
                }
            })
            .catch(console.error);
    } else {
        window.addEventListener('devicemotion', (e)=> {
            setTimeout(()=> {
                handleMotion(e)
            }, 500)
        });
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
        console.log(Math.abs(magnitude - previousMagnitude))

        if (Math.abs(magnitude - previousMagnitude) > threshold) {
            stepCount++;
            document.querySelector("progress").value = stepCount;
            if(stepCount >= 410549){ const finished = new Notification("You walked the canal!")}
            document.getElementById('steps').textContent = stepCount * 0.0004494382;
            document.getElementById('km').textContent = stepCount * 0.00073099415;
            localStorage.setItem("steps", stepCount)
        }
        
        previousMagnitude = magnitude;
    };
    notifyMe();
}