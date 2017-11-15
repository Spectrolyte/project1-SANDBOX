// variable declaration

// word bank -- randomly select search term from here
var searchTerms = ['puppy','cats','pink flowers','trees and sun'];
// add an indicator to determine if a term was already searched/displayed to the users -- refernce trivia game structure
	// prevents re-display of images
	// true/false asked property
	// create a counter -- if it matches the amount of images we want to show, stop the game


$(document).ready(function() {

// ============================================================================

var database = firebase.database();

// Google Auth data capture -- NEED TO FIGURE THIS OUT
var user = firebase.auth().currentUser;
var UID;
var displayName;
var points;

var currentPlayers = null;

var usersRef = database.ref('/users/' + UID);
var currentPlayersRef = database.ref('/currentPlayers/' + UID);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  	UID = user.uid;
	displayName = user.displayName;

    console.log(user);
    console.log(UID);
    console.log(displayName);
    console.log('signed in');
    console.log('=================================');

    // add to users object
    usersRef = database.ref('/users/' + UID);

	usersRef.transaction(function(currentData) {
	  if (currentData === null) {
	    return {name: displayName, points: 0};
	  } else {
	    console.log('User ' + displayName + ' already exists.');
	    return; // Abort the transaction.
	  }
	}, function(error, committed, snapshot) {
	  if (error) {
	    console.log('Transaction failed abnormally!', error);
	  } else if (!committed) {
	    console.log('We aborted the transaction (because ' + UID + ' already exists).');
	  } else {
	    console.log('User ' + displayName + ' added!');
	  }
	  console.log(displayName + '\'s data: ,' + snapshot.val());
	});

	/*updateGuesses();*/

	// add to game-room if there's < 2 players
/*	
	if (currentPlayers < 2) {
		currentPlayersRef.transaction(function(currentData) {
		  if (currentData === null) {
		    return {name: displayName, points: 0, guesses: []};
		  } else {
		    console.log('User' + displayName + 'already added to game-room.');
		    return; // Abort the transaction.
		  }
		}, function(error, committed, snapshot) {
		  if (error) {
		    console.log('Transaction failed abnormally!', error);
		  } else if (!committed) {
		    console.log('We aborted the transaction (because' + UID + 'already added to game-room).');
		  } else {
		    console.log('User' + displayName + 'added!');
		  }
		  console.log(displayName + '\'s data: ,' + snapshot.val());
		});
	}
	else {
		alert('sorry, there\'s no more room.');
	}*/


  } else {
    // No user is signed in.
    console.log('REEEEE');
  }

});


/*firebase.auth().signOut().then(function() {
        // sign-out successful
    }).catch(function(error) {
        // an error happened
    });

    signOut();

    $(".logoutButton").on("click", signOut);*/

currentPlayersRef.on('value', function (snapshot) {

	currentPlayers = snapshot.numChildren();

	// when player disconnects, remove from folder
	
	// when player disconnects, end game -- no points added

	console.log('current players: ' + currentPlayers)

})


// =============================================================================


// points accumulated by user -- these will be added to the existing value in Firebase
var teamPoints = 0;

// stores user guesses to be referenced to later and compared
var guesses = [];

//create random number generator
	// to select random word from our word bank
	// to select random hit from our ajax call
function generateRandomNum (min, max) {
	return Math.floor(Math.random() * max) + min;
}

// need to access users based on game room
// grab child node keys to access their arrays and use in calculateTeamPoints to set to local variable for comparison

var playerOneGuesses;
var playerTwoGuesses;

function getPlayerGuesses () {
	// get children keys when they're added to the current players folder
	database.ref('/currentPlayers').on('child_added', function (snapshot) {

	})
}

// capture user input and store in guesses array
// need to reference respective array according to firebase storage /users/UID.guesses and update
// need to add listener and use snapshot.val() to access the UID.guesses prop
$('#submit-btn').click(function (event) {
	// prevent page reload
	event.preventDefault();

	// capture user input
	// convert to lowercase
	var guess = $('#userInput').val().toLowerCase();
	console.log(guess);

	guesses.push(guess);

	// clear input field
	$('#userInput').val('');

	// update firebase array
	updateGuesses();
	evalGuesses();
	calculateTeamPoints();
})

// whenever this function is run, update the user's firebase array with the local array
function updateGuesses () {
	database.ref('/users/guesses').set(guesses)

	database.ref('/users/guesses').on('value', function (snapshot) {
		var guessesRef = snapshot.val();
		console.log('firebase array: ' + guessesRef);
	})

	console.log('this is the local array: ' + guesses)
}

var guessData = database.ref("users/guesses");

// this obj will hold the users' guesses as keys and the amount of times they appear in the guesses array as their values
// (i.e. ['hello', 'hello', 'world'] => {hello: 2, world: 1})
// updated each time evalGuesses is called
var wordCount = {};

// helper function that counts the number of element instances within an array given an array and element to search for
function arrayCompare(arr, what) {
        var count = 0;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === what) {
                count++;
            }
        }
        return count;
    }


function evalGuesses () {
    guessData.once("value", function (snapshot) {
        var currentGuesses = snapshot.val();

        console.log(currentGuesses);

        for (var i=0; i < currentGuesses.length; i++) {
        	// if the word does not exist in the wordCount obj, add the key-val pair to it
        	var word = currentGuesses[i];

        	if (!wordCount[word]) {
        		wordCount[word] = {}
	        	wordCount[word].count = arrayCompare(currentGuesses, word);
	        }
        }

        console.log('before calc points: ' + wordCount);

        // if the word the user typed in is in the wordCount obj and has value greater than or equal to 2,
        // perform flashing animation for text box that there's a match

        // else, perform animation for text box that there's no match

    });
}

// add some indicator to the word prop to check if users got point for it already
function calculateTeamPoints () {
	// iterates through whole obj
    for (var key in wordCount) {
    	// if the key's value is greater than or equal to 2, increment teampoints by 1
    	if (!wordCount[key].checked && wordCount[key].count >= 2) {
    		wordCount[key].checked = true;
    		teamPoints++;
    	}
    }

    console.log('after calc points: ' + wordCount)
    console.log(teamPoints);
}

// run this at the end of the game round
function showImageInfo () {

}

// change click event to function on setTimeout -- each round lasts 30 seconds
// run this function, then setTimeout on point calculation for 30 seconds
function showImage () {

	// select random search term from word bank
	var selectedTerm = searchTerms[generateRandomNum(0, searchTerms.length)];

	// Pixabay API access
	var key = '6982377-68fe5b4423fc7e3f952f46c15';
	var queryUrl = 'https://pixabay.com/api/?key=' + key + '&q=' + selectedTerm + '&image_type=photo&pretty=true';

	$.ajax({
		url: queryUrl,
		method: 'GET'
	}).done(function (response) {
		// results is a list of the hits we received after running a search on selected search term
		var results = response.hits
		// chosen is the randomly selected element for this ajax call
		var chosen = results[generateRandomNum(0, results.length)];
		// preview image -- need to enlarge image before displaying to users
		// look into setting image size
		var image = $('<img>').attr('src', chosen.previewURL);
		// string of key words -- if users guess any of these words, score bonus points
		var tags = chosen.tags.split(', ');
		// photographer of chosen image
		var photographer = chosen.user;
		// link to photographer's profile page
		var profileLink = $('<a>').attr('target', '_blank')
								  .attr('href', 'https://pixabay.com/en/users/' + photographer)
								  .text('See more work from this photographer');
		// link to presented photo
		var imageLink = $('<a>').attr('target', '_blank')
								.attr('href', chosen.pageURL)
								.text('More about this image');

		// appending selected image and photographer link to body -- testing
		$('body').append(image).append(profileLink).append(imageLink);

	});

}








})