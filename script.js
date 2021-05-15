const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
let lastHole,
  timeUp = false,
  score = 0;

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
  scoreBoard.textContent = 0;
  timeUp = false;
  score = 0;
  peep();
  setTimeout(() => (timeUp = true), 20000);
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
