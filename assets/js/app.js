$(document).ready(function(){
    console.log ("ready!");
   // Initialize Firebase
   var config = {
    apiKey: "AIzaSyBzvvSTdq17EAnncHWZ6YpHTykWWUs_Qvs",
    authDomain: "book-finder-6cc03.firebaseapp.com",
    databaseURL: "https://book-finder-6cc03.firebaseio.com",
    projectId: "book-finder-6cc03",
    storageBucket: "",
    messagingSenderId: "893603769974"
  };
  firebase.initializeApp(config);

  
  // holds the firebase the data
  var database = firebase.database();
      // button for adding adding volunteers
      $("#submit").on("click", function(event) {
        event.preventDefault();
        console.log("working");
  
      // Grabs user data entered into the form controls
        let genre = [];
        if(document.getElementById('mystery').checked) {
          genre.push('mystery');
        }
        if(document.getElementById('romance').checked) {
          genre.push('romance');
        }
        if(document.getElementById('classic').checked) {
          genre.push('classic');
        }
        if(document.getElementById('nonfiction').checked) {
            genre.push('nonfiction');
        }
        let age;
        if(document.getElementById('kid').checked) {
          age = 'kid';
        }
        else if(document.getElementById('young').checked) {
          age = 'young';
        }
        else age = 'adult';
        if (!genre && age || genre && !age) {
            alert('Please complete all sections of the form.')
            return false;
        }

        let characteristics = {
            genre: genre,
            age: age
        }
      
      // Adds book suggestion to bank
        let ntitle = $("#ntitle").val();
        let nauthor = $("#nauthor").val();
        let ngenre = [];
        if(document.getElementById('mystery').checked) {
          ngenre.push('mystery');
        }
        if(document.getElementById('romance').checked) {
          ngenre.push('romance');
        }
        if(document.getElementById('classic').checked) {
          ngenre.push('classic');
        }
        if(document.getElementById('nonfiction').checked) {
            ngenre.push('nonfiction');
        }
        let nage;
        if(document.getElementById('kid').checked) {
          nage = 'kid';
        }
        else if(document.getElementById('young').checked) {
          nage = 'young';
        }
        else nage = 'adult';
        let ndescription = $("#ndescription").val();
        let count = 0;
        if (ntitle) count++;
        if (nauthor) count++;
        if (ngenre) count++;
        if (ndescription) count++;
        if (count != 0 && count != 4) {
          alert('Please complete the entire form.');
          return false;
        }
  
        let newBook = {
          title: ntitle,
          author: nauthor,
          genre: ngenre,
          description: ndescription,
          age: nage
        }
  
        database.ref().push(newBook);
  
    console.log(newBook.title, newBook.author, newBook.genre, newBook.description, newBook.age);
    module.exports.newBook = newBook;

  
  // Clears all of the inputs
    $("#ntitle").val("");
    $("#nauthor").val("");
    $("#ngenre").val("");
    $("#ndescription").val("");
    $('#mystery').prop('checked', false)
    $('#romance').prop('checked', false)
    $('#classic').prop('checked', false)
    $('#nonfiction').prop('checked', false)
    $('#kid').prop('checked', false)
    $('#young').prop('checked', false)
    $('#adult').prop('checked', false)
  
    return false;
  
    });
  
      // Firebase watcher + initial loader HINT: .on("value")
      database.ref().on("child_added", function(childSnapshot){
          console.log(childSnapshot.val());
    });
  });