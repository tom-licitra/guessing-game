
// generates the winning number between 1 and 100
function generateWinningNumber(){
    return  Math.floor((Math.random()*100)+1); // add one and rounddown
}


// shuffle takes in an array and returns a shuffled array
function shuffle(array) {
    let m = array.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
  
    return array;
  }


// constructor function to create new game instance
function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.tooHighGuesses = []; // additional properties for gameplay UX
    this.tooLowGuesses = []; // additional property for gameplay UX
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(num){

    if(num < 1 || num > 100){
        throw "Love the creativity... but your guess needs to be between 1 and 100!"
    }
    else if(typeof num != "number"){
        throw "Sorry, I only speak number. Please enter a number between 1 and 100."
    }
    else{
        this.playersGuess = Number(num); // sets playersGuess equal to num
        return this.checkGuess(); // calls checkGuess 
    }
}

Game.prototype.checkGuess = function(){

    if(this.pastGuesses.indexOf(this.playersGuess) >= 0){
        return "You have already guessed that number."
    }
    
    this.pastGuesses.push(this.playersGuess);
    
    if(this.playersGuess === this.winningNumber){
        return "You Win!";
    };

    if(this.isLower()){
        this.tooLowGuesses.push(this.playersGuess);
        this.tooLowGuesses.sort(function(a,b){return a-b});
    }
    else{
        this.tooHighGuesses.push(this.playersGuess);
        this.tooHighGuesses.sort(function(a,b){return a-b});
    };

    if(this.pastGuesses.length >= 10){
        // need a game reset function
        return "Game over.";
    }
    else{
        if(this.difference() < 3){
            return "So hot right now!"
        }
        else if(this.difference() < 10){
            return "Heating up!"
        }
        else if(this.difference() < 25){
            return "Lukewarm."
        }
        else if(this.difference() < 50){
            return "Brrrr."
        }
        else{
            return "Ice cold."
        }
    }
}

// provideHint returns an array of 3 numbers, one of which is the winningNumber
Game.prototype.provideHint = function(){

    let hintArray = [this.winningNumber];
    hintArray.push(generateWinningNumber());
    hintArray.push(generateWinningNumber());
    return shuffle(hintArray);
}

// creates a new game instance
function newGame(){
    return new Game();
}

// on page load
$(document).ready(function(){

    let currGame = new Game();
    let num = 0;
    let hints = currGame.provideHint();

    // alert(currGame.winningNumber);

    let submitGuess = function(){
        $('#low-response').text('');
        $('#high-response').text('');

        num = +$('#player-input').val();
        $('#submission-return').text(currGame.playersGuessSubmission(num));

        $('#player-input').val('');
        $('#player-input').focus();
        refreshPrevGuesses();
        $('#guess-count').text(currGame.pastGuesses.length);

        if(currGame.difference() === 0){
            if($('#record-score').text() === '' || Number($('#record-score').text())>currGame.pastGuesses.length){
                $('#record-score').text(currGame.pastGuesses.length);
            }
            $('#player-input').addClass("winner");
            $('#player-input').val(num);
            $('#guess-button').prop("disabled",true);
            $('#player-input').prop("disabled",true);
            $('#get-hint').prop("disabled",true);

        }
        else if(currGame.isLower() > 0){
            $('#low-response').text("Too low!");
        }
        else{
            $('#high-response').text("Too high!");
        }

    }

    let refreshPrevGuesses = function(){
        $('.too-low .guess').last().text(currGame.tooLowGuesses[currGame.tooLowGuesses.length-1]);
        $('.too-low .guess').last().prev().text(currGame.tooLowGuesses[currGame.tooLowGuesses.length-2]);
        $('.too-low .guess').first().next().next().text(currGame.tooLowGuesses[currGame.tooLowGuesses.length-3]);
        $('.too-low .guess').first().next().text(currGame.tooLowGuesses[currGame.tooLowGuesses.length-4]);
        $('.too-low .guess').first().text(currGame.tooLowGuesses[currGame.tooLowGuesses.length-5]);

        $('.too-high .guess').first().text(currGame.tooHighGuesses[0]);
        $('.too-high .guess').first().next().text(currGame.tooHighGuesses[1]);
        $('.too-high .guess').last().prev().prev().text(currGame.tooHighGuesses[2]);
        $('.too-high .guess').last().prev().text(currGame.tooHighGuesses[3]);
        $('.too-high .guess').last().text(currGame.tooHighGuesses[4]);

    }

    let resetView = function(){
        $('.too-low .guess').text('');
        $('.too-high .guess').text('');
        $('#low-response').text('');
        $('#high-response').text('');
        $('#guess-count').text(0);
        $('#submission-return').text('Take your best guess!');
        $('#player-input').removeClass("winner");
        $('#player-input').val('');
        $('#player-input').focus();
        $('#guess-button').prop("disabled",false);
        $('#player-input').prop("disabled",false);
        $('#get-hint').prop("disabled",false);
    }

    $('#guess-button').on('click', function(){
        submitGuess();
    })

    $('#player-input').keypress(function(e){
        if(e.which === 13){
            submitGuess();
        }
    })

    $('#new-game').on('click',function(){
        resetView();
        currGame = newGame();
        hints = currGame.provideHint();
        $('#player-input').focus();

    })

    $('#get-hint').on('click',function(){
        alert("Shhh... one of these is the correct number... " + hints.join(", "));
    })

    $('#reset-scores').on('click', function(){
        $('#record-score').text('');
    })




})


