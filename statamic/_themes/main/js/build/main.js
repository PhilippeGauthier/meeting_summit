
// Video Code

var vid = document.getElementById("bgvid");
var pauseButton = document.getElementById("vidpause");
var controls = document.getElementById("controls");
function vidFade() {
vid.classList.add("stopfade");
}
vid.addEventListener('ended', function() {
// only functional if "loop" is removed
vid.pause();
// to capture IE10
vidFade();
});
pauseButton.addEventListener("click", function() {
vid.classList.toggle("stopfade");
controls.classList.toggle("hide");
pauseButton.classList.toggle("mask");
if (vid.paused) {
  
vid.play();
// pauseButton.innerHTML = "Pause";
} else {
vid.pause();
  
// pauseButton.innerHTML = "Paused";
}
});




// Google Analytics Code
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-46418002-1', 'auto');
ga('send', 'pageview');


$('#contact-submit').on('click', function() {
  ga('send', 'event', { eventCategory: 'Click', eventAction: 'Email', eventLabel: 'SubmitForm'});
});

$('#sales-contact').on('click', function() {
  ga('send', 'event', { eventCategory: 'Click', eventAction: 'Email', eventLabel: 'SalesContact'});
});

$('#media-contact').on('click', function() {
  ga('send', 'event', { eventCategory: 'Click', eventAction: 'Email', eventLabel: 'PressContact'});
});




