import { Player } from "textalive-api";

const player = new Player({
  app: {
    appAuthor: "Jun Kato",
    appName: "Basic example"
  },
  mediaElement: document.querySelector("#media"),
  fontFamilies: []
});

player.addListener({
  onAppReady,
  onVideoReady,
  onTimeUpdate,
  onThrottledTimeUpdate
});

const playBtn = document.querySelector("#play");
const pauseBtn = document.querySelector("#pause");
const rewindBtn = document.querySelector("#rewind");
const skipBtn = document.querySelector("#skip");
const positionEl = document.querySelector("#position strong");

const artistSpan = document.querySelector("#artist span");
const songSpan = document.querySelector("#song span");
const phraseEl = document.querySelector("#container p");
const beatbarEl = document.querySelector("#beatbar");

function onAppReady(app) {
  if (!app.managed) {
    document.querySelector("#control").style.display = "block";
    playBtn.addEventListener("click", () => player.video && player.requestPlay());
    pauseBtn.addEventListener("click", () => player.video && player.requestPause());
    rewindBtn.addEventListener("click", () => player.video && player.requestMediaSeek(0));
    skipBtn.addEventListener("click", () => player.video && player.requestMediaSeek(player.video.firstPhrase.startTime));
  }
  if (!app.songUrl) {
      player.createFromSongUrl("http://www.youtube.com/watch?v=KdNHFKTKX2s");
  }
}

function onVideoReady(v) {
  artistSpan.textContent = player.data.song.artist.name;
  songSpan.textContent = player.data.song.name;

  let p = v.firstPhrase;
  skipBtn.disabled = !p;

  while (p && p.next) {
    p.animate = animatePhrase;
    p = p.next;
  }
}

function onTimeUpdate(position) {
  const beat = player.findBeat(position);
  if (!beat) {
    return;
  }
  beatbarEl.style.width = `${Math.ceil(beat.progress(position) * 100)}%`;
}

function onThrottledTimeUpdate(position) {
  positionEl.textContent = String(Math.floor(position));
}

function animatePhrase(now, unit) {
  if (unit.startTime <= now && unit.endTime > now) {
    phraseEl.textContent = unit.text;
  }
};