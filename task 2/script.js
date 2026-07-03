// Variables to track time and state
let timer = null;
let isRunning = false;
let elapsedTime = 0;
let startTime = 0;
let lapCount = 0;

// Get elements from the page
let minutesDisplay = document.getElementById("minutes");
let secondsDisplay = document.getElementById("seconds");
let millisecondsDisplay = document.getElementById("milliseconds");
let startBtn = document.getElementById("startBtn");
let lapBtn = document.getElementById("lapBtn");
let lapList = document.getElementById("lapList");

// Function to update the display
function updateDisplay() {
    var time = elapsedTime;

    var ms = Math.floor((time % 1000) / 10);
    var sec = Math.floor((time / 1000) % 60);
    var min = Math.floor((time / 60000) % 60);

    // Add leading zero if needed
    if (ms < 10) ms = "0" + ms;
    if (sec < 10) sec = "0" + sec;
    if (min < 10) min = "0" + min;

    minutesDisplay.textContent = min;
    secondsDisplay.textContent = sec;
    millisecondsDisplay.textContent = ms;
}

// Start or pause the stopwatch
function startStop() {
    if (isRunning) {
        // Pause the stopwatch
        clearInterval(timer);
        isRunning = false;
        startBtn.textContent = "Start";
        startBtn.style.backgroundColor = "#00d4aa";
        lapBtn.disabled = true;
    } else {
        // Start the stopwatch
        startTime = Date.now() - elapsedTime;
        timer = setInterval(function () {
            elapsedTime = Date.now() - startTime;
            updateDisplay();
        }, 10);
        isRunning = true;
        startBtn.textContent = "Pause";
        startBtn.style.backgroundColor = "#e94560";
        lapBtn.disabled = false;
    }
}

// Record a lap time
function recordLap() {
    lapCount++;

    var time = elapsedTime;

    var ms = Math.floor((time % 1000) / 10);
    var sec = Math.floor((time / 1000) % 60);
    var min = Math.floor((time / 60000) % 60);

    if (ms < 10) ms = "0" + ms;
    if (sec < 10) sec = "0" + sec;
    if (min < 10) min = "0" + min;

    // Create a new list item
    var li = document.createElement("li");
    li.innerHTML = "<span>Lap " + lapCount + "</span><span>" + min + ":" + sec + "." + ms + "</span>";

    // Add it to the top of the list
    lapList.insertBefore(li, lapList.firstChild);
}

// Reset everything
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    elapsedTime = 0;
    lapCount = 0;

    updateDisplay();

    startBtn.textContent = "Start";
    startBtn.style.backgroundColor = "#00d4aa";
    lapBtn.disabled = true;

    // Clear all lap times
    lapList.innerHTML = "";
}