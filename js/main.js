var d, cards, suits, ranks, discardPile, randomDraw, pickCardGuessLot, buttonNumber, gameplayed, winArray;
gameplayed = false;
winArray = [];
suits = ["♥", "♣", "♠", "♦"];
ranks = [2,3,4,5,6,7,8,9,10, "J", "Q", "K", "A"];

function Deck() {
  this.cards = [];
  this.discardPile = [];
  this.pickCardGuessLot = [];
  this.count = function() {
    return this.cards.length;
  }
  this.init = function() {
    for (s = 0; s < 4; s++) {
      for (r = 0; r < 13; r++) {
        this.cards.push(new Card(suits[s], ranks[r]))
      }   
    }
  }
  this.drawFromDeck = function() {
    this.randomDraw = this.cards[randomIndex(this.cards.length)];
    return this.randomDraw
  }
  this.discard = function(toDiscard) {
    for (var i = 0; i < this.cards.length; i++) {
      if ((toDiscard.suit == this.cards[i].suit)
        && (toDiscard.rank == this.cards[i].rank)) {
        this.discardPile.push(this.cards[i]);
        this.cards.splice(i, 1);
      }
    }
  }
  this.shuffle = function() {
    var m = this.cards.length, rand, t;
    while (m > 0) {
      rand = Math.floor(Math.random() * m--);
      t = this.cards[m];
      this.cards[m] = this.cards[rand];
      this.cards[rand] = t;
    }
  }
  this.reshuffle = function() {
    for (var i =this.discardPile.length; i > 0; i--) {
      this.cards.push(this.discardPile[i]);
      this.discardPile.splice(i, 1);
    }
    this.cards.sort();
    //return ("Reshuffled")
  }
}

function Card(suit, rank) {
  this.suit = suit;
  this.rank = rank;
  this.show = function() {
   return (this.rank + this.suit);
  }
}

function randomIndex(length) {
  return Math.floor(Math.random() * (length));
}


pickCardGame = function() {
  var wrongCard, guessPosition, userGuess, guessPoolNum;
  guessPoolNum = 5;
  guessCount = 1;

  d = new Deck();
  d.init();
  if (gameplayed == true) {
    $(".CardText").text("");
    $(".Card").addClass("CardBack");
    $(".Card").removeClass("Card");
    $("#GuessC").removeClass("CardBack");
  }
    d.drawFromDeck();
    $("#GuessC").addClass("Card").hide();
    $("#GCText").text(d.randomDraw.show());
    displayColor(d.randomDraw, "#GCText");
    $("#deck").fadeTo(100, 0.5).fadeTo(100, 1);
    $("#GuessC").delay(300).fadeIn(200);

    d.discard(d.randomDraw);
  
  //Make a pool of cards to guess from and insert randomDraw card to match
  for (var i = 0; i < (guessPoolNum - 1); i++) {
    d.wrongCard = d.cards[randomIndex(d.cards.length)];
    d.pickCardGuessLot.push(d.wrongCard);
    d.discard(d.wrongCard);
  }
  d.guessPosition = randomIndex(d.pickCardGuessLot.length)
  d.pickCardGuessLot.splice(d.guessPosition, 0, d.randomDraw);

  for (var i = 0; i < (d.pickCardGuessLot.length); i++) {
    $("#C" + i).addClass("CardBack").hide().delay(300).fadeIn(200);
  }
  $("#Message").text("Pick the matching card!")
}

parseClick = function(buttonNumber) {
  if ((d.randomDraw.suit == d.pickCardGuessLot[buttonNumber].suit) &&
      (d.randomDraw.rank == d.pickCardGuessLot[buttonNumber].rank)) {
      $("#C"+ buttonNumber).removeClass("CardBack");
      $("#C"+ buttonNumber).addClass("Card");
      $("#C"+buttonNumber+"p").text(d.pickCardGuessLot[buttonNumber].show());
      displayColor(d.pickCardGuessLot[buttonNumber], "#C"+buttonNumber+"p");
    $("#Message").text( "You win! Your card is up right! Play Again?");
    gameplayed = true;

    winArray.push(d.randomDraw);
    var currentWinIndex = (winArray.length - 1);
    $("#ResultsContainer").append('<div class="LittleCard" id="resultsCard' + 
      currentWinIndex + '""><p class = "LittleCardText" id = "winID' + 
      currentWinIndex + '">' + winArray[currentWinIndex].show() + '</p></div>');
    displayColor((winArray[currentWinIndex]), "#winID" + currentWinIndex);
    $("#resultsCard" + currentWinIndex).hide();
    $("#resultsCard" + currentWinIndex).fadeIn(200);
    $("#title").animate({color: "yellow"}, 400).delay(400).animate({color: "white"}, 400);
    d.pickCardGuessLot = [];

  }
  else {
    $("#C"+ buttonNumber).removeClass("CardBack").addClass("Card");
    $("#C"+buttonNumber+"p").text(d.pickCardGuessLot[buttonNumber].show());
    displayColor(d.pickCardGuessLot[buttonNumber], "#C"+buttonNumber+"p");
    $("#Message").text( "Wrong Card! Guess again.");
  }
}

displayColor = function (Card, ID) {
  if ((Card.rank == 10) && (ID.indexOf("C") != -1)) {
    $(ID).css("text-shadow", "38px 80px 0px")
  }
  if ((Card.rank == 10) && (ID.indexOf("win") != -1)) {
    $(ID).css("text-shadow", "6px 28px 0px")
  } 
  if ((Card.suit == "♥") || (Card.suit == "♦")) {
    $(ID).css("color", "red")
  }
  else if ((Card.suit == "♠") || (Card.suit == "♣")) {
    $(ID).css("color", "black")
  }
}
