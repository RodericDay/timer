function initialize() {
    ticInterval = 1000;
    if (window.location.href.indexOf('debug') > -1) { ticInterval /= 5 };
    ticsPerSet = 60;
    setCount = 10;
    ticsBase = ticsPerSet * setCount;
    counter = document.createElement("div");
    counter.className = "counter"
    counter.innerHTML = "Press start!"
    startButton = document.createElement("button");
    startButton.innerHTML = "Start";
    startButton.onclick = start;
    pauseButton = document.createElement("button");
    pauseButton.innerHTML = "Pause";
    pauseButton.onclick = pause;
    pauseButton.disabled = true;
    [counter, startButton, pauseButton].map(append);
    startButton.focus();

    toc = document.getElementById("tic");
    bell = document.getElementById("bell");
    cheer = document.getElementById("cheer");
}

function append(e) {
    document.body.appendChild(e);
}

function start() {
    lastTime = new Date().getTime();
    remainingTimeToTic = ticInterval;
    ticsRemaining = ticsBase;
    interval = window.setInterval(timeout, 1);
    startButton.disabled = true;
    pauseButton.disabled = false;
    pauseButton.classList.remove("pressed");
    pauseButton.focus();
}

function pause() {
    pauseButton.classList.toggle("pressed");
    startButton.disabled = !pauseButton.classList.contains("pressed");
}

function timeout() {
    currentTime = new Date().getTime();
    elapsedTime = currentTime - lastTime;
    lastTime = currentTime;
    if (pauseButton.classList.contains("pressed")) {
        return
    }
    remainingTimeToTic -= elapsedTime;
    if (remainingTimeToTic < 0) {
        remainingTimeToTic = ticInterval + remainingTimeToTic;
        tic();
    }
}

function tic() {
    ticsRemaining -= 1;
    ticsRemainingInSet = ticsRemaining%ticsPerSet;
    setsRemaining = ticsRemaining/ticsPerSet|0;
    if (ticsRemainingInSet%30 < 6) {
        toc.currentTime = 0;
        toc.play();
    }
    if (ticsRemainingInSet%30 == 0) {
        bell.currenTime = 0;
        bell.play();
    }
    if (setsRemaining==0 && ticsRemainingInSet==0) {
        cheer.play()
        window.clearInterval(interval);
    }
    counter.innerHTML = 'leftover:<br>';
    counter.innerHTML += ticsRemainingInSet + ' seconds<br>';
    counter.innerHTML += setsRemaining + ' sets';
}
