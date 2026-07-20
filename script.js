const playersList = document.getElementById("playersList");
const resultCard = document.getElementById("resultCard");
const resultList = document.getElementById("resultList");
const errorMessage = document.getElementById("errorMessage");
const copyMessage = document.getElementById("copyMessage");

const countdownScreen = document.getElementById("countdownScreen");
const countdownPlayer = document.getElementById("countdownPlayer");
const countdownInstruction = document.getElementById("countdownInstruction");
const countdownNumber = document.getElementById("countdownNumber");
const countdownIndex = document.getElementById("countdownIndex");

let rallyCount = 2;
let rallies = [];
let timeline = [];
let timerId = null;
let startTimestamp = 0;
let pausedElapsed = 0;
let isPaused = false;
let finishTimeout = null;

function renderPlayers() {
  playersList.innerHTML = "";

  for (let i = 0; i < rallyCount; i++) {
    const row = document.createElement("div");
    row.className = "player-row";
    row.innerHTML = `
      <div class="input-wrap">
        <span class="player-index">${i + 1}</span>
        <input class="player-name" type="text" maxlength="24"
               placeholder="Player ${i + 1}" autocomplete="off">
      </div>
      <input class="march-min" type="number" inputmode="numeric"
             min="0" max="5" placeholder="0" aria-label="March minutes">
      <input class="march-sec" type="number" inputmode="numeric"
             min="0" max="59" placeholder="00" aria-label="March seconds">
    `;
    playersList.appendChild(row);
  }
}

document.querySelectorAll(".count-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".count-btn").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    rallyCount = Number(button.dataset.count);
    renderPlayers();
    clearResults();
  });
});

playersList.addEventListener("input", (event) => {
  const input = event.target;

  if (input.classList.contains("march-min")) {
    if (input.value === "") return;
    let value = Number(input.value);
    if (value > 5) input.value = 5;
    if (value < 0) input.value = 0;
  }

  if (input.classList.contains("march-sec")) {
    if (input.value === "") return;
    let value = Number(input.value);
    if (value > 59) input.value = 59;
    if (value < 0) input.value = 0;
  }
});

function parseTime(minuteValue, secondValue) {
  const minText = String(minuteValue ?? "").trim();
  const secText = String(secondValue ?? "").trim();

  const minutes = minText === "" ? 0 : Number(minText);
  const seconds = secText === "" ? 0 : Number(secText);

  if (!Number.isInteger(minutes) || !Number.isInteger(seconds)) return null;
  if (minutes < 0 || minutes > 5) return null;
  if (seconds < 0 || seconds > 59) return null;

  const total = minutes * 60 + seconds;
  return total <= 300 ? total : null;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function collectPlayers() {
  const rows = [...document.querySelectorAll(".player-row")];

  return rows.map((row, index) => {
    const name = row.querySelector(".player-name").value.trim() || `Player ${index + 1}`;
    const minutes = row.querySelector(".march-min").value;
    const seconds = row.querySelector(".march-sec").value;
    const marchSeconds = parseTime(minutes, seconds);

    if (marchSeconds === null) {
      throw new Error(`請檢查第 ${index + 1} 位：分鐘 0～5，秒數 0～59。`);
    }

    return { name, marchSeconds };
  });
}

function calculate() {
  try {
    errorMessage.textContent = "";
    copyMessage.textContent = "";

    const players = collectPlayers().sort((a, b) => b.marchSeconds - a.marchSeconds);
    const longest = players[0].marchSeconds;

    rallies = players.map((player, index) => ({
      ...player,
      position: index + 1,
      offset: longest - player.marchSeconds
    }));

    renderResults();
    resultCard.classList.remove("hidden");
    resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    clearResults();
    errorMessage.textContent = error.message;
  }
}

function renderResults() {
  resultList.innerHTML = rallies.map((rally) => `
    <div class="result-item">
      <div class="pos">${rally.position}</div>
      <div>
        <div class="name">${escapeHtml(rally.name)}</div>
        <div class="meta">March 行軍 ${formatTime(rally.marchSeconds)}</div>
      </div>
      <div class="offset">${rally.offset === 0 ? "NOW · 立即" : `+${formatTime(rally.offset)}`}</div>
    </div>
  `).join("");
}

function clearResults() {
  rallies = [];
  resultList.innerHTML = "";
  resultCard.classList.add("hidden");
  errorMessage.textContent = "";
  copyMessage.textContent = "";
}

function resetAll() {
  stopTimer();
  renderPlayers();
  clearResults();
}

function startCountdown() {
  if (!rallies.length) return;

  timeline = rallies.map((rally) => ({
    player: rally.name,
    offset: rally.offset,
    position: rally.position
  }));

  stopTimer();
  startTimestamp = performance.now();
  pausedElapsed = 0;
  isPaused = false;

  countdownScreen.classList.remove("hidden", "warning", "go");
  document.body.style.overflow = "hidden";
  document.getElementById("pauseBtn").textContent = "Pause · 暫停";

  updateCountdown();
  timerId = window.setInterval(updateCountdown, 100);
}

function updateCountdown() {
  const elapsed = isPaused ? pausedElapsed : (performance.now() - startTimestamp) / 1000;
  const nextIndex = timeline.findIndex((event) => event.offset > elapsed);

  if (nextIndex === -1) {
    const lastIndex = timeline.length - 1;
    const lastEvent = timeline[lastIndex];
    const sinceLast = elapsed - lastEvent.offset;

    if (sinceLast < 1.4) {
      showGo(lastEvent, lastIndex);
    } else {
      finishCountdown();
    }
    return;
  }

  const event = timeline[nextIndex];
  const remaining = Math.max(0, Math.ceil(event.offset - elapsed));

  if (remaining === 0) {
    showGo(event, nextIndex);
    return;
  }

  countdownScreen.classList.toggle("warning", remaining <= 5);
  countdownScreen.classList.remove("go");
  countdownPlayer.textContent = event.player;
  countdownInstruction.textContent = "OPEN IN · 剩餘時間";
  countdownNumber.textContent = remaining;
  countdownIndex.textContent = `${nextIndex + 1} / ${timeline.length}`;
}

function showGo(event, index) {
  countdownScreen.classList.remove("warning");
  countdownScreen.classList.add("go");
  countdownPlayer.textContent = event.player;
  countdownInstruction.textContent = "OPEN RALLY NOW · 立即開集結";
  countdownNumber.textContent = "GO!";
  countdownIndex.textContent = `${index + 1} / ${timeline.length}`;
}

function finishCountdown() {
  stopTimer(false);
  countdownScreen.classList.remove("warning");
  countdownScreen.classList.add("go");
  countdownPlayer.textContent = "ALL RALLIES";
  countdownInstruction.textContent = "COMPLETE · 全部已發車";
  countdownNumber.textContent = "DONE";
  countdownIndex.textContent = `${timeline.length} / ${timeline.length}`;

  finishTimeout = window.setTimeout(closeCountdown, 2600);
}

function togglePause() {
  const pauseBtn = document.getElementById("pauseBtn");

  if (!isPaused) {
    pausedElapsed = (performance.now() - startTimestamp) / 1000;
    isPaused = true;
    if (timerId) window.clearInterval(timerId);
    timerId = null;
    pauseBtn.textContent = "Resume · 繼續";
  } else {
    startTimestamp = performance.now() - pausedElapsed * 1000;
    isPaused = false;
    timerId = window.setInterval(updateCountdown, 100);
    pauseBtn.textContent = "Pause · 暫停";
  }
}

function stopTimer(clearFinish = true) {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }

  if (clearFinish && finishTimeout) {
    window.clearTimeout(finishTimeout);
    finishTimeout = null;
  }
}

function closeCountdown() {
  stopTimer();
  countdownScreen.classList.add("hidden");
  countdownScreen.classList.remove("warning", "go");
  document.body.style.overflow = "";
}

async function copyResult() {
  if (!rallies.length) return;

  const lines = ["📢 Rally Order / 集結順序", "Kingdom 1564", ""];

  rallies.forEach((rally) => {
    const timing = rally.offset === 0
      ? "NOW / 立即"
      : `+${formatTime(rally.offset)} / ${rally.offset}秒後`;

    lines.push(`${rally.position}. ${rally.name} — ${timing}`);
  });

  const text = lines.join("\n");

  try {
    await navigator.clipboard.writeText(text);
    copyMessage.textContent = "Copied! 已複製，可直接貼到遊戲聊天。";
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    copyMessage.textContent = "Copied! 已複製，可直接貼到遊戲聊天。";
  }
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

document.getElementById("calculateBtn").addEventListener("click", calculate);
document.getElementById("resetBtn").addEventListener("click", resetAll);
document.getElementById("startBtn").addEventListener("click", startCountdown);
document.getElementById("copyBtn").addEventListener("click", copyResult);
document.getElementById("pauseBtn").addEventListener("click", togglePause);
document.getElementById("restartBtn").addEventListener("click", startCountdown);
document.getElementById("closeBtn").addEventListener("click", closeCountdown);

renderPlayers();
