// All js for poker dice game

// JS for accordions
var acc = document.getElementsByClassName("accordion");

for (var i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}
/////////////////////////////////////////////////////////////////

class ZombieDice {
  // constructor makes 13 dice for the game
  // 6 dice have green risk (3 brain sides, 1 blast side, 2 tracks sides)
  // 4 dice have yellow risk (2 brain, 2 blast, 2 tracks)
  // 3 dice have red risk (1 brain, 3 blast, 2 tracks)
  constructor() {
    var brain = 1;
    var blast = 2;
    var tracks = 3;
    var green = [brain, brain, brain, blast, tracks, tracks];
    var yellow = [brain, brain, blast, blast, tracks, tracks];
    var red = [brain, blast, blast, blast, tracks, tracks];
    this.dice = [];
    this.hand = [];

    for (var i = 0; i < 6; i++) {
      this.dice.push(green);
    }
    for (var i = 0; i < 4; i++) {
      this.dice.push(yellow);
    }
    for (var i = 0; i < 3; i++) {
      this.dice.push(red);
    }
    // shuffle zombieDice
    let currentIndex = this.dice.length,
      randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      let temporaryValue = this.dice[currentIndex];
      this.dice[currentIndex] = this.dice[randomIndex];
      this.dice[randomIndex] = temporaryValue;
    }
  }

  // get dice Color
  getColor(dice) {
    if (dice === green) {
      return "green";
    } else if (dice === yellow) {
      return "yellow";
    } else if (dice === red) {
      return "red";
    } else {
      return "undefined";
    }
  }

  // get dice face
  getFace(result) {
    if (result === brain) {
      return "brain";
    } else if (result === blast) {
      return "blast";
    } else if (result === tracks) {
      return "tracks";
    }
  }

  // rolling or picking up
}

/**
 * Creates an instance of ZombieDiceGame.
 * Currently only allows 2 players
 */
class Game {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.brains = 0;
    this.blast = 0;
    this.score = [0, 0];
    this.currentPlayer = this.player1;
    this.gameEnded = false;
  }

  /**
   * Switches the current player
   */
  switchPlayer() {
    if (this.currentPlayer === this.player1) {
      this.currentPlayer = this.player2;
    } else {
      this.currentPlayer = this.player1;
    }
  }

  /**
   * Checks if a player has 13 brains to win the game
   * @returns {string} - winner of the game
   */
  checkWinner() {
    if (this.score[0] >= 13) {
      return this.player1;
    } else if (this.score[1] >= 13) {
      return this.player2;
    } else {
      return this.gameEnded;
    }
  }

  /**
   * Ends the turn if the player rolls 3 shotguns or hits the bank
   */
  endTurn() {
    if (this.blast === 3) {
      // lose all brains and start new turn
      this.brains = 0;
      this.blasts = 0;
      this.switchPlayer();
      // get new dice
      this.zombieDice = new ZombieDice();
    } else {
      // add brains to score and start new turn
      this.score[this.currentPlayer] += this.brains;
      this.brains = 0;
      this.blast = 0;
      this.switchPlayer();
      // get new dice
      this.zombieDice = new ZombieDice();
    }
  }

  /**
   * Reports the current player's turn and players scores
   */
  report() {
    var report = "";
    report += "Current Player: " + this.currentPlayer + "\n";
    report += "Current Brains: " + this.brains + "\n";
    report += "Current Shotguns: " + this.blast + "\n" + "\n";

    report += "Player 1 Score: " + this.score[0] + "\n";
    report += "Player 2 Score: " + this.score[1] + "\n";
    return report;
  }
}

var currentGame = new Game("Player 1", "Player 2");
var player1Box = document.getElementById("player1");
var player2Box = document.getElementById("player2");
var scoreArea = document.getElementById("scoreArea");
var startButton = document.getElementById("startButton");
var rollButton = document.getElementById("rollButton");
rollButton.disabled = true;
var bankButton = document.getElementById("bankButton");
bankButton.disabled = true;

startButton.addEventListener("click", function () {
  var player1 = player1Box.value;
  var player2 = player2Box.value;
  currentGame = new Game(player1, player2);
  scoreArea.innerText = currentGame.report();
  rollButton.disabled = false;
  bankButton.disabled = false;
});

rollButton.addEventListener("click", function () {
  if (currentGame.gameEnded) {
    rollButton.disabled = true;
    bankButton.disabled = true;
  } else if (currentGame.blasts >= 3) {
    currentGame.endTurn();
  } else {
    // roll dice
    var dice = currentGame.zombieDice.roll();

    // report dice
    for (var i = 0; i < 3; i++) {
      if (dice[i] === brain) {
        currentGame.brains++;
      } else if (dice[i] === blast) {
        currentGame.blast++;
      }
      // tracks need to be rerolled

    }

    scoreArea.innerText = currentGame.report();
  }
});

bankButton.addEventListener("click", function () {
  currentGame.endTurn();
  scoreArea.innerText = currentGame.report();
});
