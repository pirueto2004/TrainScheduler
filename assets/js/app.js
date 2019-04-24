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
  var imageUrl = 'assets/images/high-speed-train.jpg';
  setBackgroundImage(jumbotron, imageUrl);

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

        // Create an initial employeeCount variable
    var trainCount = 0;
    var trainArray = JSON.parse(localStorage.getItem("trainList"));   

    // Click Button changes what is stored in firebase
    $("#add-train-btn").on("click", function(event) {
        // Prevent the page from refreshing
        event.preventDefault();

        // Grabs train input
        var trainName = $("#train-input").val().trim();
        var trainDest = $("#dest-input").val().trim();
        var trainTime = $("#time-input").val().trim();
        var trainFrec = $("#frec-input").val().trim();
        

        // Creates local "temporary" object for holding employee data
        var newTrain = {
            name: trainName,
            dest: trainDest,
            time: trainTime,
            frec: trainFrec
           
        };

        // Uploads employee data to the database
        database.ref().push(newTrain);

        // Logs everything to console
        console.log(newTrain.name);
        console.log(newTrain.dest);
        console.log(newTrain.time);
        console.log(newTrain.frec);
        

        alert("Train successfully added");

        // Clears all of the text-boxes
        $("#train-input").val("");
        $("#dest-input").val("");
        $("#time-input").val("");
        $("#frec-input").val("");
        

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

    // Assumptions
    var tFrequency = 3;

    // Time is 3:30 AM
    var firstTime = "03:30";

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));