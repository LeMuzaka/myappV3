$(document).ready(function(){

    $("#SearchCenter").on("click",function(){

        if(navigator.geolocation==undefined)
        {
            alert("Geolocation undefined");
        }

        else
        {
            alert("Geolocation Available");
            navigator.geolocation.getCurrentPosition(userLocated,locationError);

            function userLocated(position)
            {
                var latitude= position.coords.latitude;
                var longitude= position.coords.longitude;
                //alert("Latitude is:"+latitude+",Longitude is:"+longitude);

                var mymap = L.map('map').setView([latitude, longitude], 12);
                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
                {
                    maxZoom: 19,
                    attribution: 'Map data &copy;'+
                    '<a href="https://www.openstreetmap.org/">OpenStreetMap</a>'+
                    'contributors,<a href="https://creativecommons.org/licenses'+
                    '/by-sa/2.0/">CC-BY-SA</a>,Imagery © <a href="https://'+
                    'www.mapbox.com/">Mapbox</a>',
                    id: 'mapbox.streets',
                    accessToken:'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYyc'+
                    'XBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
                }).addTo(mymap);

                var myLocationIcon = new L.Icon({
                         iconUrl: '../mapimg/icons8-street-view-filled-50.png',
                         shadowUrl: '../mapimg/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                      });


                var marker = L.marker([latitude, longitude], {icon: myLocationIcon}).addTo(mymap);
                marker.bindPopup("you are here").openPopup();


                var circle = L.circle([latitude, longitude], {
                   color:'rgb(66, 238, 72)',
                   // fillColor: '#',
                  fillOpacity: 0.2,
                  radius: 10000
              }).addTo(mymap);


                var xhttp = new XMLHttpRequest();
                var url = "../json/hospitals.json";
                xhttp.open("GET", url, false);
                xhttp.send();


                var obj = JSON.parse(xhttp.responseText);

                for (i in obj.hospitals)
                {
                    var name = obj.hospitals[i].name;
                    var hlat = obj.hospitals[i].latitude;
                    var hlon = obj.hospitals[i].longitude;
                    var openinghrs = obj.hospitals[i].openinghrs;
                    var closinghrs = obj.hospitals[i].closinghrs;
                    var phone = obj.hospitals[i].phone;
                    var address = obj.hospitals[i].address;


                    var distance = getDistanceFromLatLonInKm(latitude, longitude, hlat, hlon);

                    if(distance <= 10)
                    {
                      var rehabIcon = new L.Icon({
                              iconUrl: '../mapimg/icons8-clinic-48.png',
                              shadowUrl: '../mapimg/marker-shadow.png',
                              iconSize: [25, 41],
                              iconAnchor: [12, 41],
                              popupAnchor: [1, -34],
                              shadowSize: [41, 41]
                            });

                            var clinic = new L.marker([hlat, hlon], {icon: rehabIcon});
                            clinic.on('click', markerOnClick).addTo(mymap);

                            if(openinghrs == "")
                            {
                              clinic.bindPopup("<b>" + name + "</b><br>" + "Opens 24hrs" + "<br>" + "Address: " + address + "<br>" + "Phone: " + phone);
                            }
                            else if(openinghrs == "-")
                            {
                              clinic.bindPopup("<b>" + name + "</b><br>" + "(No opening/closing information)" + "<br>" + "Address: " + address + "<br>" + "Phone: " + phone);
                            }
                            else
                            {
                              clinic.bindPopup("<b>" + name + "</b><br>" + "Opens " + openinghrs + " - " + closinghrs + "<br>" + "Address: " + address + "<br>" + "Phone: " + phone);
                            }
                    }


            }

            function markerOnClick(e)
            {
                  L.Routing.control({
                      waypoints: [
                          L.latLng(latitude, longitude),
                          L.latLng(e.latlng.lat, e.latlng.lng)
                      ],
                      addWaypoints: false,
                      draggableWaypoints: false
                  }).addTo(mymap);

                }

                function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2)
                {
                    var R = 6371; // Radius of the earth in km
                    var dLat = deg2rad(lat2-lat1);  // deg2rad below
                    var dLon = deg2rad(lon2-lon1);
                    var a =
                      Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                      Math.sin(dLon/2) * Math.sin(dLon/2)
                      ;
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                    var d = R * c; // Distance in km
                    return d;
                }

                function deg2rad(deg)
                {
                    return deg * (Math.PI/180)
                }

        }
            function locationError(error)
            {
                switch(error.code)
                {
                    case error.PERMISSION_DENIED:
                    alert("Permission Denied-"+error.message);
                    break;

                    case error.POSITION_UNAVAILABLE:
                    alert("Position Not Available"+error.message);
                    break;

                    case error.TIMEOUT:
                    alert("Requested "+error.message);
                    break;
                }
            }
        }


    });

}) ;
