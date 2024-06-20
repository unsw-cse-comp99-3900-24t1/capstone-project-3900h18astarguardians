// import React, { useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { UserContext } from '../App';
// import TextModal from '../components/TextModal';
// import { getUserStore, putUserStore } from '../helpers';
// import { v4 as uuidv4 } from 'uuid';
// import PresentationCard from '../components/PresentationCard';
// import Container from '@mui/material/Container';
// import { CssBaseline, Fab } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
import { Scheduler } from "@aldabil/react-scheduler";
import RoomTimetable from "../components/RoomTimetable";
import { Box, Button, MenuItem, Select } from "@mui/material";
import { useState, useEffect } from "react";
import { request } from "../utils/axios";


const Dashboard = () => {
  // let 
  let [selectedDate, setSelectedDate] = useState(new Date());
  let [currLevel, setCurrLevel] = useState(1);

  const handleChange = () => {
    console.log('clicked');
  }
  // const [rooms, setRooms] = useState([]);
  // const [bookings, setBookings] = useState([]);

  // useEffect(() => {
  //   const fetchRoomsAndBookings = async () => {
  //     const {
  //       data: { rooms },
  //     } = await request.get("/rooms");
  //     const {
  //       data: { bookings },
  //     } = await request.get("/bookings");
  //     setRooms(rooms);
  //     setBookings(bookings);
  //   };

  //   fetchRoomsAndBookings();
  // }, []);

  // console.log(rooms);
  console.log(selectedDate.getMonth());
  return <>
    <Box sx={{display: 'flex', alignItems: 'center', gap: '25px'}}>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={currLevel}
      label="Level"
      onChange={handleChange}
        >
      <MenuItem value={1}>Level One</MenuItem>
      <MenuItem value={2}>Level Two</MenuItem>
      <MenuItem value={33}>Level Three</MenuItem>
    </Select>
      <Box>
        {`${selectedDate.getDate()}/${selectedDate.getMonth()+1}/${selectedDate.getFullYear()}`}
      </Box>
      <Button variant="outlined">
        &lt;
      </Button>
      <Button variant="outlined">
        &gt; 
      </Button>

    </Box>
    <RoomTimetable />
  </>
}

export default Dashboard;
