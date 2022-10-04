// Declacring variables
const accordion = document.getElementsByClassName('mainbutton2');
const homeScreen = document.querySelector('#homescreen');
const startButton = document.querySelector('.mainbutton1');
const gameScreen = document.querySelector('#gamescreen');
const quitButton = document.querySelector('#quitbutton');
const playAgainButtonW = document.querySelector('#playagainw');
const playAgainButtonL = document.querySelector('#playagainl');
const gameOverScreenWin = document.querySelector('.gameoverscreenwin');
const gameOverScreenLose = document.querySelector('.gameoverscreenlose');
// elementButtons to call all data-element in HTML 
const elementButtons = document.querySelectorAll('[data-element]');
const finalColumn = document.querySelector('[data-final-column');
const computerScore = document.querySelector('#computerlifepointspan');
const yourScore = document.querySelector('#yourlifepointspan');
const turnCounter = document.querySelector('[data-turn-counter]');
const turnText = document.getElementById('turntxt');
const natureFx = document.querySelector('#naturefx');
const fireFx = document.querySelector('#firefx');
const waterFx = document.querySelector('#waterfx');

// Object array for name , emoji, and what it beats
const ELEMENTS = [
  {
      name: 'nature',
      emoji: '🍃',
      beats: 'water'
  },
  {
      name: 'fire',
      emoji: '🔥',
      beats: 'nature'
  },
  {
      name: 'water',
      emoji: '💧',
      beats: 'fire'
  }
];

// for loop for accordion
for ( let count = 0; count < accordion.length; count++) {
  accordion[count].addEventListener('click', function() {
    this.classList.toggle('active');
    let instructionContainer = this.nextElementSibling;
    if (instructionContainer.style.maxHeight) {
      instructionContainer.style.maxHeight = null;
    } else {
      instructionContainer.style.maxHeight = instructionContainer.scrollHeight + 'px';
    } 
  });
}

// This button will go on the gameScreen
startButton.addEventListener('click', () => {
    homeScreen.style.display = 'none';
    gameScreen.style.display = 'block';
});

// Quit button will go back to the title screen
quitButton.addEventListener('click', () => {
  //this will refresh the page to reset everything
  if (confirm('Do you want to EXIT THE GAME?')){
    location.reload();
  }
});

// playAgainButton will go back to the title screen
playAgainButtonW.addEventListener('click', () => {
  location.reload();

});

playAgainButtonL.addEventListener('click', () => {
    location.reload();
});

// forEach() is calling a function for each element in an array.
// elementButtons.forEach() calling each element of elementButtons.
// This lines of code is to show ELEMENTS object array
elementButtons.forEach(elementButton => {
  // all elementButton have an eventlistener of click
  elementButton.addEventListener('click', () => {
      // making constant elementName using the dataset of element which is in line 7
      const elementName = elementButton.dataset.element;
      // finding element
      const element = ELEMENTS.find(element => element.name === elementName)
      // callout the selectionElement function
      selectionElement(element);
      clickSound();
  });
});

// selectionElement function
function selectionElement(element) {
  // comuputer selection is random by the length of ELEMENTS which is 3
  const computerSelectionElement = randomElement();
  // this will say if you are the winner
  const yourWinner = isWinner(element, computerSelectionElement);
  // this will say if the computer is the winner
  const computerWinner = isWinner(computerSelectionElement, element);
  /* The reason why the computerSelection first and your selection second because it is going to be inserting these element instead of adding them to the end it will actually going to insert the directly after the computer on the history because the computerSelection the I will be inputting below the you and then when we insert your selection then it will also be below the you on the history and push the previous result which is the computerSelection. Since it is a 2 column grid it will be put in right order.
                History
      You                 Computer
  yourselection      computerselection*/
  addElementResult(computerSelectionElement, computerWinner);
  addElementResult(element, yourWinner);

  // if you are the winner decrement the computer health and change the turn text to YOU  win the turn.
  if(yourWinner) {
    turnText.innerHTML = 'YOU win the turn.';
    decrementScore(computerScore);
    // this conditions are to show attack to your opponent sprite like like nature, fire, and, water 
    if (computerSelectionElement.name == 'nature') {
      natureFx.style.display = 'none';
      fireFx.style.display = 'block';
      waterFx.style.display = 'none';
    }
    else if (computerSelectionElement.name == 'fire') {
      natureFx.style.display = 'none';
      fireFx.style.display = 'none';
      waterFx.style.display = 'block';
    }
    else if (computerSelectionElement.name == 'water') {
      natureFx.style.display = 'block';
      fireFx.style.display = 'none';
      waterFx.style.display = 'none';
    }
    // if the computer health is zero then it will show the gameoverw and play the winning sound.
    if(computerScore.innerHTML < 1) {
      gameScreen.style.display = 'none';
      gameOverScreenWin.style.display = 'flex';
      gameOverWinSound();
    }
  }
  // if computer is the winner decrement the your health and change the turn text to Computer  win the turn.
  else if(computerWinner) {
    turnText.innerHTML = 'COMPUTER win the turn.';
    decrementScore(yourScore);
    // this conditions are to show attack to your sprite like like nature, fire, and, water 
    if (computerSelectionElement[0]) {
      natureFx.style.display = 'block';
      fireFx.style.display = 'none';
      waterFx.style.display = 'none';
      natureFx.style.left = '21.5%';
    }
    else if (computerSelectionElement[1]) {
      natureFx.style.display = 'none';
      fireFx.style.display = 'block';
      waterFx.style.display = 'none';
      fireFx.style.left = '21.5%';
    }
    else {
      natureFx.style.display = 'none';
      fireFx.style.display = 'none';
      waterFx.style.display = 'block';
      waterFx.style.left = '21.5%';
    }
    // if the computer health is zero then it will show the gameoverl and play the losing sounds.
    if(yourScore.innerHTML < 1) {
      gameScreen.style.display = 'none';
      gameOverScreenLose.style.display = 'flex';
      gameOverLoseSound();
    }
  }
  // else its a draw.
  else {
    turnText.innerHTML = 'The turn is DRAW.'
    natureFx.style.display = 'none';
    fireFx.style.display = 'none';
    waterFx.style.display = 'none';

  }

  // Calling out the incrementTurn of turn.
  incrementTurn(turnCounter);
}

// funtion to decrement score.
function decrementScore(scoreSpan) {
  scoreSpan.innerText = parseInt(scoreSpan.innerText) - 1;
}

// funtion to increment turns.
function incrementTurn(turnSpan) {
  turnSpan.innerText = parseInt(turnSpan.innerText) + 1;
}

// function to create a div and putting emoji, it will create the winner
function addElementResult(element, winner) {
  const div = document.createElement('div');
  div.innerText = element.emoji;
  div.classList.add('result-element');
  if (winner) div.classList.add('winner');
  finalColumn.after(div);
}

// funtion to know who is the winner is
function isWinner(element, opponentElement) {
  return element.beats === opponentElement.name;
}

// random element function to random the result
function randomElement() {
  // random number 0 to 2 since the length of ELEMENTS is 3 and the number start at 0.
  const random = Math.floor(Math.random() * ELEMENTS.length);
  // return random ELEMENTS
  return ELEMENTS[random];
}

// funtion for the click sound on the element
function clickSound() {
  // declaring new audio
  const swoosh = new Audio('assets/swoosh.mp3');
  swoosh.play();
}

// function gave over lose sound
function gameOverLoseSound() {
  // declarling new audio
  const gameLoseSound = new Audio('assets/gameover.mp3');
  const gameLoseSoundNext = new Audio('assets/gameovernext.mp3');
  //  set up the volume
  gameLoseSoundNext.volume = 0.5;
  gameLoseSound.play();
  gameLoseSoundNext.play();
}

// function for game over win sound
function gameOverWinSound() {
  const gameWinSound = new Audio('assets/gameoverwin.mp3');
  gameWinSound.play();
}