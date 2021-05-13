const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
let lastHole;
let timeUp = false;

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
  const time = randomTime(200, 1000);
  const hole = randomHole(holes);
  // Sets top to 0 in CSS, which animates it because by default it has top of 100%
  hole.classList.add('up');
  setTimeout(() => {
    hole.classList.remove('up');
    if (!timeUp) peep();
  }, time);
}

function startGame() {
  scoreBoard.textContent = 0;
  timeUp = false;
  peep();
  setTimeout(() => (timeUp = true), 15000);
}
