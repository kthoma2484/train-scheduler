$(function () {

    let database = firebase.database();

    // for adding employees
    $("#add-train").on("click", function (event) {
        event.preventDefault();

        let trainName = $("#train-name").val().trim();
        let trainDest = $("#destination").val().trim();
        let trainTime = $("#train-time").val().trim();
        let trainFreq = $("#frequency").val().trim();
        let trainNext = "";
        let minsTillTrain = "";

        // creat local storage for train data
        let newTrain = {
            train: trainName,
            destination: trainDest,
            time: trainTime,
            frequency: trainFreq,
            next: trainNext,
            minsAway: minsTillTrain

        }

        // uploading train data to the database
        database.ref().push(newTrain);
        console.log(newTrain.train + "/" + newTrain.destination + "/" + newTrain.time + "/" + newTrain.frequency)

        alert("New train scheduled to depart!!!")

        // clear all form fields once data added
        $("#train-name").val("");
        $("#destination").val("");
        $("#train-time").val("");
        $("#frequency").val("");
    })

    database.ref().on("child_added", function(childSnapshot, prevChildKey) {

        console.log(childSnapshot.val());

        let trainName = childSnapshot.val().train;
        let trainDest = childSnapshot.val().destination;
        let trainTime = childSnapshot.val().time;
        let trainFreq = childSnapshot.val().frequency;
        
        console.log(trainName + "/" + trainDest + "/" + trainTime + "/" + trainFreq);
    

        // current train minus 1 hour
        let firstTrainConverted = moment(trainTime, "HH:mm").subtract(1, "years");
        console.log(firstTrainConverted);

        //
        let currentTime = moment();
        console.log("current time: " + moment(currentTime).format("hh:mm"));

        // difference between the times
        let diffTime = moment().diff(moment(firstTrainConverted),"minutes");
        console.log("time diff: " + diffTime);

        // time remaining until next
        let remainTime = diffTime % trainFreq;
        console.log (remainTime);

        // mins until next train
        let minsTillTrain = trainFreq - remainTime;
        console.log("minutes till next train: " + minsTillTrain);
        
        // next train
        let nextTrain = moment().add(minsTillTrain, "minutes");
        console.log("Next train arrival: " + moment(nextTrain).format("hh:mm"));


        $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>"
        + trainFreq + "</td><td>" + moment(nextTrain).format("hh:mm") + "</td><td>" + minsTillTrain + "</td>")


    });


});