//$(document).ready(function() {

	/* global firebase */

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCgrdm6lDpYgGTA-YmwCjH27nQj9UOBmZA",
    authDomain: "e-invoice-9e19f.firebaseapp.com",
    databaseURL: "https://e-invoice-9e19f.firebaseio.com",
    projectId: "e-invoice-9e19f",
    storageBucket: "",
    messagingSenderId: "665429019687",
    appId: "1:665429019687:web:729b7ddab756d09c"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

// Create a variable to reference the database
	var database = firebase.database();
	var dbkey = database.key;


// --------------------------------------------------------------

	//Variables for the initial case, will hold user data

	var customerId = "";
	var customerAccountNum = "";
    var customerFirstName = "";
    var customerLastName = "";
    var customerFullName = "";
    var customerStreet = "";
    var customerCity = "";
    var customerState = "";
    var customerPostalCode = "";

    // Variables for the invoice

    var invoiceId = "";
    var invoiceAccountId = "";
    var invoiceRateCode = "";
    var invoiceUsagekwh = "";
    var invoiceTotal = "";
    var invoiceDate = "";
    var invoiceURL = "";
    

	//
	var name = "";
	var destination = "";
	var frequency = 0;

	var trainIDs = [];		//Holds the keys for each train to be used in removal and edits
	var globalIndex = 0;	//Used to keep track of which element for removal and editing

// the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
	$('.modal').modal();

	//Displays the current time
	var currentTime = moment().format('h:mm A');
	$('#currentTime').html("The time is now: " + currentTime);

	//When you add a customer to the database
	$('#addAcct').click(function() {
		console.log("Entering my-form block:...");
		customerAccountNum = $('#acctnuminput').val().trim();
		console.log("This is the value of account number:..." + customerAccountNum);
		customerFirstName = $('#fnameinput').val().trim();
		console.log("This is the value of first name:..." + customerFirstName);
		customerLastName = $('#lnameinput').val().trim();
		console.log("This is the value of last name:..." + customerLastName);
		customerStreet = $('#addressinput').val().trim(); 
		console.log("This is the value of address:..." + customerStreet);
		customerCity = $('#cityinput').val().trim();
		console.log("This is the value of city:..." + customerCity);
		customerState = $('#stateinput').val().trim();
		console.log("This is the value of state:..." + customerState);
		customerPostalCode = $("postalinput").val().trim();
		console.log("This is the value of postal code:" + customerPostalCode);
		customerFullName = customerFirstName + " " + customerLastName;

		// Save new value to Firebase
		
		database.ref().push({
			
			customerAccountNum: customerAccountNum,
			customerFirstName: customerFirstName,
			customerLastName: customerLastName,
			customerStreet: customerStreet,
			customerCity: customerCity,
			customerState: customerState,
			customerPostalCode: customerPostalCode,
			customerFullName: customerFullName,
		});

		//Reload needed for the removal to work on last element
		location.reload();
		return false;
	});

	//Will display changes when there are children added to the database
	database.ref().on("child_added", function(snapshot) {

		//Calculating the next train arrival time and the minutes until it arrives
		var firstTrainMoment = moment(snapshot.val().firstTrainTime, "hh:mm").subtract(1, "years");
		var diffTime = moment().diff(moment(firstTrainMoment), "minutes");
		var remainder = diffTime % snapshot.val().frequency;
		var minUntilTrain = snapshot.val().frequency - remainder;
		var nextTrain = moment().add(minUntilTrain, "minutes");
		var deletme = "ridme-" + globalIndex;

		$('#display').append("<tr><td id='nameDisplay'>" + snapshot.val().name +
			"</td><td id='destinationDisplay'>" + snapshot.val().destination +
			"</td><td id='frequencyDisplay'>" + "Every " + snapshot.val().frequency + " mins" +
			"</td><td id='nextArrivalDisplay'>" + moment(nextTrain).format("hh:mm A") +
			"</td><td id='minutesAwayDisplay'>" + minUntilTrain + " minutes until arrival" +
			"</td><td id='editbuttons'><button class='removeme' id=" + deletme + " data-indexNum=" + globalIndex + " title='Remove Train?'><div class='glyphicon glyphicon-trash'></div></button> " +
			"<button class='editme' data-indexNum=" + globalIndex + " title='Edit Train?'><div class='glyphicon glyphicon-pencil'></div></button></td>");

		globalIndex++;

	}, function (errorObject) {

	  	console.log("The read failed: " + errorObject.code);

	});

	//Gets the train IDs in an Array
	database.ref().once('value', function(dataSnapshot){ 
    	var indexofTrains = 0;

        dataSnapshot.forEach(
            function(childSnapshot) {
                trainIDs[indexofTrains++] = childSnapshot.key;
            }
        );
    });

	
	//When you click on the edit button, it asks you for each item again and sets it to the database
	$(document.body).on('click', '.editme', function(){
		
		var x = $(this).attr("data-indexNum");
		var num = x;
		
		console.log("This is the value of num in .editme:..." + num);

		name = prompt("What do you want the name to be?");
		destination = prompt("What do you want the destination to be?");
		firstTrainTime = prompt("What time did the first train arrive? (HH:mm - military time)");
		frequency = prompt("How often does it arrive? (in minutes)");


		database.ref().child(trainIDs[num]).set({
			name: name,
			destination: destination,
			firstTrainTime: firstTrainTime,
			frequency: frequency
		});

		//Must reload to show the database changes on the page
		location.reload();

});
	
	//When you click on the remove buttons, it gets the row it's on and deletes it from the database
	$(document.body).on('click', '.removeme', function(){

		var y = $(this).attr("data-indexNum");
		var num = y;
				
		console.log("This is the value of num in .removeme:..." + num);		
		database.ref().child(trainIDs[num]).remove();

		//Must reload to show the database changes on the page
		location.reload();
//	}
});
	
	//When you click on the Sign-in button, it takes you to Customer Tab
	$(document.body).on('click', '.gotocustomer', function(){

    console.log("You made it to the #customer code inside js");	
		// prevent form from trying to submit/refresh the page
		event.preventDefault();
	  
	  	// Select tab by name
		// $('.nav-tabs a[href="#customer"]').tab('show');
	  	$("#customer").show(); 
		$("#home").hide();
		$("#invoice").hide();
		$("#myModal").hide();
});	
	
