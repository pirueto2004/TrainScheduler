function setBackgroundImage(myObject, imageUrl) {
    myObject.css({
                 "background-image": "url(" + imageUrl + ")",
                 "background-position": "left",
                 "background-size": "50%"
                //  "background-size": "100% 300%"
                 });
  }

//   var body = $("body");
//   var imageUrl = 'assets/images/bg-blue.jpg';
//   setBackgroundImage(body, imageUrl);

var jumbotron = $(".jumbotron");
var imageUrl = 'assets/images/grant-czerwinski.jpg';
var currentTime = moment().format("MM/DD/YY hh:mm A");


  $(document).ready(function(){
    setBackgroundImage(jumbotron, imageUrl);
    
    $(".date-time").text(currentTime);

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDG02RhsyYpTkyLeBFxk6xMlH8pq3sPUXU",
        authDomain: "trainscheduler-app.firebaseapp.com",
        databaseURL: "https://trainscheduler-app.firebaseio.com",
        projectId: "trainscheduler-app",
        storageBucket: "trainscheduler-app.appspot.com",
        messagingSenderId: "823077281269"
    };
    firebase.initializeApp(config);

    // Create a variable to reference the database
    var database = firebase.database();

    // Initial Variables (SET the first set IN FIREBASE FIRST)
    // Note remember to create these same variables in Firebase!
    var trainName;
    var trainDest;
    var firstTrain;
    var trainFrec = 0;

   // Create an initial trainCount variable
    var trainCount = 0;
    var trainArray = JSON.parse(localStorage.getItem("trainList"));   

    // Click Button changes what is stored in firebase
    $("#add-train-btn").on("click", function(event) {
        // Prevent the page from refreshing
        event.preventDefault();

        // Grabs train input
        trainName = $("#train-input").val().trim();
        trainDest = $("#dest-input").val().trim();
        firstTrain = $("#time-input").val().trim();
        trainFrec = $("#frec-input").val().trim();
        

        // Creates local "temporary" object for holding the train data
        var newTrain = {
            name: trainName,
            dest: trainDest,
            first: firstTrain,
            frec: trainFrec,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        };

        // Pushes train data to the database
        database.ref().push(newTrain);
        alert("Train successfully added");
        $("form")[0].reset();
        // Clears the form
        // $("#train-input").val("");
        // $("#dest-input").val("");
        // $("#time-input").val("");
        // $("#frec-input").val("");
    });


    database.ref().on("child_added", function(childSnapshot) {
        var nextArr;
        var minAway;

        // Assumptions
        // trainFrec = 3;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTrainNew = moment(childSnapshot.val().first, "hh:mm").subtract(1, "years");
        console.log(firstTrainNew);

        //Current Time
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the current and firstTrain
        var diffTime = moment(currentTime).diff(moment(firstTrainNew), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        //Time apart (remainder)
        // var tRemainder = diffTime % tFrequency;
        var tRemainder = diffTime % childSnapshot.val().frec;
        console.log(tRemainder);

        // Minutes until next train
        var minAway = childSnapshot.val().frec - tRemainder;
        console.log("MINUTES TILL TRAIN: " + minAway);
        

        // Next train time
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");      
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        $("#add-row").append("<tr><td>" + childSnapshot.val().name +
                "</td><td>" + childSnapshot.val().dest +
                "</td><td>" + childSnapshot.val().frec +
                "</td><td>" + nextTrain + 
                "</td><td>" + minAway + "</td></tr>");

            // Handle the errors
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
    });
        
    // database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
    //     // Change the HTML to reflect
    //     $("#name-display").html(snapshot.val().name);
    //     $("#dest-display").html(snapshot.val().email);
    //     $("#age-display").html(snapshot.val().age);
    //     $("#comment-display").html(snapshot.val().comment);
    // });
       
    

        
        

        // var tableRow = $("<tr>").append(
        // $("<td>").text(tempTrain),
        // $("<td>").text(tempDest),
        // $("<td>").text(tempFrec),
        // $("<td>").text(tempNext),
        // $("<td>").text(tempMin)
        // );
    });

// Assume the following situations.

    // (TEST 1)
    // First Train of the Day is 3:00 AM
    // Assume Train comes every 3 minutes.
    // Assume the current time is 3:16 AM....
    // What time would the next train be...? (Use your brain first)
    // It would be 3:18 -- 2 minutes away

    // (TEST 2)
    // First Train of the Day is 3:00 AM
    // Assume Train comes every 7 minutes.
    // Assume the current time is 3:16 AM....
    // What time would the next train be...? (Use your brain first)
    // It would be 3:21 -- 5 minutes away


    // ==========================================================

    // Solved Mathematically
    // Test case 1:
    // 16 - 00 = 16
    // 16 % 3 = 1 (Modulus is the remainder)
    // 3 - 1 = 2 minutes away
    // 2 + 3:16 = 3:18

    // Solved Mathematically
    // Test case 2:
    // 16 - 00 = 16
    // 16 % 7 = 2 (Modulus is the remainder)
    // 7 - 2 = 5 minutes away
    // 5 + 3:16 = 3:21

    // // Assumptions
    // var tFrequency = 3;

    // // Time is 3:30 AM
    // var firstTime = "03:30";

    // // First Time (pushed back 1 year to make sure it comes before current time)
    // var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    // console.log(firstTimeConverted);

    // // Current Time
    // var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // // Difference between the times
    // var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    // // Time apart (remainder)
    // var tRemainder = diffTime % tFrequency;
    // console.log(tRemainder);

    // // Minute Until Train
    // var tMinutesTillTrain = tFrequency - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // // Next Train
    // var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

//   });