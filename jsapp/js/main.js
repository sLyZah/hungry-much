/*jslint regexp: true, vars: true, white: true, browser: true */
/*jshint nonstandard: true, browser: true, boss: true */
/*global jQuery */

( function ( $ ) {

	"use strict";

	// VARIABLES
	var signInBoxTop 			= '-400px',
		signInBoxAnimateSpeed 	= 600,
		viewAnimateSpeed  		= 600,
		groupAlreadyLoaded 		= false,

		isBoxShow				= false,

		currentUser				= false,

		currentGroup			= 0;
		//userAuth = sessionStorage.getItem('userAuth');



	// METHODS


	// ********************************************************************
	// Hide the box
	// ********************************************************************
	var hideBox = function() {

		$('.box').animate({'top' : signInBoxTop}, signInBoxAnimateSpeed);

	};



	// ********************************************************************
	// Loading all groups and display and html table
	// ********************************************************************
	var loadAllGroups = function() {

		if(!groupAlreadyLoaded) {

			var groupsCounter 	= 0,
				html 			= '';

			$('body').hmapi('getAllGroup', function(data){

				console.log(data);

				groupsCounter = data.length;

				if(groupsCounter !== 0) {

					groupAlreadyLoaded = true;

					$('#groups tbody').first('tr').hide();

					for(var i = 0; i < groupsCounter; i++) {

						html+= '<tr><td>' + data[i].name + '</td><td><a href="#hungry" class="btn btn-primary btn showView enterGroup" data-groupid="' + data[i].id + '">Join</a></td></tr>';

					}

					$(html).insertAfter( $('#groups tbody').first('tr') );
					
				}         

            });

		}

	};


	var startViews = function() {

		$('.view').hide();

		$('#home').show();

	};



	// ONLOAD
	$( function () {


		// ********************************************************************
		// Views actions (show and hide)
		// ********************************************************************

		// Hide all view except the first view
		startViews();

		// Display a view when the user click on showView
		$('body').on('click', '.showView', function() {

			var view = $(this).attr('href');

			$('.view').fadeOut(viewAnimateSpeed).hide();

			$(view).fadeIn(viewAnimateSpeed);

		});

		// If the user is logged, we show the group page
		/*
		if(currentUser) {
			
			console.log('loggé');

			$('#home').hide();

			$('#groups').show();

			new loadAllGroups();


			$('<a href="#" id="loggOut">Logout</a>').insertAfter('header');
		}
		*/



		// ********************************************************************
		// All loggin/loggout actions here
		// ********************************************************************
		
		// Hide box on cancel button click
		$('.btn-cancel').on('click', function() {
			
			hideBox();

			isBoxShow = false;

		});

		// Show the sign in box
		$('#signIn').on('click', function(e) {

			e.preventDefault();

			if(isBoxShow) hideBox();

			$('.boxSignIn').animate({'top' : '100px'}, signInBoxAnimateSpeed);

			isBoxShow = true;

		});

		// Validate the sign in box
		$('#formSignIn').on('submit', function() {

			// Add user inscription here

			var user = { 	
							'name': $('#formSignIn #inputUsername').val(),
							'email': $('#formSignIn #inputEmail').val(),
							'password': $('#formSignIn #inputPassword').val()
						};


			// not empty
			if(user.name != '' && user.email != '' && user.password != '') {


				// add in data base
				$('body').hmapi('addUser', user, function(data){


					// Logg the membre
					currentUser = data.id;

					new loadAllGroups();

					hideBox();

					$('#home').hide();

					$('#groups').show();

					$(' <a href="#" id="loggOut">Logout</a> <a href="#options" class="showView" id="btnOptions">Options</a> ').appendTo('header .span12');
							

				});

			}
			else{

				console.log('empty');

			}

			return false;

		});


		// Active the sigin form submit if the form is not empty
		$('#formSignIn input').on('keyup', function() {


			if( $('#formSignIn #inputUsername').val() != '' && $('#formSignIn #inputPassword').val() != '' && $('#formSignIn #inputPassword').val()) {

				$('#btnSignInSubmit').removeAttr('disabled');

			}
			else {

				$('#btnSignInSubmit').attr('disabled', 'disabled');			
			}

		});


		// Show the loggin box
		$('#loggIn').on('click', function(e) {

			e.preventDefault();

			if(isBoxShow) hideBox();

			$('.boxLoggIn').animate({'top' : '100px'}, signInBoxAnimateSpeed);

			isBoxShow = true;

		});


		// Validate the loggin in box
		$('#formLoggIn').on('submit', function() {

			// Checking user login here
			new loadAllGroups();

			hideBox();

			currentUser = 1;

			$('#home').hide();

			$('#groups').show();

			$(' <a href="#" id="loggOut">Logout</a> <a href="#options" class="showView" id="btnOptions">Options</a> ').appendTo('header .span12');

			return false;

		});


		// Logout user
		$('body').on('click', '#loggOut', function(e) {

			$('header .span12 a').remove();

			startViews();

			console.log('loggout');

			currentUser = false;

		});



		// ********************************************************************
		// List group page
		// ********************************************************************

		$('#btnJoin').on('click', function(){

			new loadAllGroups();

		}); // list group



		// ********************************************************************
		// Enter in a group
		// ********************************************************************

		$('body').on('click', '.enterGroup', function() {
		
			currentGroup = $(this).data('groupid');

			console.log('current room ' + currentGroup);

		}); // enter group



		// ********************************************************************
		// A user say I WANNA KILL FOR FOOD
		// ********************************************************************
		$('#btnHungry').on('click', function() {

			var room = {	'userId': 1, 'groupId': currentGroup };

			$('body').hmapi('userIsHungryInGroupId', room, function(data){


				console.log(data);


			});


		}); // hungry



		// ********************************************************************
		// Options page
		// ********************************************************************
		$('body').on('click', '#btnOptions', function() {

			console.log(currentUser);

			$('body').hmapi('getUserById', currentUser, function(data){

				console.log(data);

				$('#options #inputName').val(data.name);

				$('#options #inputEmail').val(data.email);

			});

		});





	} );

}( jQuery ) );