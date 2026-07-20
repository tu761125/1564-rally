const playersList = document.getElementById("playersList");
const resultPanel = document.getElementById("resultPanel");
const resultList = document.getElementById("resultList");
const errorMessage = document.getElementById("errorMessage");
const copyStatus = document.getElementById("copyStatus");

const countdownScreen = document.getElementById("countdownScreen");
const countdownPlayer = document.getElementById("countdownPlayer");
const countdownInstruction = document.getElementById("countdownInstruction");
const countdownNumber = document.getElementById("countdownNumber");
const countdownProgress = document.getElementById("countdownProgress");

let rallyCount = 2;
let calculatedRallies = [];
let timeline = [];
let timerId = null;
let startTimestamp = 0;
let pausedElapsed = 0;
let isPaused = false;
let currentEventIndex = -1;
let finishedTimeout = null;

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
      <input class="march-time" type="text" inputmode="numeric"
             placeholder="1:30" maxlength="5" aria-label="March time">
    `;
    playersList.appendChild(row);
  }
}

document.querySelectorAll(".count-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".count-btn").forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    rallyCount = Number(button.dataset.count);
    renderPlayers();
    clearResults();
  });
});

function parseMarchTime(value) {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{1,2}):([0-5]\d)$/);

  if (!match) return null;

  const minutes = Number(match[1]);
  const seconds = Number(match[2]);
  const total = minutes * 60 + seconds;

  if (total < 0 || total > 300) return null;
  return total;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function collectPlayers() {
  const rows = [...document.querySelectorAll(".player-row")];
  const players = [];

  for (let i = 0; i < rows.length; i++) {
    const nameInput = rows[i].querySelector(".player-name");
    const marchInput = rows[i].querySelector(".march-time");

    const name = nameInput.value.trim() || `Player ${i + 1}`;
    const marchSeconds = parseMarchTime(marchInput.value);

    if (marchSeconds === null) {
      throw new Error(`請檢查第 ${i + 1} 位的行軍時間，格式例如 1:30。`);
    }

    players.push({ name, marchSeconds });
  }

  return players;
}

function calculateRallies() {
  try {
    errorMessage.textContent = "";
    copyStatus.textContent = "";

    const players = collectPlayers();
    players.sort((a, b) => b.marchSeconds - a.marchSeconds);

    const longestMarch = players[0].marchSeconds;

    calculatedRallies = players.map((player, index) => ({
      ...player,
      position: index + 1,
      offset: longestMarch - player.marchSeconds
    }));

    renderResults();
    resultPanel.classList.remove("hidden");
    resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    clearResults();
    errorMessage.textContent = error.message;
  }
}

function renderResults() {
  resultList.innerHTML = calculatedRallies.map((rally) => `
    <div class="result-item">
      <div class="result-position">${rally.position}</div>
      <div>
        <div class="result-name">${escapeHtml(rally.name)}</div>
        <div class="result-march">March 行軍 ${formatTime(rally.marchSeconds)}</div>
      </div>
      <div class="result-offset">${rally.offset === 0 ? "NOW · 立即" : `+${rally.offset}s`}</div>
    </div>
  `).join("");
}

function clearResults() {
  calculatedRallies = [];
  resultList.innerHTML = "";
  resultPanel.classList.add("hidden");
  errorMessage.textContent = "";
  copyStatus.textContent = "";
}

function resetAll() {
  stopTimer();
  renderPlayers();
  clearResults();
}

function buildTimeline() {
  timeline = calculatedRallies.map((rally) => ({
    player: rally.name,
    offset: rally.offset,
    position: rally.position
  }));
}

function startCountdown() {
  if (!calculatedRallies.length) return;

  buildTimeline();
  stopTimer();

  startTimestamp = performance.now();
  pausedElapsed = 0;
  isPaused = false;
  currentEventIndex = -1;

  countdownScreen.classList.remove("hidden", "warning", "go");
  document.body.style.overflow = "hidden";
  document.getElementById("pauseBtn").textContent = "Pause · 暫停";

  updateCountdown();
  timerId = window.setInterval(updateCountdown, 100);
}

function updateCountdown() {
  const elapsed = isPaused
    ? pausedElapsed
    : (performance.now() - startTimestamp) / 1000;

  let nextIndex = timeline.findIndex((event) => event.offset > elapsed);

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

  if (nextIndex !== currentEventIndex) {
    currentEventIndex = nextIndex;
  }

  if (event.offset === 0 || remaining === 0) {
    showGo(event, nextIndex);
    return;
  }

  countdownScreen.classList.toggle("warning", remaining <= 5);
  countdownScreen.classList.remove("go");
  countdownPlayer.textContent = event.player;
  countdownInstruction.textContent = "OPEN IN · 剩餘時間";
  countdownNumber.textContent = remaining;
  countdownProgress.textContent = `${nextIndex + 1} / ${timeline.length}`;
}

function showGo(event, index) {
  countdownScreen.classList.remove("warning");
  countdownScreen.classList.add("go");
  countdownPlayer.textContent = event.player;
  countdownInstruction.textContent = "OPEN RALLY NOW · 立即開集結";
  countdownNumber.textContent = "GO!";
  countdownProgress.textContent = `${index + 1} / ${timeline.length}`;
}

function finishCountdown() {
  stopTimer(false);
  countdownScreen.classList.remove("warning");
  countdownScreen.classList.add("go");
  countdownPlayer.textContent = "ALL RALLIES";
  countdownInstruction.textContent = "COMPLETE · 全部已發車";
  countdownNumber.textContent = "DONE";
  countdownProgress.textContent = `${timeline.length} / ${timeline.length}`;

  finishedTimeout = window.setTimeout(() => {
    closeCountdown();
  }, 2600);
}

function togglePause() {
  if (!timerId && !isPaused) return;

  const pauseBtn = document.getElementById("pauseBtn");

  if (!isPaused) {
    pausedElapsed = (performance.now() - startTimestamp) / 1000;
    isPaused = true;
    window.clearInterval(timerId);
    timerId = null;
    pauseBtn.textContent = "Resume · 繼續";
  } else {
    startTimestamp = performance.now() - pausedElapsed * 1000;
    isPaused = false;
    timerId = window.setInterval(updateCountdown, 100);
    pauseBtn.textContent = "Pause · 暫停";
  }
}

function restartCountdown() {
  startCountdown();
}

function stopTimer(clearFinish = true) {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }

  if (clearFinish && finishedTimeout) {
    window.clearTimeout(finishedTimeout);
    finishedTimeout = null;
  }
}

function closeCountdown() {
  stopTimer();
  countdownScreen.classList.add("hidden");
  countdownScreen.classList.remove("warning", "go");
  document.body.style.overflow = "";
}

async function copyResult() {
  if (!calculatedRallies.length) return;

  const lines = [
    "📢 Rally Order / 集結順序",
    "Kingdom 1564",
    ""
  ];

  calculatedRallies.forEach((rally) => {
    const timing = rally.offset === 0
      ? "NOW / 立即"
      : `+${rally.offset}s / ${rally.offset}秒後`;

    lines.push(`${rally.position}. ${rally.name} — ${timing}`);
  });

  const text = lines.join("\n");

  try {
    await navigator.clipboard.writeText(text);
    copyStatus.textContent = "Copied! 已複製，可直接貼到遊戲聊天。";
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    copyStatus.textContent = "Copied! 已複製，可直接貼到遊戲聊天。";
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

document.getElementById("calculateBtn").addEventListener("click", calculateRallies);
document.getElementById("resetBtn").addEventListener("click", resetAll);
document.getElementById("startBtn").addEventListener("click", startCountdown);
document.getElementById("copyBtn").addEventListener("click", copyResult);
document.getElementById("pauseBtn").addEventListener("click", togglePause);
document.getElementById("restartBtn").addEventListener("click", restartCountdown);
document.getElementById("closeCountdownBtn").addEventListener("click", closeCountdown);

renderPlayers();
