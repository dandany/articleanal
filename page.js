$(document).ready(

  function () {
    var now = new Date();
 //   var _this=this;
    $("#c").text(now.toLocaleTimeString());
    $("#c").css("background-color","#eeb");
    setTimeout(arguments.callee,1000);

    });


//  function displayTime() {
//    var elt = document.getElementById("c");
//    var now = new Date();
//    elt.innerHTML = now.toLocaleTimeString();
//    setTimeout(displayTime,1000);
//  }
//  window.onload = displayTime();
