$(document).ready(function() {
    // Dynamically determine the category from the card's inner class
    let category = "unknown";
    const firstCardInner = $(".card-inner").first();
    const classList = firstCardInner.attr('class').split(/\s+/);
    
    for (const cls of classList) {
        if (cls.includes('-card-')) {
            category = cls.split('-card-')[0];
            break;
        }
    }

    // On page load, restore flipped card states
    $(".card-container").each(function(index) {
        const cardState = localStorage.getItem(`${category}-check-${index + 1}`);
        if (cardState === "1") {
            $(this).addClass('flipped');
        }
    });

    // Add a click event listener to all card containers
    $(".card-container").on("click", function() {
        const cardContainer = $(this);
        const index = cardContainer.index();
        const storageKey = `${category}-check-${index + 1}`;
        const isFlipped = cardContainer.hasClass("flipped");

        let isWildCard = false;
        if (category === "Games" && index === 5) {
            isWildCard = true;
        } else if (category === "Maths" && index === 3) {
            isWildCard = true;
        } else if (category === "Memes" && index === 2) {
            isWildCard = true;
        } else if (category === "Movies" && index === 4) { // New: Check for the Movies Wild Card
            isWildCard = true;
        } else if(category === "Sports" && index === 0){
            isWildCard = true;
        } else if(category === "Songs" && index === 4){
            isWildCard = true;
        }

        // Check for the Games track and the Wild Card
        if (isWildCard) {
            if (!isFlipped) {
                cardContainer.addClass("flipped");
                localStorage.setItem(storageKey, "1");
                
                // Show the wildcard popup after a brief delay
                setTimeout(function() {
                    $("#wildcardPopup").css("display", "flex");
                }, 1000);
            }
        } else {
            // All other cards toggle the flip state
            cardContainer.toggleClass("flipped");
            const newIsFlipped = cardContainer.hasClass("flipped");
            localStorage.setItem(storageKey, newIsFlipped ? "1" : "0");

            // Start timer if the card is flipped to its back
            if (newIsFlipped) {
                const points = parseInt(cardContainer.find(".card-front p").text());
                if (!isNaN(points) && points > 0) {
                    startQuestionTimer(points);
                }
            } else {
                // Clear the timer if the card is flipped back
                clearTimeout(window.questionTimer);
            }
        }
    });

    // Handle clicks on buttons inside card backs (for audio or other actions)
    $(".card-back button").on("click", function(event) {
        event.stopPropagation();
        const cardIndex = $(this).closest(".card-container").index();
        let audioId;

        if (category === "Songs") {
            audioId = `songaudio${cardIndex + 1}`;
        } else if (category === "Sports") {
            audioId = `sportsaudio${cardIndex + 1}`;
        } else {
            console.error("Unknown category. Cannot determine audio ID.");
            return;
        }
        
        const audio = document.getElementById(audioId);
        if (audio) {
            audio.play();
        } else {
            console.error(`Audio element with ID '${audioId}' not found.`);
        }
    });

    // Wildcard-specific "Reveal Question" button handler
    $("#gamerevealButton").on("click", function() {
        const questionText = "This fighting game series features combatants as silhouetted figures with realistic, physics-based martial arts animations, where players must defeat a series of demon bosses, including the assassin Lynx, the pirate Wasp, and the tyrannical Shogun, to restore their own physical form.";
        $("#wildcardPopup").css("display", "none");
        $("#revealedQuestionText").text(questionText);
        $("#questionPopup").css("display", "flex");
        
        // Start the timer when the question is revealed
        startTimer(60000); // 60 seconds
    });

    // FOR MEMES:
    $("#memesRevealButton").on("click", function() {
        $("#wildcardPopup").css("display", "none");
        $("#questionPopup").css("display", "flex");
        $("#revealedQuestionText").text("");
        $("#revealedImageContainer").html("");
        const imageUrl = "../assets/meme_300.jpg";
        if (imageUrl) {
            const img = $("<img>").attr("src", imageUrl).addClass("w-full h-full object-contain rounded");
            $("#revealedImageContainer").append(img);
        }
        
        // Start the timer when the question is revealed
        startTimer(30000); // 30 seconds
    });

    // FOR MOVIES:
    $("#moviesRevealButton").on("click", function() {
        $("#wildcardPopup").css("display", "none");
        $("#questionPopup").css("display", "flex");
        $("#revealedQuestionText").text("");
        $("#revealedImageContainer").html("");
        const imageUrl = "../assets/mov_500.gif";
        if (imageUrl) {
            const img = $("<img>").attr("src", imageUrl).addClass("w-full h-full object-contain rounded");
            $("#revealedImageContainer").append(img);
        }
        
        // Start the timer when the question is revealed
        startTimer(50000); // 50 seconds
    });

    //FOR MATHS:
    $("#mathsRevealButton").on("click", function() {
        const questionText = "What is the name of a mathematical knot that cannot be unknotted without cutting it?";
        $("#wildcardPopup").css("display", "none");
        $("#revealedQuestionText").text(questionText);
        $("#questionPopup").css("display", "flex");

        // Start the timer when the question is revealed
        startTimer(40000); // 40 seconds
    });

    // FOR SPORTS:
    $("#sportsRevealButton").on("click", function() {
        const audio = "../assets/sports_100.mp3";
        $("#wildcardPopup").css("display", "none");

        $("#revealedQuestionText").text("");
        $("#revealedImageContainer").html("");
        $("#revealedAudioContainer").html("");

        const audioElement = $("<audio controls autoplay>").attr("src", audio);
        $("#revealedAudioContainer").append(audioElement);

        // Start the timer when the question is revealed
        startTimer(20000); // 20 seconds
    });

    //FOR SONGS:
    $("#songsRevealButton").on("click", function() {
        $("#wildcardPopup").css("display", "none");
        $("#questionPopup").css("display", "flex");
        $("#revealedQuestionText").text("What album is this?");
        $("#revealedImageContainer").html("");
        $("#revealedAudioContainer").html(""); // Clear audio container

        const imageUrl = "../assets/songs_500.jpg";
        const img = $("<img>").attr("src", imageUrl).addClass("w-full h-full object-contain rounded");
        $("#revealedImageContainer").append(img);

        startTimer(50000); // Set a timer for 50 seconds
    });

    $("#closeQuestionButton").on("click", function() {
        $("#questionPopup").css("display", "none");
    });

    // New function to handle the timer
    function startTimer(duration) {
        // Hide the close button initially
        $("#closeQuestionButton").hide();
        
        // Set a timer for 60 seconds
        setTimeout(function() {
            $("#revealedQuestionText").addClass('blurred-text');
            $("#closeQuestionButton").show();
        }, duration); // 40000 milliseconds = 40 seconds
    }

    function startQuestionTimer(points) {
        const duration = points / 10;
        const timesUpPopup = $("#timesUpPopup");

        clearTimeout(window.questionTimer);
        window.questionTimer = setTimeout(function() {
            timesUpPopup.css("display", "flex");
        }, duration * 1000);
    }

    $("#timesUpPopup button").on("click", function() {
        $("#timesUpPopup").css("display", "none");
    });

    $("#closeTimesUpButton").on("click", function() {
        $("#timesUpPopup").css("display", "none");
    });
});