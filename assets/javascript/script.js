// Initialize Firebase
var config = {
    apiKey: "AIzaSyAR5YmigV7QznEyjjmbQ57flnKyyz7OdlI",
    authDomain: "train-time-2ee11.firebaseapp.com",
    databaseURL: "https://train-time-2ee11.firebaseio.com",
    projectId: "train-time-2ee11",
    storageBucket: "train-time-2ee11.appspot.com",
    messagingSenderId: "210287419971"
  };
  firebase.initializeApp(config);

    var database = firebase.database();

    //Button for new trains

    var trainName = "";
    var trainDestination = "";
    var trainFirsttime = "";
    var trainFrequency = 0;

$("#submit").on("click", function(event) {
    event.preventDefault();

    trainName = $("#trainName").val().trim();
    trainDestination = $("#trainDestination").val().trim();
    trainFirsttime = $("#trainFirsttime").val().trim();
    trainFrequency = $("#trainFrequency").val().trim();

    var newTrain = {
        
        trainName: trainName,
        trainDestination: trainDestination,
        trainFirsttime: trainFirsttime,
        trainFrequency: trainFrequency
    };
    database.ref().push(newTrain);

    $(".form-field").val("");
    
});

database.ref().on("child_added", function (childSnapshot) {
    var trainFirsttimeConverted = moment(childSnapshot.val().trainFirsttime, "HH:mm").subtract(1, "years"); 
    var timeDiff = moment().diff(moment(trainFirsttimeConverted), "minutes");
	var timeRemain = timeDiff % childSnapshot.val().trainFrequency;
	var minToArrival = childSnapshot.val().trainFrequency - timeRemain;
	var nextTrain = moment().add(minToArrival, "minutes");
    var key = childSnapshot.key;
    
    var newRowtrain = $("<tr>");
    newRowtrain.append($("<td>" + childSnapshot.val().trainName + "</td>"));
    newRowtrain.append($("<td>" + childSnapshot.val().trainDestination + "</td>"));
	newRowtrain.append($("<td class='text-center'>" + childSnapshot.val().trainFrequency + "</td>"));
	newRowtrain.append($("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>"));
	newRowtrain.append($("<td class='text-center'>" + minToArrival + "</td>"));
	newRowtrain.append($("<td class='text-center'><button class='arrival btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>"));
    
    $("#trainschedule").append(newRowtrain);
})

//button to remove trains

$(document).on("click", ".arrival", function() {
    keyref = $(this).attr("data-key");
    database.ref().child(keyref).remove();
    window.location.reload();
  });

//function to reload the page every minute
setInterval(function() {
    window.location.reload();
  }, 60000);


