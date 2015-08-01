window.onload = function() {
    ticInterval = 1000;

    minutes = document.createElement("input");
    minutes.value = 10;
    minutes.className = "counter";
    seconds = document.createElement("input");
    seconds.value = 10;
    seconds.className = "counter";

    startButton = document.createElement("button");
    startButton.innerHTML = "Start";
    startButton.onclick = start;

    pauseButton = document.createElement("button");
    pauseButton.innerHTML = "Pause";
    pauseButton.onclick = pause;
    pauseButton.disabled = true;

    [minutes, seconds, startButton, pauseButton].map(function append(e) {
        document.body.appendChild(e);
    });
    startButton.focus();

    // test all sounds
    if (window.location.href.indexOf('debug') > -1) { minutes.value=2; ticInterval /= 50; }
}

function start() {
    [].forEach.call(document.querySelectorAll("audio"), function(el){el.preload});
    lastTime = new Date().getTime();
    remainingTimeToTic = ticInterval;
    ticsRemaining = minutes.value*60 + seconds.value*1|0;
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
    minutes.value = ticsRemaining/60|0;
    seconds.value = ticsRemaining%60;
    if (seconds.value < 10) { seconds.value = '0' + seconds.value }

    [].forEach.call(
        document.querySelectorAll("audio.s"+seconds.value),
        function(el){el.currentTime=0; el.play();}
    )

    if (ticsRemaining==0) {
        window.clearInterval(interval);
        document.querySelector("audio.end").play();
    }
}
