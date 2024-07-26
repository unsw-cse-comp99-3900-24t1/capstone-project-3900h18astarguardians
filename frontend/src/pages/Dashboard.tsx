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

  // Function to check if selectedDate is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isNextWeekSunday = (date: Date) => {
    const today = new Date();
    const nextSunday = new Date();
    // Calculate days to next Sunday (0 is Sunday, 1 is Monday, ..., 6 is Saturday)
    // If today is Sunday, set daysUntilNextSunday to 7 to ensure we're looking at next week's Sunday
    const daysUntilNextSunday = today.getDay() === 0 ? 7 : 7 - today.getDay();
    // Set nextSunday to the next week's Sunday by adding daysUntilNextSunday + 7 to ensure it's next week
    nextSunday.setDate(today.getDate() + daysUntilNextSunday + 7);

    // Check if the provided date is the same as next week's Sunday
    return date.getDate() === nextSunday.getDate() &&
      date.getMonth() === nextSunday.getMonth() &&
      date.getFullYear() === nextSunday.getFullYear();
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
          <Button variant="outlined" onClick={handleDateChangeBackwards} disabled={isToday(selectedDate)}>
            &lt;
          </Button>
          <Button variant="outlined" onClick={handleDateChangeForward} disabled={isNextWeekSunday(selectedDate)}>
            &gt;
          </Button>
        </Box>
        <RoomTimetable selectedDate={selectedDate} currLevel={currLevel} />
      </div>
    </>
  );
}

export default Dashboard;