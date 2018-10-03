// GLOBAL VARIABLES AND GAME COUNTERS
// ===================================================================================
$(document).ready(function() {
// Object of boxers and all their properties
var boxers = {
    'Mike Tyson': {
    name: 'Mike Tyson',
    health: 180,
    punch: 7,
    counterPunch: 25,
    imgUrl: 'assets/images/mike-tyson.jpg'
  },
  'Muhammad Ali': {
    name: 'Muhammad Ali',
    health: 150,
    punch: 8,
    counterPunch: 20,
    imgUrl: 'assets/images/muhammad-ali.jpg'
  },
  'Joe Frazier': {
    name: 'Joe Frazier',
    health: 100,
    punch: 14,
    counterPunch: 5,
    imgUrl: 'assets/images/joe-frazier.jpg'
  },
  'George Foreman': {
    name: 'George Foreman',
    health: 120,
    punch: 8,
    counterPunch: 15,
    imgUrl: 'assets/images/george-foreman.jpg'
  }
};
// Will be populated when user selects a boxer
var currSelectedBoxer;
// Populated with all boxers the user did not select
var opponents = [];
// Will be populated when user selects opponent
var currOpponent;
// Will keep track of turns during combat. Used for calculating player damage.
var turnCounter = 1;
// Tracks number of defeated opponents.
var knockOutCount = 0;

// FUNCTIONS
// ===================================================================================
// Function to render character card to the page
function renderOne(boxer, renderArea, boxerStatus) {
    var boxerDiv = $('<div class="boxer" data-name="' + boxer.name + '">');
    var boxerName = $('<div class="boxer-name">').text(boxer.name);
    var boxerImg = $('<img alt="image" class="boxer-image">').attr('src', boxer.imgUrl);
    var boxerHealth = $('<div class="boxer-health">').text(boxer.health);
    boxerDiv.append(boxerName).append(boxerImg).append(boxerHealth);
    $(renderArea).append(boxerDiv);

    // If a boxer is an opponent or available opponent, add the correct status
    if (boxerStatus === 'opponent') {
        boxerDiv.addClass('opponent')
    }
}

// Function to render game messages
function renderMessage(message) {
    // Build message and render to page
    var gameMessageSet = $('#game-message-section');
    var newMessage = $('<div>').text(message);
    gameMessageSet.append(newMessage);

    // If we get this specific message passed in, clear the message area
    // if (message === 'clearMessage') {
    //     gameMessageSet.text('');
    // }
}

// Function to clear the game message section
function clearMessage() {
    var gameMessage = $("#game-message-section");
    gameMessage.text("");
  };

// Function to render the boxers based on what area they should render in
function renderBoxers(boxerObj, areaRender) {
    // 'boxers-section' is the div where all our boxers begin
    if (areaRender === '#boxers-section') {
        $(areaRender).empty();
        // Loop through boxers object and call renderOne function
        for (var key in boxerObj) {
            console.log(key);
            if (boxerObj.hasOwnProperty(key)) {
                console.log(boxerObj.hasOwnProperty(key));
                renderOne(boxerObj[key], areaRender, '');
            }
        }
    }

    // 'selected-boxer' is the div where our selected boxer will render
    // If true, render the selected boxer to this area
    if (areaRender === '#selected-boxer') {
        renderOne(boxerObj, areaRender, '');
    }

    // 'opponents-available' is the div where our inactive opponents will render
    // If true, render the characters to this area
    if (areaRender === '#opponents-available') {
        // Loop through opponents array and call renderOne function
        for (var i = 0; i < opponents.length; i++) {
            renderOne(boxerObj[i], areaRender, 'opponent');
        } 

        // On click for each opponent
        $(document).on('click', '.opponent', function(){
            var name = $(this).attr('data-name');
            // If there is no opponent, the clicked boxer will become the opponent
            if ($('#opponent').children().length === 0) {
                renderBoxers(name, '#opponent');
                $(this).hide();
                clearMessage();
            }
        })
    }

    // 'opponent' is the div where the opponent will render
    // If true, render the selected opponent to this area
    if (areaRender === "#opponent") {
        $(areaRender).empty();
        for (var i = 0; i < opponents.length; i++) {
            if (opponents[i].name === boxerObj) {
                renderOne(opponents[i], areaRender, 'opponent')
            }
        }
    }

    // Re-render opponent after punch
    if (areaRender === 'boxerDamage') {
        $('#opponent').empty();
        renderOne(boxerObj, '#opponent', 'opponent');
    }
    // Re-render your boxer when punched
    if (areaRender === 'opponentDamage') {
        $('#selected-boxer').empty();
        renderOne(boxerObj, '#selected-boxer', '');
    }
    // Remove defeated opponent
    if (areaRender === 'opponentDefeated') {
        $('#opponent').empty();
        var gameStateMessage = 'You have knocked out ' + boxerObj.name + ', you can choose to fight another opponent.';
        renderMessage(gameStateMessage);
    }
}

// Function to restart game
function restartGame(inputEndGame) {
    // When the restart button is clicked, reload the page
    var restart = $('<button>Restart</button>').click(function() {
        location.reload();
    });
    // Build div that will hold win/loss message
    var gameState = $('<div>').text(inputEndGame);
    // Render the button and message to the page
    $('body').append(gameState);
    $('body').append(restart);

}

// MAIN
// ===================================================================================
// Render all boxers to the page when the game starts
renderBoxers(boxers, '#boxers-section');

// On click event for selecting our boxer
$(document).on('click', '.boxer', function() {
    // Saving the clicked boxers name
    var name = $(this).attr('data-name');
    console.log(name);
    // If a boxer has not been chosen...
    if (!currSelectedBoxer) {
        // Populate currSelectedBoxer with the selected boxer
        currSelectedBoxer = boxers[name];
        // We then loop through the remaining boxers and push them to the opponents div
        for (var key in boxers) {
            if (key != name) {
                opponents.push(boxers[key]);
            }
        }
        console.log(opponents);
        $('#boxers-section').hide();
        renderOne(currSelectedBoxer, '#selected-boxer');
        renderBoxers(opponents, '#opponents-available');
    }
})

// Creates an on click event for each opponent.
$("#opponents-available").on("click", ".boxer", function() {
    // Saving the opponent's name.
    var name = $(this).attr("data-name");

    // If there is no defender, the clicked enemy will become the defender.
    if ($("#opponent").children().length === 0) {
      currOpponent = boxers[name];
      renderOne(currOpponent, "#opponent");

      // remove element as it will now be a new defender
      $(this).remove();
      clearMessage();
    }
  });

// When you click the punch button, run this game logic
$('#punch-button').on('click', function() {
    if($('#opponent').children().length !== 0) {
        // Creates messages for our punch and opponents counter punch
        var punchMessage = 'You punched ' + currOpponent.name + ' for ' + (currSelectedBoxer.punch * turnCounter) + ' damage.';
        console.log(punchMessage);
        var counterPunchMessage = currOpponent.name + ' punched you back for ' + currOpponent.counterPunch + ' damage.';
        console.log(counterPunchMessage);
        clearMessage();

        // Reduce opponents health by your punch value
        currOpponent.health -= (currSelectedBoxer.punch * turnCounter);
    
        // If opponent still has health...
        if (currOpponent.health > 0) {
            console.log(true);
            // Render opponents updated boxer card
            renderBoxers(currOpponent, 'boxerDamage')
            // Render the combat messages
            renderMessage(punchMessage);
            renderMessage(counterPunchMessage);
            // Reduce your health by opponent's punch value
            currSelectedBoxer.health -= currOpponent.counterPunch;
            // Render your boxers updated boxer card
            renderBoxers(currSelectedBoxer, 'opponentDamage');
            // If you have less than zero health, you lose the game
            // Recall the restartGame function to allow user to restart
            if (currSelectedBoxer.health <= 0) {
                clearMessage();
                restartGame('You have been knocked out... Game over!');
                $('#punch-button').unbind('click');
            }
        }
    
    // If opponent has less than zero health, they are knocked out
    else  {
        renderBoxers(currOpponent, 'opponentDefeated');
        // Increment knockOutCount
        knockOutCount++;
        // If you have knocked out all your opponents you win
        if (knockOutCount >= 3) {
            clearMessage();
            restartGame('You are the new world champion!!!');
        }
    }
    turnCounter++;
    }
});
})