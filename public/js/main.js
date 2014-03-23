$(document).ready(function() {

  $('.fullheight').css('height', (window.innerHeight - 120).toString() + 'px');

  $(window).resize(function() {
  	$('.fullheight').css('height', (window.innerHeight - 120).toString() + 'px');
  });

  $('.filters-button').click(function() {
  	$('#filter-box').toggleClass('hidden');
  })

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
	var map = new google.maps.Map(mapDiv, mapOptions);

	// Create the DIV to hold the control and
	// call the HomeControl() constructor passing
	// in this DIV.
	var homeControlDiv = document.createElement('div');
	var homeControl = new HomeControl(homeControlDiv, map);

	homeControlDiv.index = 1;
	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);

	$.ajax({
		url: "http://ec2-54-195-116-140.eu-west-1.compute.amazonaws.com/locations/?limit=40"
	})
	.done(function( data ) {
		var happy = true;
		for (var i = 0; i < data.length; i++) {
    		if(data[i].location !== null) {
    			console.log(data[i]);
    			
    			//we have a lat long
				happy = 'neutral';

				//http://ec2-54-195-116-140.eu-west-1.compute.amazonaws.com/currentReading?location_id=18
				console.log(data[i]);
				var placeid = data[i].id;
				
				if(placeid == undefined) {
					var placeid = data[i].id;
				}
				placeid = data[i].id;

				if(location == undefined) {
					var location = data[i].location;
				}
				location = data[i].location;

				if(locationid == undefined) {
					var locationid = data[i].id;
				}
				locationid = data[i].id;

				if(placeid == undefined) {
					var placeid = data[i].id;
				}
				placeid = data[i].id;

				console.log(location);

				if(name == undefined) {
					var name = data[i].name;
				}
				name = data[i].name;
				console.log(name);

				$.ajax({
					url: "http://ec2-54-195-116-140.eu-west-1.compute.amazonaws.com/currentReading?location_id="+placeid.toString(),
					async: false
				}).done(function(data) {
					var currentdata = data;
					$.ajax({
						url: "http://ec2-54-195-116-140.eu-west-1.compute.amazonaws.com/stats/getStats?location_id="+placeid.toString()+'&dow='+(new Date().getDay() + 1).toString()+'&hour='+new Date().getHours().toString(),
						async: false
						}).done(function(data) {
							console.log(currentdata);
						if(currentdata[0].reading <= data.lower_whisker) {
							happy = 'veryhappy';
						} else if(currentdata[0].reading <= data.lower_quartile) {
							happy = 'happy';
						} else if(currentdata[0].reading >= data.lower_quartile && currentdata[0].reading <= data.upper_quartile) {
							happy = 'neutral';
						} else if(currentdata[0].reading >= data.upper_quartile) {
							happy = 'sad';
						} else {
							happy = 'verysad';
						}

						if(properties == undefined) {
							var properties = {};
						}

						properties = {
					        position: new google.maps.LatLng(location.x, location.y),
					        map: map,
					        title: name,
					        locationid: this.locationid,
					        icon: 'img/' + happy + '_50.png',
					        happy: happy
						};
						var marker = new google.maps.Marker(properties);
						console.log(properties);

						that = properties;

						google.maps.event.addListener(marker, 'click', function() {
						    var that = this;
						    require(["d3"], function(d3) {
							  locationname = that.title;

							  $.ajax({
								url: "http://ec2-54-195-116-140.eu-west-1.compute.amazonaws.com/stats/getStats?location_id="+locationid.toString()+'&dow='+(new Date().getDay() + 1).toString()+'&hour='+new Date().getHours().toString()
							  }).done(function(data) {
							  	$('#min_power').html(data.min);
							  	$('#max_power').html(data.max);
							  	$('#location_name').html(locationname);

							  	$('.home-left-content-initial').css('display', 'none');
							  	$('.home-left-content').removeClass('home-left-content');

							  	$('.is-happy').removeClass('happy-background');
							  	$('.is-happy').removeClass('sad-background');
							  	$('.is-happy').removeClass('veryhappy-background');
							  	$('.is-happy').removeClass('verysad-background');
							  	$('.is-happy').removeClass('neutral-background');
							  	$('.is-happy').addClass(that.happy+'-background');
							  });
							});
						});
					});
				})
    		}
		}
	});
  }

});
