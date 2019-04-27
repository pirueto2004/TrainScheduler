// FUNCTIONS
// ============
function setBackgroundImage(myObject, imageUrl) {
    myObject.css({
                 "background-image": "url(" + imageUrl + ")",
                 "background-position": "left",
                 "background-size": "50%"
                //  "background-size": "100% 300%"
                 });
  }

  function updateClock() {
    var clock = moment().format("MM/DD/YY h:mm:ss a");
    $(".date-time").html(clock); 
      // // Get current time in seconds
      var currentTimeSec = moment();
      console.log("Current Time in seconds:" + moment(currentTimeSec).format("ss"));
      if(moment(currentTimeSec).format("ss") == 00)
      {
        // When current seconds=00
          location.reload();     
      }
  };

  function resetForm() {
    $("#train-input").val("");
    $("#dest-input").val("");
    $("#time-input").val("");
    $("#freq-input").val("");
  };

    // GLOBAL VARIABLES
    // ================

    // Create a variable to reference the database
    var database = firebase.database();

    var trainName;
    var trainDest;
    var firstTrain;
    var trainFrec = 0;
    var key;
    
    var jumbotron = $(".jumbotron");
    var imageUrl = 'assets/images/grant-czerwinski.jpg';

  // MAIN PROCESS
  // ============
  $(document).ready(function(){
        
    //Sets background of jumbotron to imageUrl
    setBackgroundImage(jumbotron, imageUrl);
    
    // $(".date-time").append(currentTime);
    setInterval(updateClock, 1000);
    
        
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

  
    // Click Button changes what is stored in firebase
    $("#add-train-btn").on("click", function(event) {
        // Prevent the page from refreshing
        event.preventDefault();

        // Grabs train input
        trainName = $("#train-input").val().trim();
        trainDest = $("#dest-input").val().trim();
        firstTrain = $("#time-input").val().trim();
        trainFrec = $("#freq-input").val().trim();
        

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
        // $("form")[0].reset();

        //Clears the form
        resetForm();
     });

    //Create Firebase event for adding train info to the database and a row in the html when a user adds an entry
    database.ref().on("child_added", function(childSnapshot) {
        
        //Firebase watcher + initial loader. Store everything into a variable.
        trainName = childSnapshot.val().name;
        trainDest = childSnapshot.val().dest;
        firstTrain = childSnapshot.val().first;
        trainFrec = childSnapshot.val().frec;
        key = childSnapshot.key;
        

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTrainNew = moment(childSnapshot.val().first, "hh:mm").subtract(1, "years");
        console.log(firstTrainNew);

        //determine Current Time
        // var currentTime = moment();
        //Gets the current time in "MM/DD/YY h:mm:ss" format
         var currentTime = moment().format("MM/DD/YY h:mm:ss a");
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the current and firstTrain
        var diffTime = moment(currentTime).diff(moment(firstTrainNew), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        //Time apart (remainder)
        // var tRemainder = diffTime % tFrequency;
        var tRemainder = diffTime % trainFrec;
        console.log(tRemainder);

        // Minutes until next train
        var minAway = trainFrec - tRemainder;
        console.log("MINUTES TILL TRAIN: " + minAway);
        

        // Next train time
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");      
        console.log("ARRIVAL TIME: " + nextTrain);

        //Append new row to the table with the new train input
        var newRow = $("<tr>");
        newRow.append($("<td>" + childSnapshot.val().name + "</td>"));
        newRow.append($("<td>" + childSnapshot.val().dest + "</td>"));
        newRow.append($("<td class='text-center'>" + childSnapshot.val().frec + "</td>"));
        newRow.append($("<td class='text-center'>" + nextTrain + "</td>"));
        newRow.append($("<td class='text-center'>" + minAway + "</td>"));
        newRow.append($("<td class='text-center'><button class='delete btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>"));
        
        $("#add-row").append(newRow);


        //Delete rows
        $(".delete").on("click", function (event) {
        var r = confirm("Are you sure you want to Remove this train info from the database?");
        if (r == true) {
          keyref = $(this).attr("data-key");
          console.log(keyref);
          database.ref().child(keyref).remove();
          window.location.reload();
        } else {
            
        }
        
      });

            // Handle the errors
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
    });
     

  });    
