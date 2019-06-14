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

var database = firebase.database();


var trainName;
var destination;
var frequency;
var nextArrival;
var timeAway;
var currentTime;
var firstTimeConverted;

$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    var firstTime = $("#train-time-input").val().trim();
    frequency = $("#train-frequency-input").val().trim();
    console.log(frequency);
    trainName = $("#train-name-input").val().trim();
    destination = $("#train-destination-input").val().trim();

    firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    currentTime = moment();
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Current Time: " + moment(currentTime).format("hh:mm"));

    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    timeAway = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + timeAway);

    nextArrival = moment().add(timeAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));


    var newTrain = {
        name: trainName,
        firstTime: firstTime,
        destination: destination,
        frequency: frequency
    }

    database.ref().push(newTrain);


    $("#train-time-input").val("");
    $("#train-frequency-input").val("");
    $("#train-name-input").val("");
    $("#train-destination-input").val("");

});

database.ref().on("child_added",function(childSnapshot){
    console.log(childSnapshot.val());

    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainFrequency = childSnapshot.val().frequency;
    var fTime = childSnapshot.val().firstTime;
    var fTimeConverted = moment(fTime, "HH:mm").subtract(1, "years");
    var cTime = moment();
    var timeDif = moment().diff(moment(fTimeConverted), "minutes");
    var remainder = timeDif % trainFrequency;
    var timeLeft = trainFrequency - remainder;
    var nextTrain = moment().add(timeLeft, "minutes");

    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(moment(nextTrain).format("hh:mm")),
        $("<td>").text(timeLeft)
    );

    $("#train-table > tbody").append(newRow);


});