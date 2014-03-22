$(document).ready(function() {

  $('.fullheight').css('height', (window.innerHeight - 120).toString() + 'px');

  $(window).resize(function() {
  	$('.fullheight').css('height', (window.innerHeight - 120).toString() + 'px');
  });

  if($("#homepage-flag").length > 0) {
    //awesome - we're on the homepage, lets start mapping this shizz

    var Glasgow = new google.maps.LatLng(55.8580,-4.2590);

    /**
	 * The HomeControl adds a control to the map that simply
	 * returns the user to Glasgow. This constructor takes
	 * the control DIV as an argument.
	 * @constructor
	 */
	function HomeControl(controlDiv, map) {

	  // Set CSS styles for the DIV containing the control
	  // Setting padding to 5 px will offset the control
	  // from the edge of the map
	  controlDiv.style.padding = '5px';

	  // Set CSS for the control border
	  var controlUI = document.createElement('div');
	  controlUI.style.backgroundColor = 'white';
	  controlUI.style.borderStyle = 'solid';
	  controlUI.style.borderWidth = '2px';
	  controlUI.style.cursor = 'pointer';
	  controlUI.style.textAlign = 'center';
	  controlUI.title = 'Click to set the map to Home';
	  controlDiv.appendChild(controlUI);

	  // Set CSS for the control interior
	  var controlText = document.createElement('div');
	  controlText.style.fontFamily = 'Arial,sans-serif';
	  controlText.style.fontSize = '12px';
	  controlText.style.paddingLeft = '4px';
	  controlText.style.paddingRight = '4px';
	  controlText.innerHTML = '<b>Home</b>';
	  controlUI.appendChild(controlText);

	  // Setup the click event listeners: simply set the map to
	  // Glasgow
	  google.maps.event.addDomListener(controlUI, 'click', function() {
	    map.setCenter(Glasgow)
	  });

	}

	var mapDiv = document.getElementById('map-canvas');
	var mapOptions = {
	zoom: 11,
	center: Glasgow
	}
	map = new google.maps.Map(mapDiv, mapOptions);

	// Create the DIV to hold the control and
	// call the HomeControl() constructor passing
	// in this DIV.
	var homeControlDiv = document.createElement('div');
	var homeControl = new HomeControl(homeControlDiv, map);

	homeControlDiv.index = 1;
	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);

	$.ajax({
		url: "http://happyhomes-api.herokuapp.com/locations/?limit=40"
	})
	.done(function( data ) {
		for (var i = 0; i < data.length; i++) {
    		if(data[i].location !== null) {
    			console.log(data[i]);
    			//we have a lat long
				var properties = {
			        position: new google.maps.LatLng(data[i].location.x, data[i].location.y),
			        map: map,
			        title: data[i].name,
			        locationid: data[i].id
			        //icon: 'icon.jpg'
				};
				var marker = new google.maps.Marker(properties);

				google.maps.event.addListener(marker, 'click', function() {
				    var that = this;
				    require(["d3"], function(d3) {
					  locationid = that.locationid;
					  locationname = that.title;

					  $.ajax({
						url: "http://happyhomes-api.herokuapp.com/stats/getStats?location_id="+locationid.toString()
					  }).done(function(data) {
					  	$('#min_power').html(data.min);
					  	$('#max_power').html(data.max);
					  	$('#location_name').html(locationname);

					  	$('.home-left-content').addClass('col-md-2');
					  	$('.home-left-content').removeClass('home-left-content');
					  	$('.home-right-content').css('display', '');
					  	$('.home-right-content').removeClass('col-md-12');
					  	$('.home-right-content').addClass('col-md-10');

					  });
					});
				});
    		}
		}
	});
  }

});
