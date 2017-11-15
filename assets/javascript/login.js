// function myFunction() {
//     var x = document.getElementById("hideMe");
//     if (x.style.display === "none") {
//         x.style.display = "block";
//     } else {
//         x.style.display = "none";
//     }
// }
$(document).ready(function(){
    $("#directions").click(function(){
        $("#hideMe").toggle();
    });
});
 


