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

	var customerIDs = [];		//Holds the keys for each train to be used in removal and edits
	var globalIndex = 0;	//Used to keep track of which element for removal and editing

// the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
//	$('.modal').modal();

	//Displays the current time
//	var currentTime = moment().format('h:mm A');
//	$('#currentTime').html("The time is now: " + currentTime);


//	$(function(){
//		alert('Step 1 made it to function on click');
//		$('#addme').click(function(e) {
//			e.preventDefault();
//			alert('Step 2 made it to addme button click');	
//		});
//	});

//$(document.body).on('click', '#addMe', function(e){
//		alert('Modal is successfully shown!');
//	});
	
//	$('#addAcct').click(function() {
//	$('#addme').click(function() {	

// *** Add Customer Process ***

	$(document.body).on('click', '#addMe', function(e){	
	
		e.preventDefault();
		
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
			customerFullName: customerFullName
		});

		//Reload needed for the removal to work on last element
		location.reload();
		return false;
	});

	//Will display changes when there are children added to the database
	database.ref().on("child_added", function(snapshot) {

//		var deletme = "ridme-" + globalIndex;

		$('#displayCust').append(
			"<tr>" + 
			"<td id='customerAccountNumDisplay'>" + snapshot.val().customerAccountNum +
			"</td><td id='customerFullNameDisplay'>" + snapshot.val().customerFullName + 
			"</td><td id='customerStreetDisplay'>" + snapshot.val().customerStreet + 
			"</td><td id='customerCityCodeDisplay'>" + snapshot.val().customerCity + 			
			"</td><td id='customerStateDisplay'>" + snapshot.val().customerState + 
			"</td><td id='customerPostalCodeDisplay'>" + snapshot.val().customerPostalCode + 
			"</td><td><span class='table-remove'><button type='button'" +
			"class='btn btn-danger btn-rounded btn-sm my-0'>Remove</button></span>" +
			"</td></tr>");
//			"</td><td id='editbuttons'><button class='removeme' id=" + deletme + " data-indexNum=" + globalIndex + " title='Remove Customer?'><div class='glyphicon glyphicon-trash'></div></button> " +
//			"<button class='editme' data-indexNum=" + globalIndex + " title='Edit Customer?'><div class='glyphicon glyphicon-pencil'></div></button></td>
			

		globalIndex++;

	}, function (errorObject) {

	  	console.log("The read failed: " + errorObject.code);

	});

	//Gets the Customer Account Numbers in an Array
	database.ref().once('value', function(dataSnapshot){ 
    	var indexofCustomers = 0;

        dataSnapshot.forEach(
            function(childSnapshot) {
                customerIDs[indexofCustomers++] = childSnapshot.key;
            }
        );
    });

// *** Edit Customer Process ***
	
	//When you click on the edit button, it asks you for each item again and sets it to the database 
	
	$(document.body).on('click', '.editme', function(e){
		
		var x = $(this).attr("data-indexNum");
		var num = x;
		
		e.preventDefault();
		
		console.log("This is the value of num in .editme:..." + num);

//		name = prompt("What do you want the name to be?");
//		destination = prompt("What do you want the destination to be?");
//		firstTrainTime = prompt("What time did the first train arrive? (HH:mm - military time)");
//		frequency = prompt("How often does it arrive? (in minutes)");


		database.ref().child(customerIDs[num]).set({
//			name: name,
//			destination: destination,
//			firstTrainTime: firstTrainTime,
//			frequency: frequency
			customerAccountNum: customerAccountNum,
			customerFirstName: customerFirstName,
			customerLastName: customerLastName,
			customerStreet: customerStreet,
			customerCity: customerCity,
			customerState: customerState,
			customerPostalCode: customerPostalCode,
			customerFullName: customerFullName
		});

		//Must reload to show the database changes on the page
		location.reload();

});

// *** Delete Customer Process ***
	
	//When you click on the remove buttons, it gets the row it's on and deletes it from the database
	$(document.body).on('click', '.removeme', function(e){

		var y = $(this).attr("data-indexNum");
		var num = y;
		
		e.preventDefault();
		
		console.log("This is the value of num in .removeme:..." + num);		
		database.ref().child(customerIDs[num]).remove();

		//Must reload to show the database changes on the page
		location.reload();
});
	
