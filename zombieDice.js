//////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////

// All js for Zombie dice game
class ZombieDice {
  constructor() {
    var brain = 1;
    var blast = 2;
    var tracks = 3;
    this.green = [brain, brain, brain, blast, tracks, tracks];
    this.yellow = [brain, brain, blast, blast, tracks, tracks];
    this.red = [brain, blast, blast, blast, tracks, tracks];
    this.tableDice = [];
    this.hand = [];
    this.currentRoll = [];

    // constructor makes 13 dice for the game
    // 6 dice have green risk (3 brain sides, 1 blast side, 2 tracks sides)
    // 4 dice have yellow risk (2 brain, 2 blast, 2 tracks)
    // 3 dice have red risk (1 brain, 3 blast, 2 tracks)
    for (var i = 0; i < 6; i++) {
      this.tableDice.push(this.green);
    }
    for (var i = 0; i < 4; i++) {
      this.tableDice.push(this.yellow);
    }
    for (var i = 0; i < 3; i++) {
      this.tableDice.push(this.red);
    }

    ///////////////////////////////////////////////////
    // shuffle zombieDice
    let currentIndex = this.tableDice.length,
      randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      let temporaryValue = this.tableDice[currentIndex];
      this.tableDice[currentIndex] = this.tableDice[randomIndex];
      this.tableDice[randomIndex] = temporaryValue;
    }
    ///////////////////////////////////////////////////
  }

  // get dice Color
  getColor(dice) {
    // if dice has 3 brain sides, return green
    // if dice has 2 brain sides, return yellow
    // if dice has 1 brain side, return red
    var brain = 0;
    for (var i = 0; i < dice.length; i++) {
      if (dice[i] === 1) {
        brain++;
      }
    }
    if (brain === 3) {
      return "Green";
    } else if (brain === 2) {
      return "Yellow";
    } else if (brain === 1) {
      return "Red";
    }
  }

  // get dice face (basically rolls dice)
  getFace(dice) {
    // roll dice
    var face = dice[Math.floor(Math.random() * dice.length)];
    if (face == 1) {
      return "Brain";
    } else if (face == 2) {
      return "Shotgun";
    }
    return "Tracks";
  }

  // picking up dice
  pickUp() {
    if (this.tableDice.length < 3) {
      game.refill();
    }
    this.hand = [];
    // if blasts > 3, brains and blasts = 0 and end turn
    if (game.shotguns >= 3) {
      game.dice.hand = [];
      game.brains = 0;
      game.shotguns = 0;
      game.endTurn();
    }
    // adds the color of the dice that were rolled previously to hand
    if (this.currentRoll.length > 0) {
      for (var i = 0; i < this.currentRoll.length; i++) {
        if (this.currentRoll[i] == "Green") {
          this.hand.push(this.green);
        } else if (this.currentRoll[i] == "Yellow") {
          this.hand.push(this.yellow);
        } else if (this.currentRoll[i] == "Red") {
          this.hand.push(this.red);
        }
      }
    }
    // pick up until there are 3 dice in hand
    while (this.hand.length < 3) {
      // pickup dice from zombieDices
      var dice = this.tableDice.pop();
      // add dice to hand
      this.hand.push(dice);
    }
    this.currentRoll = [];
  }

  // selects the picture for the dice
  getDice(color, face) {
    var pic = document.createElement("img");
    pic.src = "images/Die" + color + face + ".png";
    pic.alt = color + " " + face;
    pic.height = 50;
    pic.weight = 50;
    return pic;
  }
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
    this.shotguns = 0;
    this.score = [0, 0];
    this.currentPlayer = this.player1;
    this.dice = new ZombieDice();
    this.currentBlast = [];
    this.currentBrain = [];
    this.diceDisplay = [];
  }
  // saves the blasts that have been rolled
  getBlast(color, face) {
    var pic = document.createElement("img");
    pic.src = "images/Die" + color + face + ".png";
    pic.alt = color + " " + face;
    pic.height = 50;
    pic.weight = 50;
    this.currentBlast.push(pic);
  }
  // saves the dice still in the cup
  displayTableDice(color) {
    var pic = document.createElement("img");
    pic.src = "images/Die" + color + "Tracks.png";
    pic.alt = color + " Tracks";
    pic.height = 50;
    pic.weight = 50;
    this.diceDisplay.push(pic);
  }
  // saves the rolled brains
  getBrain(color) {
    var pic = document.createElement("img");
    pic.src = "images/Die" + color + "Brain.png";
    pic.alt = color + " Brains";
    pic.height = 50;
    pic.weight = 50;
    this.currentBrain.push(pic);
  }
  /**
   * Switches the current player
   * We'll need to change this for more players
   */
  switchPlayer() {
    this.currentBlast = [];
    this.currentBrain = [];
    if (this.currentPlayer === this.player1) {
      this.currentPlayer = this.player2;
    } else {
      this.currentPlayer = this.player1;
    }
  }

  /**
   * Checks if a player has 13 brains to win the game
   * @returns {string} - winner of the game or empty string if no winner
   */
  checkWinner() {
    if (this.score[0] >= 13) {
      return this.player1;
    } else if (this.score[1] >= 13) {
      return this.player2;
    } else {
      return "";
    }
  }

  /**
   * Ends the current turn, adds brains (if blasts > 3, it will add 0),
   * switches players, and creates new dice.
   */
  endTurn() {
    // if blasts > 3, brains and blasts = 0 and end turn
    if (this.shotguns < 3) {
      if (this.currentPlayer === this.player1) {
        this.score[0] += this.brains;
      } else {
        this.score[1] += this.brains;
      }
    }
    // add brains to score and start new turn
    this.switchPlayer();
    // get new dice
    this.dice = new ZombieDice();
    // reset brains and blasts
    this.brains = 0;
    this.shotguns = 0;
  }
  // refills the dice when empty
  refill() {
    this.dice = new ZombieDice();
  }

  /**
   * Reports the current player's turn and players scores
   */
  report() {
    var report = "";
    report += "Player 1 Score: " + this.score[0] + "\n";
    report += "Player 2 Score: " + this.score[1] + "\n";
    report += "Current Player: " + this.currentPlayer;
    return report;
  }
}

// new line
var br = document.createElement("br");

var game;

var player1Box = document.getElementById("player1");
var player2Box = document.getElementById("player2");
var scoreArea = document.getElementById("scoreArea");
var startButton = document.getElementById("startButton");
var rollButton = document.getElementById("rollButton");
rollButton.disabled = true;
var endTurnButton = document.getElementById("endTurnButton");
endTurnButton.disabled = true;

// functionality for start button
startButton.addEventListener("click", function () {
  // grab player names from input boxes
  // (we'll need to change this for more players)
  var player1 = player1Box.value;
  var player2 = player2Box.value;
  if (!player1 || !player2) {
    // formal code
    //alert("Please enter a name for both players");
    // quick debug code
    game = new Game("Player 1", "Player 2");
    scoreArea.innerText = game.report();
    rollButton.disabled = false;
    endTurnButton.disabled = false;
  } else {
    // create new game
    game = new Game(player1, player2);
    scoreArea.innerText = game.report();
    rollButton.disabled = false;
    endTurnButton.disabled = false;
  }
});

rollButton.addEventListener("click", function () {
  // grab 3 dice from zombieDice
  game.dice.pickUp();
  // make hand (list(hand) of lists(dice))
  var hand = game.dice.hand;

  game.diceDisplay = [];
  // report dice grabbed
  var report = document.createElement("div");
  for (var i = 0; i < hand.length; i++) {
    // roll and grab color and face of current dice
    var color = game.dice.getColor(hand[i]);
    var face = game.dice.getFace(hand[i]);
    if (face == "Tracks") {
      game.dice.currentRoll.push(color);
    }
    report.appendChild(game.dice.getDice(color, face));

    // add brain to brains and blast to blasts
    if (face === "Brain") {
      game.brains++;
      game.getBrain(color);
    } else if (face === "Shotgun") {
      game.shotguns++;
      game.getBlast(color, face);
    }

    // disable roll after shotgun >= 3
    if (game.shotguns >= 3) {
      rollButton.disabled = true;
    }

    // check for winner
    if (game.checkWinner() !== "") {
      rollButton.disabled = true;
      endTurnButton.disabled = true;
      report += game.checkWinner() + " wins!";
    }
  }

  var brainDis = document.getElementById("brainTable");
  var handDis = document.getElementById("handTable");
  var blastDis = document.getElementById("blastTable");
  var diceDis = document.getElementById("rollTable");
  var tableDiceDisplay = document.getElementById("tableDiceDisplay");
  var reportBlast = document.createElement("div");

  // clears the divs
  brainDis.replaceChildren();
  handDis.replaceChildren();
  blastDis.replaceChildren();
  diceDis.replaceChildren();
  tableDiceDisplay.replaceChildren();

  // Displays the rolled blasts
  for (var i = 0; i < game.currentBlast.length; i++) {
    reportBlast.appendChild(game.currentBlast[i]);
  }
  blastDis.appendChild(reportBlast);
  scoreArea.innerText = game.report();
  // Displays the current rolled dice
  handDis.appendChild(report);
  // Displays dice in the cup
  for (var i = 0; i < game.dice.tableDice.length; i++) {
    colorDis = game.dice.getColor(game.dice.tableDice[i]);
    game.displayTableDice(colorDis);
  }
  for (var i = 0; i < game.diceDisplay.length; i++) {
    tableDiceDisplay.appendChild(game.diceDisplay[i]);
  }
  // Displays the current brains
  for (var i = 0; i < game.currentBrain.length; i++) {
    brainDis.appendChild(game.currentBrain[i]);
  }
});

endTurnButton.addEventListener("click", function () {
  // enable roll button
  rollButton.disabled = false;
  // ends turn
  game.endTurn();
  // check for winner and report
  var report = "";
  if (game.checkWinner() !== "") {
    rollButton.disabled = true;
    endTurnButton.disabled = true;
    report += game.checkWinner() + " wins!";
  }
  scoreArea.innerText = game.report() + "\n" + report;
});
