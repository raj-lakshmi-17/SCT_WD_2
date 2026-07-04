// Stopwatch Variables

let startTime = 0;
let elapsedTime = 0;
let timer = null;
let running = false;

let laps = [];

const display = document.getElementById("display");
const lapList = document.getElementById("lapList");

const totalTime = document.getElementById("totalTime");
const lapCount = document.getElementById("lapCount");
const fastestLap = document.getElementById("fastestLap");
const slowestLap = document.getElementById("slowestLap");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const lapBtn = document.getElementById("lapBtn");
const resetBtn = document.getElementById("resetBtn");

const copyBtn = document.getElementById("copyBtn");
const exportBtn = document.getElementById("exportBtn");
const clearBtn = document.getElementById("clearBtn");

const themeBtn = document.getElementById("themeBtn");

// Format Time

function formatTime(ms){

let milliseconds = ms % 1000;
let seconds = Math.floor(ms/1000)%60;
let minutes = Math.floor(ms/(1000*60))%60;
let hours = Math.floor(ms/(1000*60*60));

return(
String(hours).padStart(2,"0")+":"+
String(minutes).padStart(2,"0")+":"+
String(seconds).padStart(2,"0")+"."+
String(milliseconds).padStart(3,"0")
);

}

// Update Timer

function updateDisplay(){

elapsedTime = Date.now()-startTime;

display.innerHTML = formatTime(elapsedTime);

totalTime.innerHTML = formatTime(elapsedTime);

}

// Start

startBtn.onclick=function(){

if(running) return;

running=true;

startTime = Date.now()-elapsedTime;

timer=setInterval(updateDisplay,10);

}

// Pause

pauseBtn.onclick=function(){

running=false;

clearInterval(timer);

}

// Reset

resetBtn.onclick=function(){

clearInterval(timer);

running=false;

elapsedTime=0;

laps=[];

display.innerHTML="00:00:00.000";

totalTime.innerHTML="00:00:00.000";

lapCount.innerHTML="0";

fastestLap.innerHTML="--";

slowestLap.innerHTML="--";

lapList.innerHTML='<li class="empty">No laps recorded yet</li>';

localStorage.removeItem("laps");

}

// Lap

lapBtn.onclick=function(){

if(!running) return;

let lapTime=formatTime(elapsedTime);

laps.push(elapsedTime);

lapCount.innerHTML=laps.length;

if(document.querySelector(".empty"))

lapList.innerHTML="";

let li=document.createElement("li");

li.classList.add("fade");

li.innerHTML=`

<span>

🏁 Lap ${laps.length}

</span>

<span>

${lapTime}

</span>

`;

lapList.prepend(li);

updateStats();

saveLaps();

};

// Statistics

function updateStats(){

if(laps.length==0) return;

let min=Math.min(...laps);

let max=Math.max(...laps);

fastestLap.innerHTML=formatTime(min);

slowestLap.innerHTML=formatTime(max);

let items=lapList.querySelectorAll("li");

items.forEach((item,index)=>{

item.classList.remove("fastest","slowest");

});

items.forEach((item,index)=>{

let value=laps[laps.length-1-index];

if(value==min)

item.classList.add("fastest");

if(value==max)

item.classList.add("slowest");

});

}

// Save Laps

function saveLaps(){

localStorage.setItem("laps",JSON.stringify(laps));

}

// Load Saved Laps

window.onload=function(){

let saved=JSON.parse(localStorage.getItem("laps"));

if(saved){

laps=saved;

lapList.innerHTML="";

laps.forEach((lap,index)=>{

let li=document.createElement("li");

li.innerHTML=`

<span>🏁 Lap ${index+1}</span>

<span>${formatTime(lap)}</span>

`;

lapList.prepend(li);

});

lapCount.innerHTML=laps.length;

updateStats();

}

updateClock();

setInterval(updateClock,1000);

};// ==========================
// Live Date & Time
// ==========================

function updateClock() {

    const now = new Date();

    document.getElementById("liveClock").innerHTML =
        now.toLocaleTimeString();

    document.getElementById("date").innerHTML =
        now.toDateString();

}

// ==========================
// Theme Toggle
// ==========================

themeBtn.onclick = function () {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    } else {

        themeBtn.innerHTML =
            '<i class="fa-solid fa-moon"></i>';

    }

};

// ==========================
// Copy Lap Times
// ==========================

copyBtn.onclick = function () {

    if (laps.length === 0) {

        alert("No laps to copy.");

        return;

    }

    let text = "";

    laps.forEach((lap, i) => {

        text += `Lap ${i + 1} : ${formatTime(lap)}\n`;

    });

    navigator.clipboard.writeText(text);

    alert("Lap times copied!");

};

// ==========================
// Export as TXT
// ==========================

exportBtn.onclick = function () {

    if (laps.length === 0) {

        alert("No laps available.");

        return;

    }

    let text = "STOPWATCH LAP REPORT\n\n";

    laps.forEach((lap, i) => {

        text += `Lap ${i + 1} : ${formatTime(lap)}\n`;

    });

    const blob = new Blob([text], { type: "text/plain" });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "LapTimes.txt";

    link.click();

};

// ==========================
// Clear Lap History
// ==========================

clearBtn.onclick = function () {

    laps = [];

    lapList.innerHTML =
        '<li class="empty">No laps recorded yet</li>';

    lapCount.innerHTML = "0";

    fastestLap.innerHTML = "--";

    slowestLap.innerHTML = "--";

    localStorage.removeItem("laps");

};

// ==========================
// Keyboard Shortcuts
// ==========================

document.addEventListener("keydown", function (e) {

    if (e.code === "Space") {

        e.preventDefault();

        if (running)

            pauseBtn.click();

        else

            startBtn.click();

    }

    if (e.key === "l" || e.key === "L") {

        lapBtn.click();

    }

    if (e.key === "r" || e.key === "R") {

        resetBtn.click();

    }

});

// ==========================
// Circular Progress Ring
// ==========================

setInterval(() => {

    if (!running) return;

    const circle = document.querySelector(".outer-circle");

    let seconds = Math.floor(elapsedTime / 1000);

    let deg = (seconds % 60) * 6;

    circle.style.background =
        `conic-gradient(#4D0E13 ${deg}deg,#D8C4AC ${deg}deg)`;

}, 100);

// ==========================
// Welcome Notification
// ==========================

window.addEventListener("load", () => {

    setTimeout(() => {

        alert("⏱ Welcome to Elegant Stopwatch!");

    }, 500);

});

// ==========================
// Double Click Display
// ==========================

display.ondblclick = function () {

    if (document.fullscreenElement) {

        document.exitFullscreen();

    } else {

        document.documentElement.requestFullscreen();

    }

};

// ==========================
// End
// ==========================