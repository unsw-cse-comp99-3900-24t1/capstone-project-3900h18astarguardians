import RoomTimetable from "../components/RoomTimetable";
import { Box, Button, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import "../styles/Dashboard.css";

const Dashboard = () => {
  let [selectedDate, setSelectedDate] = useState(new Date());
  let [currLevel, setCurrLevel] = useState(1);

  const handleChange = (event: SelectChangeEvent) => {
    setCurrLevel(Number(event.target.value));
  };

  const handleDateChangeForward = () => {
    setSelectedDate(prevDate => {
      const nextDay = new Date(prevDate);
      nextDay.setDate(prevDate.getDate() + 1);
      return nextDay;
    });
  };

  const handleDateChangeBackwards = () => {
    setSelectedDate(prevDate => {
      const nextDay = new Date(prevDate);
      nextDay.setDate(prevDate.getDate() - 1);
      return nextDay;
    });
  };

  return (
    <>
      <div className="scheduler-container">
        <Box sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '25px' }}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={currLevel.toString()}
            label="Level"
            onChange={handleChange}>
            <MenuItem value={1}>Level One</MenuItem>
            <MenuItem value={2}>Level Two</MenuItem>
            <MenuItem value={3}>Level Three</MenuItem>
            <MenuItem value={4}>Level Four</MenuItem>
            <MenuItem value={5}>Level Five</MenuItem>
          </Select>
          <Box>
            {`${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`}
          </Box>
          <Button variant="outlined" onClick={handleDateChangeBackwards}>
            &lt;
          </Button>
          <Button variant="outlined" onClick={handleDateChangeForward}>
            &gt;
          </Button>
        </Box>
        <RoomTimetable selectedDate={selectedDate} currLevel={currLevel}/>
      </div>
    </>
  );
}

export default Dashboard;