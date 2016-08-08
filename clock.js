var audioCtx = new (window.AudioContext || window.webkitAudioContext);

class Sound {

    constructor(path)
    {
        var self = this;

        function decode(event) {
            audioCtx.decodeAudioData(event.target.response, buffer);
        }
        function buffer(decodedBuffer) {
            self.bufferedSound = decodedBuffer;
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', path, true);
        xhr.responseType = 'arraybuffer';
        xhr.addEventListener("load", decode);
        xhr.send();
    }


    play()
    {
        var source = audioCtx.createBufferSource();
        source.buffer = this.bufferedSound;
        source.connect(audioCtx.destination);
        source.start(0);
    }

}

var tic = new Sound('sound_tic.mp3');
var bell = new Sound('sound_bell.mp3');
var cheer = new Sound('sound_cheer.wav');

var interval = window.setInterval(update, 50);
var constants = {
    setCount: 20,
    setLength: 30,
    bufferLength: 5,
    speed: 1,
}

var state = {
    last: new Date(),
    active: false,
    setsLeft: constants.setCount,
    secondsLeft: constants.bufferLength,
    millisecondsLeft: 0,
}

function update() {
    var tt = new Date();
    if (state.active) {
        state.millisecondsLeft -= (tt - state.last);
        if (state.millisecondsLeft < 0) {
            state.millisecondsLeft += 1000/constants.speed;
            state.secondsLeft -= 1;
            if (state.secondsLeft < 5) {
                tic.currentTime = 0;
                tic.play();
            }
        }
        if (state.secondsLeft < 0) {
            state.secondsLeft += constants.setLength;
            state.setsLeft -= 1;
            bell.currentTime = 0;
            bell.play();
        }
        if (state.setsLeft < 0) {
            cheer.play();
            clearInterval(interval);
            document.title = 'Timer';
            return
        }
    }
    state.last = tt;
    updateDisplay();
}

function updateDisplay() {
    /* fake regular timer display from arbitary state */
    var A = parseInt(state.setsLeft/2);
    var B = 2*A === state.setsLeft ? 0 : 30;
    var C = state.secondsLeft+B;
    var D = parseInt(state.millisecondsLeft/100);
    var formatted = A+":"+('00'+C).slice(-2)+'.'+D;
    document.title = state.active ? formatted : "Timer";
    display.textContent = formatted;
    /* ui state */
    actionButton.textContent = state.active ? "stop" : "start";
    resetButton.disabled = state.active;
}

function toggle(button) {
    state.active = !state.active;
}

function reset() {
    state.active = false;
    state.setsLeft = constants.setCount;
    state.secondsLeft = constants.bufferLength;
    state.millisecondsLeft = 0;
}
