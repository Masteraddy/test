/** @format */

let statusEl = document.getElementById("status");
let startBtn = document.getElementById("start-btn");
let stopBtn = document.getElementById("stop-btn");
let settingBtn = document.getElementById("save-btn");
let rtmpInp = document.querySelector("#rtmp-link");
let streamInp = document.querySelector("#stream-link");
const streamproto = location.protocol == "http:" ? "http" : "https";
const strname = uuid.v4();
let countTimeout;
let publiser;

let rtmpLink = `rtmp://${location.hostname}/live/${strname}`;
rtmpInp.value = rtmpLink;

streamInp.value = `${streamproto}://${location.host}/watch.html?stream=${strname}`;

settingBtn.addEventListener("click", init);

function init() {
  let audioDoc = document.querySelector("select#audio");
  let videoDoc = document.querySelector("select#video");
  const audioSource = audioDoc.value;
  const videoSource = videoDoc.value;

  publiser = new nmRTC.Publisher({
    id: "video1",
    stun: [
      {
        urls: "stun:stun.nodemedia.cn:3478",
      },
    ],
    stunMaxTime: 1000,
    video: {
      deviceId: videoSource ? { exact: videoSource } : undefined,
      width: 1280,
      height: 720,
      bitrate: 1500 * 1000,
      keyInterval: 2,
    },
    audio: {
      bitrate: 64 * 1000,
      deviceId: audioSource ? { exact: audioSource } : undefined,
    },
  });

  publiser.on("start", () => {
    document.querySelector(".name-tag").classList.remove("hidden");
    document.querySelector("#start-btn").classList.remove("start");
    document.querySelector("#start-btn").classList.add("stop");
    document.querySelector("#share-btn").classList.remove("hidden");
    statusEl.innerHTML = "Live";
  });
  publiser.on("stop", () => {
    document.querySelector(".name-tag").classList.add("hidden");
    statusEl.innerHTML = "Not live";
    document.querySelector("#start-btn").classList.remove("stop");
    document.querySelector("#start-btn").classList.add("start");
    document.querySelector("#share-btn").classList.add("hidden");
  });
  publiser.on("error", (error) => {
    statusEl.innerHTML = "Error";
    clearInterval(countTimeout);
    console.log("nmRTC Publisher on error", error);
  });
  document.querySelector(".modal").classList.add("notvisible");
}
function start() {
  let protocol = location.protocol == "http:" ? "ws" : "wss";
  if (strname !== "") {
    publiser.start(`${protocol}://${location.host}/live/${strname}.rtc`);
    var streamNm = document.getElementById("stream-name");
    streamNm.value = `${streamproto}://${location.host}/watch.html?stream=${strname}`;
    countTimeout = setInterval(() => {
      getViews(streamproto, strname, "live-count");
    }, 5000);
    return;
  }
  alert("Name Cant be empty");
  statusEl.innerHTML = 'Error "Empty Stream Name!"';
}
function copyRtmpLink() {
  var copyText = document.getElementById("rtmp-link");
  copyText.select();
  copyText.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(copyText.value);
  alert("Stream RTMP Link Copied");
}

function copyStreamLink() {
  var copyText = streamInp;
  copyText.select();
  copyText.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(copyText.value);
  alert("Video Link Copied");
}

function copy() {
  var copyText = document.getElementById("stream-name");
  copyText.select();
  copyText.setSelectionRange(0, 99999);

  /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.value);
}
function stop() {
  clearInterval(countTimeout);
  publiser.stop();
}
function toggleAudio() {
  publiser.toggleAudio((s) => {
    if (s === false) {
      document.querySelector("#mic-btn").classList.remove("mic");
      document.querySelector("#mic-btn").classList.add("mic-off");
      return;
    }
    document.querySelector("#mic-btn").classList.remove("mic-off");
    document.querySelector("#mic-btn").classList.add("mic");
  });
}
function toggleVideo() {
  publiser.toggleVideo((s) => {
    if (s === false) {
      document.querySelector("#camera-btn").classList.remove("camera");
      document.querySelector("#camera-btn").classList.add("camera-off");
      return;
    }
    document.querySelector("#camera-btn").classList.remove("camera-off");
    document.querySelector("#camera-btn").classList.add("camera");
  });
}

function getViews(protocol, name, id) {
  let countEl = document.getElementById(id);
  let streamAPI = `${protocol}://${location.host}/api/streams/live/${name}`;
  fetch(streamAPI)
    .then((res) => res.json())
    .then((dt) => (countEl.innerHTML = dt?.data?.live[name]?.subcount || 0))
    .catch((err) => console.error(err));
}

document.getElementById("start-btn").addEventListener("click", function (e) {
  let isStartBtn = e.target.className.includes("start");
  if (isStartBtn) {
    start();
    return;
  }
  stop();
});

// function uuid() {
//   return ([1e4] + -1e3 + -4e3 + -8e3 + -1e11)
//     .replace(
//       /[018]/g,
//       (c) =>
//         c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
//     )
//     .toString(12);
// }

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

function gotDevices(deviceInfos) {
  const masterInputSelector = document.createElement("select");
  masterInputSelector.classList.add("input-select");
  masterInputSelector.id = "audio";

  const videoInputSelector = document.createElement("select");
  videoInputSelector.classList.add("input-select");
  videoInputSelector.id = "video";

  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement("option");
    const vidoption = document.createElement("option");
    option.value = deviceInfo.deviceId;
    vidoption.value = deviceInfo.deviceId;
    console.log(deviceInfo.kind);
    if (deviceInfo.kind === "audioinput") {
      console.info("Found audio input device: ", deviceInfo.label);
      option.text = deviceInfo.label || `Mic ${masterInputSelector.length + 1}`;
      masterInputSelector.appendChild(option);
    }
    if (deviceInfo.kind === "videoinput") {
      vidoption.text = deviceInfo.label || `Cam ${videoInputSelector.length + 1}`;
      videoInputSelector.appendChild(vidoption);
      console.log("Found video input device: ", deviceInfo.label);
    }
  }

  // Clone the master outputSelector and replace outputSelector placeholders.
  const audioSelectors = document.querySelector("select#audio");
  const videoSelectors = document.querySelector("select#video");
  // for (let selector = 0; selector < allOutputSelectors.length; selector++) {
  const newAudioSelector = masterInputSelector.cloneNode(true);
  // newAudioSelector.addEventListener("change", changeAudioDestination);
  audioSelectors.parentNode.replaceChild(newAudioSelector, audioSelectors);
  // }

  const newVideoSelector = videoInputSelector.cloneNode(true);
  // newVideoSelector.addEventListener("change", changeVideoDestination);
  videoSelectors.parentNode.replaceChild(newVideoSelector, videoSelectors);
}
function handleError(error) {
  console.log("navigator.MediaDevices.getUserMedia error: ", error.message, error.name);
}
