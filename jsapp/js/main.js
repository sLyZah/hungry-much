/*jslint regexp: true, vars: true, white: true, browser: true */
/*jshint nonstandard: true, browser: true, boss: true */
/*global jQuery */

( function ( $ ) {

	"use strict";

	// VARIABLES
	var signInBoxTop 			= '-400px',
		signInBoxAnimateSpeed 	= 600,
		viewAnimateSpeed  		= 600;


	// METHODS


	// Hide sign in box
	var hideSignInBox = function() {

		$('.message').animate({'top' : signInBoxTop}, signInBoxAnimateSpeed);

	};




	// ONLOAD
	$( function () {



		// ********************************************************************
		// Views actions like show and hide
		// ********************************************************************

		// Hide all view except the first view
		$('.view').hide();

		$('#home').show();

		// Display a view when the user click on showView
		$('.showView').on('click', function() {

			var view = $(this).attr('href');

			$('.view').fadeOut(viewAnimateSpeed).hide();

			$(view).fadeIn(viewAnimateSpeed);

		});



		// ********************************************************************
		// All Sign In actions here
		// ********************************************************************

		// Show the sign in box
		$('#signIn').on('click', function(e) {

			e.preventDefault();

			$('.message').animate({'top' : '100px'}, signInBoxAnimateSpeed);

		});


		// Hide sign in box
		$('.btn-cancel').on('click', function() {
			
			hideSignInBox();

		});

		// Validate the sign in box
		$('#formSignIn').on('submit', function() {

			// Add user inscription here


			alert('sign in yeah');

			//$('#signIn').addClass('disabled');


			hideSignInBox();

			return false;

		});
	
	

	} );

}( jQuery ) );