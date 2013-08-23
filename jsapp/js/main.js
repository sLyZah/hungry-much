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

		userAuth				= true;
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

						html+= '<tr><td>' + data[i].name + '</td><td><a href="#hungry" class="btn btn-primary btn showView" data-groupId="' + data[i].id + '">Join</a></td></tr>';

					}

					$(html).insertAfter($('#groups tbody').first('tr'));
					
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
		if(userAuth) {
			
			console.log('loggé');

			$('#home').hide();

			$('#groups').show();

			new loadAllGroups();


			$('<a href="#" id="loggOut">Logout</a>').insertAfter('header');
		}




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


			alert('sign in yeah');

			//$('#signIn').addClass('disabled');


			hideBox();

			return false;

		});


		// Show the loggin box
		$('#loggIn').on('click', function(e) {

			e.preventDefault();

			if(isBoxShow) hideBox();

			$('.boxLoggIn').animate({'top' : '100px'}, signInBoxAnimateSpeed);

			isBoxShow = true;

		});


		// Logout user
		$('body').on('click', '#loggOut', function(e) {

			$('#loggOut').remove();

			startViews();


			console.log('loggout');

			userAuth = false;

		});


		// ********************************************************************
		// Liste group page
		// ********************************************************************

		$('#btnJoin').on('click', function(){

			new loadAllGroups();

		} );
	
	

	} );

}( jQuery ) );