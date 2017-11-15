var number = 60;
var intervalId;
var clicked = true;

$("#picture").on("click", function(){

if(clicked === false){

run()	

clicked = true;
}

});

function run(){

intervalId = setInterval(decrement, 1000);

}

function decrement(){

number--;

$("#timer").html("<p>"+ number + "</p>");

if (number === 0){

stop();

alert("Time Up!");

}

}

function stop(){

clearInterval(intervalId);

}

