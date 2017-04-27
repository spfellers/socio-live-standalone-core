/*****************
    	 Summary
    *****************/
var users = {
  1: new BasicUser(1, "Desmond", "Strickland", "Fishery", Date.now()),
  2: new BasicUser(2, 'Thaddeus','Galvan','Professional Training & Coaching', Date.now()),
  3: new BasicUser(3, 'Lamont','Friedman','Automotive', Date.now()),
  4: new BasicUser(4, 'Martin','Holland','Information Technology and Services', Date.now()),
  5: new BasicUser(5, 'Nancy','Carr','Information Technology and Services', Date.now()),
  6: new BasicUser(6, 'Graham','Norris',' Ceramics & Concrete', Date.now()),
  7: new BasicUser(7, 'Royce','Lester','Veterinary', Date.now()),
  8: new BasicUser(8, 'Emily','Herman','Alternative Dispute Resolution', Date.now()),
  9: new BasicUser(9, 'Odessa','Clay','Warehousing', Date.now()),
  10: new BasicUser(10, 'Enid','Castaneda','Airlines/Aviation', Date.now()),
  11: new BasicUser(11, 'Mara','Schultz','Facilities Services', Date.now()),
  12: new BasicUser(12, 'Romeo','Navarro','Information Technology and Services', Date.now()),
  13: new BasicUser(13, 'Jess','Clay','Banking', Date.now()),
  14: new BasicUser(14, 'Aimee','Guerrero','Biotechnology', Date.now()),
  15: new BasicUser(15, 'Dino','Payne','Computer Games', Date.now()),
  16: new BasicUser(16, 'Susie','Velasquez','Nanotechnology', Date.now()),
  17: new BasicUser(17, 'Velma','Walton','Restaurants', Date.now()),
  18: new BasicUser(18, 'Rosario','Cook','Professional Training & Coaching', Date.now()),
  19: new BasicUser(19, 'Maximo','Morgan','Transportation/Trucking/Railroad', Date.now()),
  20: new BasicUser(20, 'Bettye','Sandoval','Tobacco', Date.now()),
  21: new BasicUser(21, 'Eve','Malone','Judiciary', Date.now()),
  22: new BasicUser(22, 'Daryl','Carney','Real Estate', Date.now()),
  23: new BasicUser(23, 'Britney','Pennington','Recreational Facilities and Services', Date.now()),
  24: new BasicUser(24, 'Phyllis','Chung','International Affairs', Date.now()),
  25: new BasicUser(25, 'Susanne','Clark','Facilities Services', Date.now())
};
    /* Watch the codecast to learn how this demo was made: https://www.youtube.com/watch?v=MDLiVB6g2NY&hd=1 */

    /* This demo serves two purposes:
    	1) Act as Velocity's primary visual test (in addition to the unit and load tests).
		2) Demonstrate all of Velocity's features.
		3) Demonstrate the performance capabilties of the DOM; WebGL and Canvas are not used in this demo.
	*/

	/* Intended demo behavior: 
		1) A message box fades out.
		2) Dots are randomly assigned coordinates and opacities then translated and increased in opacity. This animation is then reversed.
		3) Meanwhile, the dots' container has its perspective, rotateZ, and opacity animated in a loop with a delay.
		4) Once the dot animation is complete, the message box fades back in.
	*/

	/*********************
       Device Detection
    *********************/

	var isWebkit = /Webkit/i.test(navigator.userAgent),
		isChrome = /Chrome/i.test(navigator.userAgent),
		isMobile = !!("ontouchstart" in window),
		isAndroid = /Android/i.test(navigator.userAgent),
		isIE = document.documentMode;

	/******************
    	Redirection
    ******************/

	if (isMobile && isAndroid && !isChrome) {
		alert("Although Velocity.js works on all mobile browsers, this 3D demo is for iOS devices or Android devices running Chrome only. Redirecting you to Velocity's documentation.");
		window.location = "index.html";
	}

	/***************
    	Helpers
    ***************/

	/* Randomly generate an integer between two numbers. */
	function r (min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/* Override the default easing type with something a bit more jazzy. */
	$.Velocity.defaults.easing = "easeInOutsine";

	/*******************
        Dot Creation
    *******************/

    /* Differentiate dot counts based on roughly-guestimated device and browser capabilities. */ 
	var dotsCount,
		dotsHtml = "",
		$count = $("#count"),
		$dots;

	if (window.location.hash) {
		dotsCount = window.location.hash.slice(1);
	} else {
		dotsCount = isMobile ? (isAndroid ? 40 : 60) : (isChrome ? 175 : 125);
	}
	
	console.log("userslength = "  + users.length);
	console.log("userslength = " + users[1].first);
	for (var i = 1; i < 26; i++) {
		dotsHtml += "<div class='dot'><span class='dotName'>" + users[i].first + " " + users[i].last + "</span></br>" +
		"<span class='dotName'>" + users[i].info + "</span></div>";
	}

	$dots = $(dotsHtml);

	$count.html(dotsCount);

	/*************
        Setup
    *************/

	var $container = $("#container"),
		$browserWidthNotice = $("#browserWidthNotice"),
		$welcome = $("#welcome");

	var screenWidth = window.screen.availWidth,
		screenHeight = window.screen.availHeight,
		chromeHeight = screenHeight - (document.documentElement.clientHeight || screenHeight);

	var translateZMin = -75,
		translateZMax = 40;

	var containerAnimationMap = {
			perspective: [ 215, 50 ],
			opacity: [ 0.90, 0.55 ]
		};

	/* IE10+ produce odd glitching issues when you rotateZ on a parent element subjected to 3D transforms. */
	if (!isIE) {
		containerAnimationMap.rotateZ = [ 5, 0 ];
	}

	/* Ensure the user is full-screened; this demo's translations are relative to screen width, not window width. */
	if ((document.documentElement.clientWidth / screenWidth) < 0.80) {
		$browserWidthNotice.show();
	}

	/*****************
        Animation
    *****************/

    /* Fade out the welcome message. */
	$welcome.velocity({ opacity: [ 0, 0.65 ] }, { display: "none", delay: 3500, duration: 1100 });

	/* Animate the dots' container. */
	$container
		.css("perspective-origin", screenWidth/2 + "px " + ((screenHeight * 0.45) - chromeHeight) + "px")
		.velocity(containerAnimationMap, { duration: 800, loop: 1, delay: 3250 });

	/* Special visual enhancement for WebKit browsers, which are faster at box-shadow manipulation. */
	if (isWebkit) {
		$dots.css("boxShadow", "0px 0px 4px 0px #4bc2f1");
	}
	
	putDots();
	
function putDots(){
	/* Animate the dots. */
	$dots
		.velocity({ 
			translateX: [ 
				function() { return "+=" + r(-screenWidth/2.5, screenWidth/2.5) },
				function() { return r(0, screenWidth) }
			],
			translateY: [
				function() { return "+=" + r(-screenHeight/2.75, screenHeight/2.75) },
				function() { return r(0, screenHeight) }
			],
			translateZ: [
							function() { return "+=" + r(translateZMin, translateZMax) },
							function() { return r(translateZMin, translateZMax) }
			],
			opacity: [ 
				function() { return Math.random() },
				function() { return Math.random() + 0.2 }
			]
		}, { duration: 15000 })
		.velocity("reverse", { easing: "easeInQuad" }, { duration: 2000, complete: function() { 
			putDots();
		}
	})
	.appendTo($container);
	
}
	