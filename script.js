const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const displayedWinScore = document.querySelector('.win-score');
const gameInfo = document.querySelector('.game-info');
const timeLeft = document.querySelector('.time-left');
const moles = document.querySelectorAll('.mole');
const btn = document.querySelector('.btn');
const overlay = document.querySelector('.overlay');
const overlayMsg = document.querySelector('.overlay p');
const initialCountdown = document.querySelector('.pregame-countdown-text');
const initialCountdownBg = document.querySelector('.pregame-countdown-bg');

let beginTimestamp,
  endTimestamp,
  countdown,
  lastHole,
  lastMsgIdx,
  lastSoundIdx,
  sound,
  score = 0,
  winScore = 10,
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
  // Stops peep() since its setTimeout stops recursively calling itself when timeUp is true
  timeUp = true;
  // Wait for mole that's popped up to go back down before initial countdown
  holes.forEach(
    (hole) => hole.classList.contains('up') && hole.classList.remove('up')
  );
  timeLeft.textContent = 0;
  let num = 4;
  initialCountdown.style.opacity = '0';
  btn.style.display = 'none';
  gameInfo.style.display = 'none';
  initialCountdownBg.style.display = 'block';
  overlay.style.display = 'none';
  scoreBoard.textContent = 0;
  let pregameCountdown = setInterval(() => {
    num--;
    // opacity is 0 at first. text is set, then opacity is set to 1; fades in.
    initialCountdown.textContent = num;
    initialCountdown.style.opacity = '1';
    if (num < 1) {
      btn.style.display = 'inline-block';
      initialCountdown.textContent = '';
      initialCountdownBg.style.display = 'none';
      clearInterval(pregameCountdown);
      beginTimestamp = Math.floor(Date.now() / 1000); // Dividing by 1000 to get s from ms
      gameInfo.style.display = 'inline';
      endTimestamp = beginTimestamp + 20;
      // Setting here in addition to in set interval so time appears in time remaining immediately
      timeLeft.textContent = endTimestamp - Math.floor(Date.now() / 1000);
      timeUp = false;
      score = 0;
      btn.textContent = 'Restart';
      peep();
      countdown = setInterval(() => {
        timeLeft.textContent = endTimestamp - Math.floor(Date.now() / 1000);
        if (
          score === winScore ||
          endTimestamp - Math.floor(Date.now() / 1000) <= 0
        ) {
          endGame();
        }
      }, 1000);
    }
  }, 1000);
}

function setMsg() {
  const winMessages = [
    'Winner, winner, chicken dinner!',
    "You knocked 'em dead!",
    'Champion!',
    'Felicitations, you won!',
    'Nice one!',
  ];
  const loseMessages = [
    'Better luck next time!',
    'Drat, you lost!',
    'Butter my butt and call me a biscuit... You lost!',
    'Doggone it, you lost!',
    'Cripes, you lost!',
  ];
  let randomIdx = Math.floor(
    Math.random() *
      (score === winScore ? winMessages.length : loseMessages.length)
  );
  if (randomIdx === lastMsgIdx) {
    return setMsg();
  }
  lastMsgIdx = randomIdx;
  if (score === winScore) {
    overlayMsg.innerText = winMessages[randomIdx];
  } else {
    overlayMsg.innerText = loseMessages[randomIdx];
  }
}

function endGame() {
  clearInterval(countdown);
  setMsg();
  // Sound wouldn't be truthy if 0 moles whacked and thus sound never was set to audio instance
  if (sound) sound.pause();
  overlay.style.display = 'flex';
  timeLeft.textContent = 0;
  timeUp = true;
  btn.textContent = 'Play Again';
}

function playSound() {
  const sounds = [
    'sounds/grunt1.mp3',
    'sounds/grunt2.mp3',
    'sounds/grunt3.mp3',
  ];
  let randomIdx = Math.floor(Math.random() * sounds.length);
  if (randomIdx === lastSoundIdx) {
    return playSound();
  }
  lastSoundIdx = randomIdx;
  if (sound && sound.paused === false) {
    sound.pause();
    sound.currentTime = 0;
    sound = new Audio(sounds[randomIdx]);
    sound.play();
  } else {
    sound = new Audio(sounds[randomIdx]);
    sound.play();
  }
}

function bonk(e) {
  if (!e.isTrusted) return; // Prevent result from simulated mouse click
  // `this` in event handler refers to element which detected event (div with class of mole)
  // console.log('this is', this);
  // console.log('parent node is', this.parentNode);
  score++;
  playSound();
  // parent node is div with class of hole, which had up added
  this.parentNode.classList.remove('up');
  scoreBoard.textContent = score;
}

moles.forEach((mole) => mole.addEventListener('click', bonk));
