const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const letters = "アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const fontSize = 15;
let columns = Math.floor(width / fontSize);

let drops = Array(columns).fill(0);

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#00ff9c";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(
            Math.floor(Math.random() * letters.length)
        );

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        drops[i]++;
    }
}

setInterval(drawMatrix, 35);

window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / fontSize);
    drops = Array(columns).fill(0);
});

const HUMAN = "X";
const AI = "O";

const cells = document.querySelectorAll(".cell");

let currentPlayer = HUMAN;
let gameOver = false;

let board = Array(9).fill("");

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function aiMove() {
    if (gameOver) return;

    // buscar espacios vacíos
    const emptyIndexes = board
        .map((val, i) => val === "" ? i : null)
        .filter(i => i !== null);

    if (emptyIndexes.length === 0) return;

    // elegir uno al azar
    const randomIndex =
        emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];

    board[randomIndex] = AI;
    cells[randomIndex].classList.add("o");

    // verificar ganador
    if (checkWinner(AI)) {
        gameOver = true;
        showWinner(AI);
        return;
    }

    currentPlayer = HUMAN;
}

function matrixEffect(cell) {
  const chars = "01アカサタナハマヤラワ0123456789";
  const span = document.createElement("span");
  span.classList.add("matrix");

  let text = "";
  for (let i = 0; i < 14; i++) {
    text += chars[Math.floor(Math.random() * chars.length)];
  }

  span.textContent = text;
  cell.appendChild(span);

  setTimeout(() => span.remove(), 550);
}

function checkWinner(player) {
    return winPatterns.some(pattern =>
        pattern.every(i => board[i] === player)
    );
}


cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {

        if (board[index] !== "" || gameOver) return;

        board[index] = HUMAN;
        cell.classList.add("x");
        matrixEffect(cell);

        if (checkWinner(HUMAN)) {
            gameOver = true;
            showWinner(HUMAN);
            return;
        }

        if (!board.includes("")) {
            gameOver = true;
            alert("EMPATE");
            return;
        }

        currentPlayer = AI;

        setTimeout(aiMove, 450);
    });
});

function showWinner(player) {
    const overlay = document.getElementById("winnerOverlay");
    const text = document.getElementById("winnerText");

    text.textContent =
        player === HUMAN
            ? "YOU ESCAPED THE MATRIX"
            : "THE SYSTEM TOOK CONTROL";

    overlay.classList.add("show");
}


document.getElementById("restartBtn").addEventListener("click", () => {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;

  cells.forEach(cell => {
    cell.classList.remove("x", "o");
    cell.innerHTML = "";
  });

  document.getElementById("winnerOverlay").classList.remove("show");
});
