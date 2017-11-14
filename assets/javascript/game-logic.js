// variable declaration

// word bank -- randomly select search term from here
var searchTerms = ['puppy','cats','pink flowers','trees and sun'];
// add an indicator to determine if a term was already searched/displayed to the users -- refernce trivia game structure
	// prevents re-display of images
	// true/false asked property
	// create a counter -- if it matches the amount of images we want to show, stop the game


$(document).ready(function () {

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
	    return {name: displayName, points: 0, guesses: ['PLACEHOLDER']};
	  } else {
	    console.log('User' + displayName + 'already exists.');
	    return; // Abort the transaction.
	  }
	}, function(error, committed, snapshot) {
	  if (error) {
	    console.log('Transaction failed abnormally!', error);
	  } else if (!committed) {
	    console.log('We aborted the transaction (because' + UID + 'already exists).');
	  } else {
	    console.log('User' + displayName + 'added!');
	  }
	  console.log(displayName + '\'s data: ,' + snapshot.val());
	});

	// add to game-room if there's < 2 players
	
	/*if (currentPlayers < 2) {
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
		alert('sorry, there\'s no more room.')
	}*/


  } else {
    // No user is signed in.
    console.log('REEEEE');
  }

});

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
var guesses = ['PLACEHOLDER'];

//create random number generator
	// to select random word from our word bank
	// to select random hit from our ajax call
function generateRandomNum (min, max) {
	return Math.floor(Math.random() * max) + min;
}

// calculate team points
function calculateTeamPoints () {
	// if player 1 and player 2 share a similar word in their guesses, grant one point to each
		// calculate difference between the array lengths
		// whichever one has less elements, add placeholders to have same lengths
		// iterate over one array, check to see if a word exists in another
			// if there's a match, push to new array
			// count length of new array and add points to each player
	if (p1guesses.length > p2guesses.length) {
		// placeholder is uppercase to dinstinguish between user guesses
		p2guesses.push('EXTRA');
	}
	else if (p1guesses.length < p2guesses.length) {
		p1guesses.push('EXTRA');
	}

	for (var i=0; i < p2guesses.length; i++) {
		if (p1guesses.includes(p2guesses[i])) {
			p1p2Matches.push(p2guesses[i]);
		}
	}

	teamPoints = p1p2Matches.length;

	p1points += teamPoints;
	p2points += teamPoints;
	
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

	// adds user guess to guesses array if it doesn't already exist
	if (!guesses.includes(guess)) {
		guesses.push(guess);
	}
	else {
		// alert user that they guessed that word already
		alert('You already guessed ' + guess);
	}

	console.log(guesses);

	// clear input field
	$('#userInput').val('');
})
// add firebase obj listener for user data -- array changes
// whenever a user's array is updated, update changes here

database.ref('users/' + UID + '/guesses').on('value', function (snapshot) {
	console.log('HELLO I WORKED');
	console.log(snapshot);
	console.log(snapshot.val());
	console.log(UID);
	/*userData.guesses = guesses;*/
	/*console.log(userData.guesses);*/
})

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

		// if guesses includes one of the actual tags associated with the image (from API), grant 2 points.
		// iterate through tags and check to see if they exist in the guesses array
			// refactor this code later for multiplayer feature
		/*function addBonusPoints () {

			for (var i=0; i < tags.length; i++) {
				// if player one guessed a correct tag, award 2 points
				if (p1guesses.includes(tags[i])) {
					p1points += 2;
				}
				// if player one guessed a correct tag, award 2 points
				if (p2guesses.includes(tags[i])) {
					p2points += 2;
				}
			}
		}*/

		// displays total points accumulated by user
		/*function showFinalScore () {
			calculateTeamPoints();
			addBonusPoints();
		}*/

	});

}

function updateFirebaseUserData () {
	// grab user data from returningUsers folder
		// get points value
		// increment points accordingly
}

function startGame () {
	// start game
	// set timers
}

function endGame () {
	// show more info about photo
	// stop timers
	// empty array of guesses
	// ask if players want to play again
}




















})