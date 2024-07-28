import RoomTimetable from "../components/RoomTimetable";
import { Box, Button, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import "../styles/Dashboard.css";
import MapView from "../components/MapView";

const Dashboard = () => {
  let [selectedDate, setSelectedDate] = useState(new Date());
  let [currLevel, setCurrLevel] = useState(2);

  // "timetable" | "map"
  const [currView, setCurrView] = useState("timetable");
  const [highlightedRoom, setHighlightedRoom] = useState<string|null>(null);

  const mySetHighlightedRoom = (name: string) => {
    setHighlightedRoom(name);
  }


  const handleChange = (event: SelectChangeEvent) => {
    setCurrLevel(Number(event.target.value));
    setHighlightedRoom(null);
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

  const isNextWeekSunday = (date : Date) => {
    const today = new Date();
    const nextSunday = new Date(today);
    // Calculate days to next Sunday (0 is Sunday, 1 is Monday, ..., 6 is Saturday)
    const daysUntilNextSunday = today.getDay() === 0 ? 7 : 7 - today.getDay();
    // Set nextSunday to the next week's Sunday by adding daysUntilNextSunday
    nextSunday.setDate(today.getDate() + daysUntilNextSunday);
    // If the upcomming Sunday is this week, add 7 days to get to next week's Sunday
    if (daysUntilNextSunday < 7) {
      nextSunday.setDate(nextSunday.getDate() + 7);
    }
    // Check if the provided date is the same as next week's Sunday
    return date.getDate() === nextSunday.getDate()
  };
  

  console.log(highlightedRoom);

  const switchToTimetableView = () => {
    setCurrView("timetable")
  }

  return (
    <>
      <div className="dashboard-content">
        <Box sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '25px' }}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={currLevel.toString()}
            label="Level"
            onChange={handleChange}>
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
          {currView === "timetable" && <Button variant="outlined" onClick={() => setCurrView("map")}>
            Map View
            </Button>}
          {currView === "map" && <Button variant="outlined" onClick={() => setCurrView("timetable")}>
            Timetable View
            </Button>}
          {/* <Button variant="outlined">{currView === "timetable" }</Button> */}
        </Box>
        {currView === "timetable" &&
          <RoomTimetable selectedDate={selectedDate} currLevel={currLevel} highlightedRoom={highlightedRoom}/>
        }
        {currView === "map" &&
          <MapView currLevel={currLevel} setHighlightedRoom={mySetHighlightedRoom} switchView={switchToTimetableView}/>
        }

      </div>
    </>
  );
}

export default Dashboard;