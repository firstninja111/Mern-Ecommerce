import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { darken } from "@mui/material/styles";
import React, { useState, useEffect, useCallback } from "react";


const LocationsListItem = (props) => {
  const {
    selectedLocation,
    setSelectedLocation,
    location,
    calculateDistance,
    position,
    travelMode,
    changeTravelDistance,
    travelDistance,
  } = props;

  const [travelTime, changeTravelTime] = useState("");

  useEffect(() => {
    calculateTravelTime(position, location, travelMode);
  }, [position, location, travelMode])

  const calculateTravelTime = useCallback((position, store, travelMode) => {
    var origin = new google.maps.LatLng( position.coordinates.lat, position.coordinates.lng ); // using google.maps.LatLng class
    var destination = new google.maps.LatLng(parseFloat(store.coordinateLat), parseFloat(store.coordinateLng)); // using string
    
    // working case
    // var origin = new google.maps.LatLng(37.7699298, -122.4469157);
    // var destination = new google.maps.LatLng(37.7683909618184, -122.51089453697205);

    var directionsService = new google.maps.DirectionsService();

    var request = {
      origin: origin, // LatLng|string
      destination: destination, // LatLng|string
      travelMode: travelMode
    };

    directionsService.route( request, function( response, status ) {
      if ( status === "OK" ) {
        var point = response.routes[ 0 ].legs[ 0 ];
        changeTravelTime(point.duration.text);
        changeTravelDistance(point.distance.text);
      }
    });
  }, [position]);

  const selectStore = () => {
    if(selectedLocation !== location) {
      setSelectedLocation(location);
    }else{
      setSelectedLocation(undefined);
    }
  }

  return (
    <>
      <Box className="store_item_container"
        sx={{
          p: 2,
          backgroundColor: (theme) => {
            if (selectedLocation?._id === location._id) {
              return darken(theme.palette.background.default, 0.08);
            }
            return theme.palette.background.paper;
          },
        }}
        key={`location-${location._id}`}
        onClick={() => selectStore()}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            component="span"
            variant="body2"
            color="textPrimary"
            gutterBottom
          >
            {location.name}
          </Typography>

          <Typography
            component="span"
            variant="body2"
            color="textPrimary"
            gutterBottom
          >
            {location.address}
          </Typography>
        </Box>
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="textPrimary">
              {travelDistance}
            </Typography>
            <Typography variant="body2" color="textPrimary">
              {travelTime}
            </Typography>
          </Box>
        </>
      </Box>
      <Divider />
    </>
  );
};

export default LocationsListItem;
