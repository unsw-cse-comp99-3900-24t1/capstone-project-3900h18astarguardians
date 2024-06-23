import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { request } from "../utils/axios";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type Booking = {
  date: string;
  start_time: string;
  end_time: string;
  room: string;
  description: string;
};

const MyBookings  = () => {
  // fetch data
  const [bookings, setBookings] = useState<Booking[]>([]);


  const navigate = useNavigate();
  const checkLoggedIn = async () => {
    try {
      await request.get("/users/showMe");
    } catch (e) {
      console.log(e);
    }
  };
  const getBookings = async () => {
    try {
      const resp = await request.get("/bookings/showAllMyBookings");
      let data = resp.data.bookings;
      console.log(data);
      // console.log(data);
      // let data = resp.data.bookings;
      data.sort((a, b) => {
        return new Date(a.start) - new Date(b.start);
      })
      let newBookings: Booking[] = [];
      for (let i = 0; i < data.length; i++) {
        // set bookings
        let startTime = new Date(data[i].start);
        let endTime = new Date(data[i].end);
        let roomName = data[i].room.name;


        `${startTime.getHours() % 12}${startTime.getHours() >= 12 ? 'pm' : 'am'}`
        let description = 'desc not implemented';
        let b: Booking = {
          date: `${String(startTime.getDate()).padStart(2, '0')}/${String(startTime.getMonth() + 1).padStart(2, '0')}/${startTime.getFullYear()}`,
          start_time: `${startTime.getHours() % 12}${startTime.getHours() >= 12 ? 'pm' : 'am'}`,
          end_time: `${endTime.getHours() % 12}${endTime.getHours() >= 12 ? 'pm' : 'am'}`,
          room: roomName,
          description: 'description not implemented',
        }


        newBookings.push(b)
      }
      // let date = data.book
      setBookings(newBookings);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    checkLoggedIn();
    getBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return <>
    {
      bookings.map((item, index) => (
        <Accordion key={index}>
          <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          >
            <strong>Booking for {item.start_time} : {item.date} at {item.room}</strong>
          </AccordionSummary>
          <AccordionDetails>
            <strong>Details:</strong> <br /><br />
            Start Time: {item.start_time}<br />
            End Time: {item.end_time}<br />
            Room: {item.room}<br />
            <strong>Checked In: False</strong>
          </AccordionDetails>
          <AccordionActions>
          <Button variant="outlined" color="error">
            Cancel Booking
          </Button>
            <Button variant="contained" color="success" disabled={true} >Check In</Button>
        </AccordionActions>
        </Accordion>
      ))
    }
    {/* <Accordion >
      <AccordionSummary >
        Title
      </AccordionSummary>
      <AccordionDetails >
        <strong>Details 1</strong><br />
        Details 2
      </AccordionDetails>
    </Accordion> */}
    {/* <h1> |{}| </h1> */}
    {/* <h1> hi </h1> */}
  </>
};

export default MyBookings;
