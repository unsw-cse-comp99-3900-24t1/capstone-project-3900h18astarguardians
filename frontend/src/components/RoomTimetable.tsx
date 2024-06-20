import { Scheduler } from "@aldabil/react-scheduler";
import { useEffect, useState } from "react";
import { request } from "../utils/axios";
import "../styles/RoomTimetable.css";

// Define interfaces
interface Room {
  _id: string;
  name: string;
  size: number;
  type: string;
  color?: string;
}

interface Event {
  event_id: string;
  _id: string;
  title: string;
  start: Date;
  end: Date;
  room: {
    name: string;
    size: number;
    type: string;
    _id: string;
  }
}

const RoomTimetable = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetchRoomsAndEvents();
  }, []);

  const fetchRoomsAndEvents = async () => {
    try {
      setIsLoading(true); // Set loading state to true when fetching starts
      const roomsResponse = await request.get<{ rooms: Room[] }>("/rooms");
      const eventsResponse = await request.get<{ bookings: Event[] }>("/bookings");

      const coloredRooms = roomsResponse.data.rooms.map((room: Room) => ({
        ...room,
        color: getColorForRoomType(room.type),
        admin_id: room._id,
        title: room.name,
        avatar: "https://picsum.photos/200/300",
      }));

      setRooms(coloredRooms);
      setEvents(eventsResponse.data.bookings.map((event: Event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        event_id: event._id,
        title: "dummy title",
        admin_id: event.room._id,
      })));
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false); // Set loading state to false when fetching ends
    }
  };

  const getColorForRoomType = (type: string): string => {
    switch(type) {
      case "meeting room": return "green";
      case "hot desk": return "red";
      case "normal": return "orange";
      default: return "grey";
    }
  };

  // Render a loading message while data is being fetched
  if (isLoading) {
    return <p>Loading...</p>;
  }
  console.log(events);
  // Render the Scheduler component when data has been loaded
  return <>
    <div className="scrollable-scheduler">
      <Scheduler
        view="day"
        day={{
          startHour: 0,
          endHour: 24,
          step: 60
        }}
        hourFormat="24"
        navigation={false}
        disableViewer={true}
        selectedDate={new Date()}
        disableViewNavigator={true}
        resourceViewMode={"default"}
        resources={rooms}
        events={events}
        resourceFields={{
          idField: "admin_id",
          textField: "title",
          avatarField: "title",
          colorField: "color"
        }}
      />
    </div>
  </>
  
};

export default RoomTimetable;
