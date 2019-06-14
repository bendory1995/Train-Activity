
//bringing firebase info.
var firebaseConfig = {
    apiKey: "AIzaSyBNnCDfmJnbE30ywERRrTDHIHlD9eKL9ds",
    authDomain: "traintime-8e8d3.firebaseapp.com",
    databaseURL: "https://traintime-8e8d3.firebaseio.com",
    projectId: "traintime-8e8d3",
    storageBucket: "traintime-8e8d3.appspot.com",
    messagingSenderId: "711273924150",
    appId: "1:711273924150:web:5f531545f780102c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//saving the database to a variable.
var database = firebase.database();

// creating variables needed to store and compute 
var trainName;
var destination;
var frequency;
var nextArrival;
var timeAway;
var currentTime;
var firstTimeConverted;

//when a user click the submit button
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    //this takes the user input for the train's first time.
    var firstTime = $("#train-time-input").val().trim();
    //this takes the user input for the train's frequency
    frequency = $("#train-frequency-input").val().trim();
    console.log(frequency);
    //this takes the user input for the name of the train
    trainName = $("#train-name-input").val().trim();
    //this takes the user input for train's destination
    destination = $("#train-destination-input").val().trim();

    //this converts the time given to previous year
    firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // saving current time
    currentTime = moment();
    // calculating the difference in time between current time and the first train time in minutes
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Current Time: " + moment(currentTime).format("hh:mm"));

    //this is getting the remainder of the time 
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // time away is frequency minus remainder of the time.
    timeAway = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + timeAway);

    // add time away from current time to get the next arrival time
    nextArrival = moment().add(timeAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));


    //creating an object with different values
    var newTrain = {
        name: trainName,
        firstTime: firstTime,
        destination: destination,
        frequency: frequency
    }

    database.ref().push(newTrain);


    // resetting the whole form to ""
    $("#train-time-input").val("");
    $("#train-frequency-input").val("");
    $("#train-name-input").val("");
    $("#train-destination-input").val("");

});


    //when the data is added on firebase
    database.ref().on("child_added",function(childSnapshot){
    console.log(childSnapshot.val());

    //creating a variable and storing the child's name, destination, frequency, first time, 
    //converted first time. 
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainFrequency = childSnapshot.val().frequency;
    var fTime = childSnapshot.val().firstTime;
    var fTimeConverted = moment(fTime, "HH:mm").subtract(1, "years");
    //difference in time between live and converted time
    var timeDif = moment().diff(moment(fTimeConverted), "minutes");
    //calculating remainder of the time 
    var remainder = timeDif % trainFrequency;
    //calculating how much time left for next train to arrive
    var timeLeft = trainFrequency - remainder;
    //adding the time left to current time in minutes.
    var nextTrain = moment().add(timeLeft, "minutes");

    //dynamically creating a table
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(moment(nextTrain).format("hh:mm")),
        $("<td>").text(timeLeft)
    );

    // append to the table to the screen
    $("#train-table > tbody").append(newRow);


});