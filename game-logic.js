// variable declaration

// word bank -- randomly select search term from here
var searchTerms = ['puppy','cats','pink flowers','trees and sun'];
// add an indicator to determine if a term was already searched/displayed to the users -- refernce trivia game structure
	// prevents re-display of images
	// true/false asked property
	// create a counter -- if it matches the amount of images we want to show, stop the game


$(document).ready(function () {
	// points accumulated by user -- these will be added to the existing value in Firebase
	var p1points = 0; //Not using this
	var p2points = 0; //Not using this

	var teamPoints = 0;
	var guess; // Defined later
	// stores user guesses to be referenced to later and compared
 	var guesses = [];

//create random number generator
	// to select random word from our word bank
	// to select random hit from our ajax call
	function generateRandomNum (min, max) {
		return Math.floor(Math.random() * max) + min;
	};

// capture user input and store in respective array
// base the input field on the currentuser (Google Auth)
	$('#submit').click(function (event) {
		// prevent page reload
		event.preventDefault();
		// capture user input
		// convert to lowercase
		guess = $('#userInput').val().toLowerCase();

		//Pull guesses folder, convert into array, check if that guess is in the array.
		// if guess is not in array... aka return is -1,
		//         console.log("no match!") -- alert user with something
		//		   push the word into the firebase folder
		//		else
		//          teamPoints++
		//			console.log("You got a point!") - alert user with something
		//
		// when timer == 0. EMPTY guesses folder of guesses.

		//TODO: PUSH GUESS TO FIREBASE
		guesses.push(guess);

		for(var i=0; i<guesses.length; i++) {
		// adds user guess to guesses array if it doesn't already exist
			if (guesses[i] == -1) {
				console.log("No match!");
				//TODO: ADD SOME UI FEATURE TO INDICATE NO MATCH
				//TODO: Add that word to the array.
				//TODO: Update to firebase.
			}
			else {
				teamPoints++
				//TODO: UPDATE FireBase
			}
		};

		// clear input field
		$('#userInput').val('');
	});

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

		// displays total points accumulated by user
		function showFinalScore () {
			calculateTeamPoints();
			addBonusPoints();
		}

	});

}

function updateFirebaseUserData () {
	// update user data by accessing child node's points property
}

// ============================================================================

var database = firebase.database();

// Google Auth data capture -- NEED TO FIGURE THIS OUT
var user = firebase.auth().currentUser;

var player1Exists = false;
var player2Exists = false;

var currentPlayers = null;

// players in game will be stored here
var playersRef = database.ref('/players');

// upon connecting and going through Google Auth, store UID, name, and points to returningPlayersRef
// folder in Firebase that will hold Google Auth data
var returningPlayersRef = database.ref('/returning');

// testing for access to user data
/*returningPlayersRef.on('value', function (snapshot) {
	console.log(snapshot.val());
	console.log(snapshot.val().diana);
	console.log(snapshot.val().diana.ID);
	console.log(snapshot.val().diana.points);
})*/

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(user);
    console.log(user.uid);
  } else {
    // No user is signed in.
    console.log('REEEEE');
  }
});

// when the user logs in, check if they've already played before
function checkReturningUser () {
	var name;
	var ID;
	var points;

	// if user is a returning user, set data specific to user and add child to playersRef folder
		// call checkNumPlayers
	// else, create new child node in the returning folder
		// call checkNumPlayers

	// this code snippet creates new child in the returning folder in Firebase
	// each child name will be users' UID that will hold user name and points

	/*	returningPlayersRef.child(INSERT UID HERE).set({
			name: INSERT NAME HERE,
			points: INSERT POINTS HERE
		})*/
}

	/*returningPlayersRef.on('child_added', function (snapshot) {

		console.log(snapshot.val());
	})*/

playersRef.on('value', function (snapshot) {

	currentPlayers = snapshot.numChildren();
	console.log('current players: ' + currentPlayers)

})

// check the number of current players
// assumes that the user logged in via Google Auth already
// takes in their data as arguments
function checkNumPlayers (name, UID, points) {

	var player1Ref;
	var player2Ref;

// if less than two players, check if player1 exists
	// if player is a returning player -- look for their stored UID, displayname, and points
	// reassign points to their accumulated points
	// else, default points to 0
	if (currentPlayers < 2) {

    if (player1Exists) {
      playerNum = 2;
    // sets second player to player2
    // player2Ref = playersRef.child('player2');
    /*  player2Ref.set({
		name: INSERT NAME HERE,
		ID: INSERT UID HERE,
		points: INSERT POINTS HERE
	})*/
	player2Exists = true;
	// call startGame
    }
    else {
      playerNum = 1;
    // sets first player to player1
    // player1Ref = playersRef.child('player1');
      /*player1Ref.set({
		name: INSERT NAME HERE,
		ID: INSERT UID HERE,
		points: INSERT POINTS HERE
	})*/
	player1Exists = true;

    }

// create a childnode with player number
// set the name to the UID, and their points

    // On disconnect remove this user's player object
    player1Ref.onDisconnect().remove();
    player2Ref.onDisconnect().remove();
}

// if more than 2 players, prevent more players from connecting
    else {
    	alert("Sorry, Game Full! Try Again Later!");
  }
}

function startGame () {
	// start game
	// set timers
}

function endGame () {
	// show more info about photo
	// stop timers
	// ask if players want to play again
}

// =============================================================================










});
