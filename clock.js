var audioCtx = new (window.AudioContext || window.webkitAudioContext);

class Sound {
    constructor(path) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', path, true);
        xhr.responseType = 'arraybuffer';
        xhr.addEventListener("load", this.decode.bind(this));
        xhr.send();
    }
    decode(event) {
        audioCtx.decodeAudioData(event.target.response, this.buffer.bind(this));
    }
    buffer(decodedBuffer) {
        this.bufferedSound = decodedBuffer;
    }
    play() {
        var source = audioCtx.createBufferSource();
        source.buffer = this.bufferedSound;
        source.connect(audioCtx.destination);
        source.start(0);
    }
}

function update() {
    var tt = new Date();
    if (state.active) {
        state.millisecondsLeft -= (tt - state.last);
        if (state.millisecondsLeft < 0) {
            if (state.secondsLeft % 3 == 0) { tic.play(); }
            state.millisecondsLeft += 1000/constants.speed;
            state.secondsLeft -= 1;
        }
        if (state.secondsLeft < 0) {
            state.secondsLeft += constants.setLength;
            state.setsLeft -= 1;
            bell.play();
        }
        if (state.setsLeft < 0) {
            cheer.play();
            state.active = false;
            document.title = 'Timer';
            reset();
            return
        }
    }
    state.last = tt;
    updateDisplay();
}

function updateDisplay() {
    /* fake regular timer display from arbitary state */
    var remaining = state.secondsLeft+state.millisecondsLeft/1000;
    var formatted = parseInt(state.setsLeft/2)+':'+('00'+remaining.toFixed(1)).slice(-4);
    document.title = state.active ? formatted : "Timer";
    /* ui state */
    var r = 128,
        f = remaining / constants.setLength,
        l = f > 0.5 ? 1 : 0,
        t = f * (2 * Math.PI),
        x = -r * Math.sin(t),
        y = -r * Math.cos(t);
    /*
    * move to 0,0; move up r; do a sweep r,r;
    * toggle large or small arc as required; end at x, y;
    */
    var anim = `M0,0 v${-r} A${r},${r},0,${l},0,${x},${y} z`;
    loader.setAttribute('d', anim);
    border.setAttribute('d', anim);

    display.textContent = state.active ? formatted :  "-:--.-";
    actionButton.textContent = state.active ? "stop" : "start";
    resetButton.disabled = state.active;
}

function toggle() {
    state.active = !state.active;
}

function reset() {
    state = {
        last: new Date(),
        active: false,
        setsLeft: constants.setCount,
        secondsLeft: constants.bufferLength,
        millisecondsLeft: 0,
    }
}

var state;
var tic = new Sound('sound_tic.mp3');
var bell = new Sound('sound_bell.mp3');
var cheer = new Sound('sound_cheer.wav');
var constants = {
    setCount: 20,
    setLength: 30,
    bufferLength: 3,
    speed: 1.00,
}

reset();
setInterval(update, 1000/30);
