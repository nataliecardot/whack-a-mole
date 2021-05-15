const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const displayedWinScore = document.querySelector('.win-score');
const gameInfo = document.querySelector('.game-info');
const timeLeft = document.querySelector('.time-left');
const moles = document.querySelectorAll('.mole');
const btn = document.querySelector('.btn');
const overlay = document.querySelector('.overlay');
const overlayMsg = document.querySelector('.overlay p');

let beginTimestamp,
  endTimestamp,
  countdown,
  lastHole,
  score = 0,
  winScore = 8,
  timeUp = false;

displayedWinScore.textContent = winScore;

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  // Prevent repeat hole
  if (hole === lastHole) {
    // In returning recursive function call, it's called again
    return randomHole(holes);
  }
  lastHole = hole;
  return hole;
}

function peep() {
  // Amount of time mole is popped up
  const time = randomTime(500, 1300);
  const hole = randomHole(holes);
  // Sets top to 0 in CSS, which animates it because by default it has top of 100%
  hole.classList.add('up');
  setTimeout(() => {
    hole.classList.remove('up');
    if (!timeUp) peep();
  }, time);
}

function startGame() {
  overlay.style.display = 'none';
  scoreBoard.textContent = 0;
  beginTimestamp = Math.floor(Date.now() / 1000); // Dividing by 1000 to get s from ms
  gameInfo.style.display = 'inline';
  endTimestamp = beginTimestamp + 20;
  // Setting here in addition to in set interval so time appears in time remaining immediately
  timeLeft.textContent = endTimestamp - Math.floor(Date.now() / 1000);
  timeUp = false;
  score = 0;
  btn.textContent = 'Restart';
  peep();
  let countdown = setInterval(() => {
    timeLeft.textContent = endTimestamp - Math.floor(Date.now() / 1000);
    if (
      score === winScore ||
      endTimestamp - Math.floor(Date.now() / 1000) <= 0
    ) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  overlay.style.display = 'flex';
  if (score === winScore) {
    overlayMsg.innerText = 'Winner, winner, chicken dinner!';
  } else {
    overlayMsg.innerText = 'Butter my butt and call me a biscuit... You lost!';
  }
  clearInterval(countdown);
  timeLeft.textContent = 0;
  timeUp = true;
  btn.textContent = 'Play Again';
}

function bonk(e) {
  if (!e.isTrusted) return; // Prevent result from simulated mouse click
  // `this` in event handler refers to element which detected event (div with class of mole)
  // console.log('this is', this);
  // console.log('parent node is', this.parentNode);
  score++;
  // parent node is div with class of hole, which had up added
  this.parentNode.classList.remove('up');
  scoreBoard.textContent = score;
}

moles.forEach((mole) => mole.addEventListener('click', bonk));
moles.forEach((mole) => mole.addEventListener('touch', bonk));
