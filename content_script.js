let forEach = Array.prototype.forEach;
let speed = 1.0;

function insertCSS() {
    let css = document.createElement('link');
    css.rel = "stylesheet";
    css.type = "text/css";
    css.href = chrome.extension.getURL('css/custom-kaltura.css');
    let kaltura_iframe = document.querySelector("iframe");
    if (kaltura_iframe) {
        let doc = kaltura_iframe.contentDocument;
        try {
            doc.head.appendChild(css);
        } catch (e) {
            console.log("error");
        }
    }
}

function main(document) {
    window.onload = () => {
        insertCSS();
        initialize(window.document);
    };
    if (document) {
        if (document.readyState === "complete") {
            initialize(document);
        } else {
            document.onreadystatechange = () => {
                if (document.readyState === "complete") {
                    initialize(document);
                }
            };
        }
    }
}

function calcSpeed(value) {
    let speed = {0: 0.25, 20: 0.50, 40: 1.00, 60: 1.25, 80: 1.50, 100: 1.75, 120: 2.00, 140: 2.50, 160: 3.00}
    if (value in speed) {
        return speed[value];
    } else {
        return 1.0;
    }
}

const wait = (millisec) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, millisec);
    });
};

function initialize(document) {
    let frameTags = document.getElementsByTagName("iframe");
    forEach.call(frameTags, function (frame) {
        try {
            var childDocument = frame.contentDocument;
        } catch (e) {
            return;
        }
        main(childDocument);
    });
    let video = document.querySelector('video');

    if (video) {
        video.addEventListener('playing', async function () {
            wait(300).then(() => {
                video.playbackRate = speed;
                // console.log("playing",speed,video.playbackRate);
            });
        });
        video.addEventListener('play', async function () {
            wait(300).then(() => {
                video.playbackRate = speed;
                // console.log("play",speed,video.playbackRate);
            });
        });
        let p = document.querySelector(".playbackRateSelector");
        if (p) {
            p.innerHTML = '' +
                '<span id="play_speed" style="position: relative;top: 3px;font-size: 1.3em;color: #b1aeab;">1.0x</span>\n' +
                '    <input type="range" class="input-range" min="0" max="160" value="40" step="20" id="play_speed_bar">';
        }
        let speed_bar = document.querySelector('#play_speed_bar');
        let speed_disp = document.querySelector('#play_speed');
        if (speed_bar) {
            speed_bar.oninput = function () {
                speed = calcSpeed(this.value);
                speed_disp.innerText = speed + 'x';
                video.playbackRate = speed;
            }
        }

    }
}

main();