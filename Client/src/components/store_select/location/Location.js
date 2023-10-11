import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import React, { useState, useEffect } from "react";
import InitialPosition from "./initial-position/InitialPosition";
import LocationsList from "./locations-list/LocationsList";
import Map from "./map/Map";

import TravelModes from "./travel-modes/TravelModes";

const Location = (props) => {
  const {
    filteredStores,
    position,
    setPosition,
    selectedLocation,
    setSelectedLocation,
    } = props

  const [travelMode, setTravelMode] = useState(google.maps.TravelMode.DRIVING.toString());
  const [travelDistance, changeTravelDistance] = useState("");

  const calculateDistance = (position, store) => {
    var R = 3958.8;
    var rlat1 = position.coordinates.lat * (Math.PI/180);
    var rlat2 = store.coordinateLat * (Math.PI/180);
    var difflat = rlat2-rlat1;
    var difflon = (store.coordinateLng-position.coordinates.lng) * (Math.PI/180);
    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2))).toFixed(4);
    return d;
  }
  
  return (
    <Box>
      <Grid container spacing={8}>
        <Grid item xs={12} md={12}>
          <InitialPosition position={position} setPosition={setPosition} />
          <TravelModes travelMode={travelMode} setTravelMode={setTravelMode} />
          {position !== undefined && 
            <LocationsList
              locations={filteredStores}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              position={position}
              travelMode={travelMode}
              calculateDistance={calculateDistance}
              changeTravelDistance={changeTravelDistance}
              travelDistance={travelDistance}
            />
          }
        </Grid>
        <Grid item xs={12} md={12}>
          { position !== undefined && 
            <Map
              locations={filteredStores}
              position={position}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              calculateDistance={calculateDistance}
              travelDistance={travelDistance}
            />
          }
        </Grid>
      </Grid>
    </Box>
  );
};

export default Location;
