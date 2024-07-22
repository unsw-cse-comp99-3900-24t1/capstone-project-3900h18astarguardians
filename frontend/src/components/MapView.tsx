import { Box, Button } from "@mui/material";
import React from "react";
import "../styles/MapView.css"


interface MapViewProps {
    currLevel: number;
}

const MapView: React.FC<MapViewProps> = ({ currLevel }) => {
    const imageUrl = `http://localhost:5000/l${currLevel}.png`

  return (
    <>
      <Box sx={{position: 'relative'}}>
        <img src={imageUrl} />
        <button className="mapBtn" id="r301A">
        </button>
        {/* <Button variant="outlined" size="small" sx={{position: 'absolute', left:'50px', top:'240px', height: '55px'}}> */}
        {/* </Button> */}
      </Box>

    </>
  );
};

export default MapView;