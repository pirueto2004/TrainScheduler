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
  $("#frec-input").val("");
};

  // GLOBAL VARIABLES
  // ================

  // var trainName;
  // var trainDest;
  // var firstTrain;
  // var trainFrec;
  // var key;
  
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

    // Create a variable to reference the database
    var database = firebase.database();

  // Click Button changes what is stored in firebase
  $("#add-train-btn").on("click", function(event) {
      // Prevent the page from refreshing
      event.preventDefault();

      // Grabs user input
      var train_input = $("#train-input").val().trim();
      var destination_input = $("#dest-input").val().trim();
      var firstTrain_input = $("#time-input").val().trim();
      var frequency_input = $("#frec-input").val().trim();
      

      // Creates local "temporary" object for holding the train data
      var newTrain = {
          name: train_input,
          dest: destination_input,
          first: firstTrain_input,
          frec: frequency_input,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
      };

      // Pushes train data to the database
      database.ref().push(newTrain);
      alert("Train successfully added");

       // Log everything to console
      console.log(newTrain.train_input);
      console.log(newTrain.destination_input);
      console.log(newTrain.firstTrain_input);
      console.log(newTrain.frequency_input);
      
      //Clears the form
      resetForm();
   });

  //Create Firebase event for adding train info to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
      
      //Firebase watcher + initial loader. Store everything into a variable.
      var trainName = childSnapshot.val().name;
      var trainDest = childSnapshot.val().dest;
      var firstTrain = childSnapshot.val().first;
      var trainFrec = childSnapshot.val().frec;
      var key = childSnapshot.key;
      

      // First Time (pushed back 1 year to make sure it comes before current time)
      var firstTrainNew = moment(firstTrain, "hh:mm").subtract(1, "years");
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
      nextTrain = moment(nextTrain).format("hh:mm a");      
      console.log("ARRIVAL TIME: " + nextTrain);

      //Append new row to the table with the new train input
      var newRow = $("<tr>").append(
                   $("<td>").text(trainName),
                   $("<td>").text(trainDest),
                   $("<td class='text-center'>").text(trainFrec),
                   $("<td class='text-center'>").text(nextTrain),
                   $("<td class='text-center'>").text(minAway),
                   $("<td class='text-center'><button class='delete btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>")
      );
      // newRow.append($("<td>" + trainName + "</td>").text(trainName));
      // newRow.append($("<td>" + trainDest + "</td>"));
      // newRow.append($("<td class='text-center'>" + trainFrec + "</td>"));
      // newRow.append($("<td class='text-center'>" + nextTrain + "</td>"));
      // newRow.append($("<td class='text-center'>" + minAway + "</td>"));
      // newRow.append($("<td class='text-center'><button class='delete btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>"));
      
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

      // Log the errors to the console if there is any
      }, function(errorObject) {
          console.log("Errors handled: " + errorObject.code);
  });
   

});    