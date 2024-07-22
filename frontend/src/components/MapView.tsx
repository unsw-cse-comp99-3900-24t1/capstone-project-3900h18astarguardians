import React from "react";

interface MapViewProps {
    currLevel: number;
}

const MapView: React.FC<MapViewProps> = ({ currLevel }) => {
    const imageUrl = `http://localhost:5000/l${currLevel}.png`

    return (
        <>
            <img src={imageUrl}></img>
        </>
    );
};

export default MapView;