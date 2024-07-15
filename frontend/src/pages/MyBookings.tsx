import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { request } from "../utils/axios";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useGlobalContext } from "../utils/context";
import exportIcs from '../utils/exportIcs'
import Box from "@mui/material/Box";

type Booking = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  room: string;
  description: string;
};
type OldBooking = {
  _id: string;
  start: string;
  end: string;
  room: string;
  description: string;
};

const AllFileBoxStyle = {
  ['text-align']: 'center',
  padding: '50px 0'
}

const MyBookings  = () => {
  const { displaySuccess, displayError } = useGlobalContext();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [oldBookings, setOldBookings] = useState<OldBooking[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState<string>('');

  const handleClickOpen = (id: string) => {
    setOpenDialog(id);
  };

  const handleClose = () => {
    setOpenDialog('');
  };

  const handleConfirm = (id: string) => {
    deleteBooking(id);
  };

  const checkLoggedIn = async () => {
    try {
      await request.get("/users/showMe");
    } catch (e) {
      console.log(e);
    }
  };

  const handleExportIcs = (event: Booking, oldBookings: OldBooking[]) => {
    const bookings = oldBookings.find(item => item._id === event.id)!
    console.log('item', event, oldBookings, bookings)
    exportIcs([bookings]);
    displaySuccess('success import ics file')
  }

  const handleAllExportIcs = (oldBookings: OldBooking[]) => {
    exportIcs(oldBookings);
    displaySuccess('success import ics file')
  }

  // NOTE: i think this function along with the same function in RoomTimetable
  // should be handled inside the Dashboard, instead of these components
  const deleteBooking = async (event_id: string) => {
    try {
      setBookings(bookings.filter(booking => booking.id !== event_id));
      // setIsLoading(true);
      const {
        data: { success },
      } = await request.delete(`/bookings/${event_id}`);
      if(success) {
        displaySuccess("Successfully delete bookings");
      }
    } catch(error) {
      console.error("Failed to delete bookings", error);
      displayError(`Failed to delete bookings`);
      setIsLoading(false);
    } finally {
      getBookings();
      setIsLoading(false);
    }
  }

  const getBookings = async () => {
    try {
      const resp = await request.get("/bookings/showAllMyBookings");
      let data = resp.data.bookings;
      let newBookings: Booking[] = [];
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      console.log('bookingsData', data);

      setOldBookings(data.filter((item) => new Date(item.start) > today));

      for (let i = data.length - 1; i >= 0; i--) {
        // set bookings
        let startTime = new Date(data[i].start);
        let endTime = new Date(data[i].end);
        let roomName = data[i].room.name;
        
        // only view bookings from today onward
        if (startTime <= today) {
          continue;
        }

        let description = 'desc not implemented';
        let b: Booking = {
          id: `${data[i]._id}`,
          date: `${String(startTime.getDate()).padStart(2, '0')}/${String(startTime.getMonth() + 1).padStart(2, '0')}/${startTime.getFullYear()}`,
          start_time: `${startTime.getHours() % 12}${startTime.getHours() >= 12 ? 'pm' : 'am'}`,
          end_time: `${endTime.getHours() % 12}${endTime.getHours() >= 12 ? 'pm' : 'am'}`,
          room: roomName,
          description: 'description not implemented',
        }

        newBookings.push(b);
      }
      // let date = data.book
      setBookings(newBookings);
      setIsLoading(false);
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
    {!isLoading && bookings.length === 0 &&
      <h1>You have no bookings</h1>
    }
    {isLoading && <h1>Loading your bookings ... <CircularProgress /></h1>}
    {
      !isLoading && bookings.map((item, index) => (
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
          <Button variant="outlined" color="error" onClick={() => handleClickOpen(item.id)}>
            Cancel Booking
          </Button>
          <Button variant="outlined" color="primary" onClick={()=> handleExportIcs(item, oldBookings)}>
            Export ICS File
          </Button>
          <Dialog
        open={openDialog === item.id}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to cancel this booking?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={() => handleConfirm(item.id)} color="primary" autoFocus>
            Yes
          </Button>
          {/* <Button onClick={handleConfirm(item.id)} color="primary" autoFocus>
            Yes
          </Button> */}
        </DialogActions>
      </Dialog>
          <Button variant="contained" color="success" disabled={true} >Check In</Button>
        </AccordionActions>
        </Accordion>
      ))
    }
    {!isLoading && bookings.length !== 0 &&
    <Box sx={AllFileBoxStyle}>
      <Button variant="outlined" color="primary" onClick={()=> handleAllExportIcs(oldBookings)}>
        Export ALL ICS File
      </Button>
    </Box>
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
