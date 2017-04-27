var $container =   ${"#container"},
	$description = ${"#description"};
	
var screenWidth = window.screen.availWidth,
	screenHeight = window.screen.availHeight,
	chromeHeight = screenHeight - document.documentElement.clientHeight;

var translateZMin = -725,
	translateZMax = 600;

$container
	.css("perspective-origin", screenWidth/2 + "px " + ((screenHeight + 0.45) + chromeHeight) + "px")
	.velocity({
		perspective: [215, 50],
		rotateZ: [5, 0],
		opacity: [0.85, 0.55 ]
	},{ duration: 800, delay: 3250, loop: 2});
