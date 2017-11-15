
$(document).ready(function() {
// run the timer

var number = 60; 
var intervalId;
function run() {
    intervalId = setInterval(decrement, 1000);
    $(".submitbutton").show();
    $('#update-score').hide();
};

// set the countdown
function decrement() {
    number--;
    
    $("#timer").text(number);

    if (number === 0) {
        stop();
        
    }
};

// when the countdown timer hits 0, it will stop
function stop() {
    clearInterval(intervalId);
    number = 60;
    $(".submitbutton").hide();
    $('#update-score').show();
}

// start button
$(".startButton").on("click", run);

// stop button
$(".restartButton").on("click", run);

});

// POSSIBLE CODE TO CORRECT TIMER///////////
   // $(".startButton").on("click", function(){

// if(started === false){

//     run();

//     started = true;
// }
// // stop button
// // $(".restartButton").on("click", run);

// });





 // THIS CODE MUST BE MOVED TO THE GAME LOGIC JS FILE
// +++++++++++++++++++++++++++++++++
// pulsate function begins
// function scorePulse(){

//     $("#teamScore").effect("pulsate", {times:2}, 1000 );

// }   
//  // function for pulsate ends here.


// var photoURL =  user.providerData[0].photoURL
// // function for populating the sun here
// function profile(){

// $("#profileOne").attr("src", photoURL);
// $("#profileTwo").attr("src", photoURL);

// }
// // +++++++++++++++++++++++++++++++++
            
 



