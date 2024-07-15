import React, { useEffect, useState } from 'react';
import { useGlobalContext } from "../utils/context";
import { request } from "../utils/axios";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, Checkbox, FormControlLabel, Slider, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { BarChart } from '@mui/x-charts/BarChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "../styles/Reports.css"
const Reports  = () => {

  const [numRooms, setNumRooms] = React.useState(3);
  const [numUsers, setNumUsers] = React.useState(3);
  const { token } = useGlobalContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs().subtract(7, 'day'));
  const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs());
  const [mostCommonRooms, setMostCommonRooms] = useState([]);
  const [mostCommonUsers, setMostCommonUsers] = useState([]);
  const [nonCheckedInUsers, setNonCheckedInUsers] = useState([]);

  const handleItemNbChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setNumRooms(newValue);
  };

  const handleNumUsersChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setNumUsers(newValue);
  };


  // ensure token tells us an admin is viewing this page
  useEffect(() => {
    if (token?.type === "admin") {
      setIsAdmin(true);
    }
    // fetchReports();
  }, [])

  // console.log(value[0]?.toISOString);

  const fetchReports = async (start: Date, end: Date) => {
    const usageResponse = await request.post(`/bookings/usageReport?start=${start.toISOString()}&end=${end.toISOString()}`);
    return usageResponse.data;
  }
  
  const generateReports = async () => {
    const reportsData = await fetchReports(startDate?.toDate() ?? new Date() , endDate?.toDate() ?? new Date());
    console.log(reportsData);

    // set most common rooms
    setMostCommonRooms(reportsData.mostCommonlyBookedRooms.map((room: any) => {
      return {
        name: room.room.name,
        count: room.count,
      }
    })
    .sort((a: { count: number }, b: { count: number }) => b.count - a.count)
  );

    // set most common rooms
    setMostCommonUsers(reportsData.mostCommonUsers.map((user: any) => {
      return {
        name: user.doc.name,
        count: user.number_of_bookings,
      }
    })
    .sort((a: { count: number }, b: { count: number }) => b.count - a.count)
  );

  setNonCheckedInUsers(reportsData.notCheckedIn.map((booking: any) => {
    const start = new Date(booking.start);
    const end = new Date(booking.end);
    const day = String(start.getDate()).padStart(2, '0');
    const month = String(start.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = start.getFullYear();


    return {
      date: `${day}/${month}/${year}`,
      start: `${start.getHours() % 12}${start.getHours() >= 12 ? 'pm' : 'am'}`,
      end: `${end.getHours() % 12}${end.getHours() >= 12 ? 'pm' : 'am'}`,
      room: booking.room.name,
      name: booking.user.name,
      email: booking.user.email,
    }
  }));

  }


  return <div className="robotoFont">
   {!isAdmin && <h1>Only admins can see Usage reports!</h1>}
   {isAdmin &&
    <>
      <Box sx={{
        display: 'flex',
        gap: '20px',
        marginTop: '20px'
      }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Start"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
        />
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="End"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
        />
      </LocalizationProvider>
      <Button variant='contained' onClick={generateReports}>Generate Report</Button>
      </Box>
      <Box sx={{ width: '90%' }}>
      <BarChart
        height={300}
        dataset={mostCommonRooms.slice(0,numRooms)}
        xAxis={[{ scaleType: 'band', dataKey: 'name' }]}
        series={[{ dataKey: 'count', label: 'Most booked rooms' }]}
        skipAnimation={false}
      />
      <Typography id="input-item-number" gutterBottom>
        Number of items
      </Typography>
      <Slider
        value={numRooms}
        onChange={handleItemNbChange}
        valueLabelDisplay="auto"
        min={1}
        max={mostCommonRooms.length}
        aria-labelledby="input-item-number"
      />
    </Box>
    <Box sx={{ width: '90%' }}>
      <BarChart
        height={300}
        dataset={mostCommonUsers.slice(0,numUsers)}
        xAxis={[{ scaleType: 'band', dataKey: 'name' }]}
        series={[{ dataKey: 'count', label: 'Most booked rooms' }]}
        skipAnimation={false}
      />
      <Typography id="input-item-number" gutterBottom>
        Number of items
      </Typography>
      <Slider
        value={numUsers}
        onChange={handleNumUsersChange}
        valueLabelDisplay="auto"
        min={1}
        max={mostCommonUsers.length}
        aria-labelledby="input-item-number"
      />
    </Box>
    {nonCheckedInUsers.length > 0 && <h1>Non-Checked In Users</h1>}
    {
      nonCheckedInUsers.map((item: any, index) => (
        // <>item.start</>
        <Accordion key={index}>
        <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
        >
          <strong>Booking at {item.room} for {item.name}</strong>
        </AccordionSummary>
        <AccordionDetails>
          <strong>Details:</strong> <br />
          Date: {item.date} <br />
          Start Time: {item.start}<br />
          End Time: {item.end}<br />
          Room: {item.room}<br />
          <strong>Checked In: False</strong>
        </AccordionDetails>
        <AccordionActions>
        <Button variant="outlined" color="error" onClick={() => console.log(item)}>
          Send Warning Email
        </Button>
      </AccordionActions>
      </Accordion>
      ))
    }  
    </>
  }
  </div>
};

export default Reports;

// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Slider from '@mui/material/Slider';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import { BarChart } from '@mui/x-charts/BarChart';

// export default function BarAnimation() {
//   const [seriesNb, setSeriesNb] = React.useState(2);
//   const [itemNb, setItemNb] = React.useState(5);
//   const [skipAnimation, setSkipAnimation] = React.useState(false);

//   const handleItemNbChange = (event: Event, newValue: number | number[]) => {
//     if (typeof newValue !== 'number') {
//       return;
//     }
//     setItemNb(newValue);
//   };
//   const handleSeriesNbChange = (event: Event, newValue: number | number[]) => {
//     if (typeof newValue !== 'number') {
//       return;
//     }
//     setSeriesNb(newValue);
//   };

//   return (
//     <Box sx={{ width: '100%' }}>
//       <BarChart
//         height={300}
//         series={series
//           .slice(0, seriesNb)
//           .map((s) => ({ ...s, data: s.data.slice(0, itemNb) }))}
//         skipAnimation={skipAnimation}
//       />
//       <FormControlLabel
//         checked={skipAnimation}
//         control={
//           <Checkbox onChange={(event) => setSkipAnimation(event.target.checked)} />
//         }
//         label="skipAnimation"
//         labelPlacement="end"
//       />
//       <Typography id="input-item-number" gutterBottom>
//         Number of items
//       </Typography>
//       <Slider
//         value={itemNb}
//         onChange={handleItemNbChange}
//         valueLabelDisplay="auto"
//         min={1}
//         max={20}
//         aria-labelledby="input-item-number"
//       />
//       <Typography id="input-series-number" gutterBottom>
//         Number of series
//       </Typography>
//       <Slider
//         value={seriesNb}
//         onChange={handleSeriesNbChange}
//         valueLabelDisplay="auto"
//         min={1}
//         max={10}
//         aria-labelledby="input-series-number"
//       />
//     </Box>
//   );
// }


