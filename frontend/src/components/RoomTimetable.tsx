import { Scheduler } from "@aldabil/react-scheduler";
import { useEffect, useState, memo } from "react";
import { request } from "../utils/axios";
import "../styles/RoomTimetable.css";
import { Button } from "@mui/material";
import { EventActions, ProcessedEvent } from "@aldabil/react-scheduler/types";
import axios from "axios";
import { useGlobalContext } from "../utils/context";
import sendEmailFn  from "../utils/SendEmailFn";
import deleteBookingsFn from "../utils/DeleteBookingsFn";

// Define interfaces
interface Room {
  _id: string;
  name: string;
  size: number;
  type: string;
  color?: string;
  level: number;
}

interface Event {
  event_id: string;
  _id: string;
  title: string;
  start: Date;
  end: Date;
  editable: boolean;
  deletable: boolean;
  draggable: boolean;
  room: {
    name: string;
    size: number;
    type: string;
    _id: string;
  }
  user: {
    email: string;
    name: string;
    type: string;
    zid: string;
    _id: string;
  }
}
interface RoomTimetableProps {
  selectedDate: Date;
  currLevel: number;
}

interface User {
  _id: string;
  email: string;
  name: string;
  faculty: string;
  zid: string;
  school: string;
  type: string;
  role: string;
}






const RoomTimetable: React.FC<RoomTimetableProps> = memo(({ selectedDate, currLevel }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [update, setUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const roomsDisplay = 5;
  const { displaySuccess, displayError, token } =
    useGlobalContext();

  const nextPage = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + roomsDisplay, rooms.length - roomsDisplay));
  };

  const prevPage = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - roomsDisplay, 0));
  };

  useEffect(() => {
    fetchRoomsAndEvents();
  }, [update, selectedDate, currLevel]);

  const fetchRoomsAndEvents = async () => {
    try {
      setIsLoading(true); // Set loading state to true when fetching starts
      const roomsResponse = await request.get<{ rooms: Room[] }>("/rooms");
      const eventsResponse = await request.get<{ bookings: Event[] }>("/bookings");

      const coloredRooms = roomsResponse.data.rooms.map((room: Room) => ({
        ...room,
        color: getColorForRoomType(room.type),
        title: room.name,
        admin_id: room._id,
        avatar: "https://picsum.photos/200/300",
      }));

      setRooms(coloredRooms);
      setEvents(eventsResponse.data.bookings.map((event: Event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        event_id: event._id,
        title: event.user.name,
        admin_id: event.room._id,
        editable: false,
        deletable: true,
        draggable: false,
      })));

      const usersResponse = await request.get("/users");
      let newUsers: User[] = usersResponse.data.users;
      // put currUser to front
      const currUserType = token?.type;
      if (currUserType === "admin") {
        setIsAdmin(true);
      }

      setUsers(newUsers.filter(user => 
        user.type === "cse_staff" || user._id === token?.userId
      ));

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
      case "staff room": return "purple";
      default: return "grey";
    }
  };

  const deleteBookings = async (event_id: string) => {
    const successFn = (msg: string) => {
      displaySuccess(msg);
      setEvents(events.filter(item => item.event_id !== event_id)) // change event
    }
    const errorFn = (msg:string) => {
      displayError(msg);
    }
    setIsLoading(true)
    await deleteBookingsFn(event_id, successFn, errorFn)
    setIsLoading(false)
  }

  useEffect(() => {
    if (!isLoading) {
      const schedulerElement = document.querySelector('.scrollable-scheduler') as HTMLElement;
      if (schedulerElement) {
        // get all the room columns (or small grids) that are not the first one
        const smallerGrids = schedulerElement.querySelectorAll('.css-1gyej37');
        smallerGrids.forEach((grid, gridIndex) => {
          // apply this to all but not the first smaller grid
          if (gridIndex !== 0) {
            const timeCells = grid.querySelectorAll('.rs__cell.rs__time');
            timeCells.forEach(cell => {
              // Clear the text content of the cell
              cell.textContent = '';
            });
            // Assert grid as HTMLElement to access the style property
            (grid as HTMLElement).style.gridTemplateColumns = '4% repeat(1, 1fr)';
          }
        });
      }
    }
  }, [isLoading, currentIndex]); // Re-run this effect when isLoading changes

  const onConfirm = (event: ProcessedEvent, action: EventActions): Promise<ProcessedEvent> => {
    // make a booking request

    const makePostRequest = async () => {
      try {
        const response = await request.post("/bookings", {
          "room": event.room_id,
          "start": event.start.toString(),
          //@ts-ignore
          "duration": Math.abs(event.end - event.start)/36e5,
          ...(isAdmin && event.User !== token?.userId ? {"user": event.User}: {})
        });
        if(response?.data?.booking._id) {
          sendEmailFn(response?.data?.booking._id, true)
          //sendEmailFn(response?.data?.booking._id, false)
        }
        events.push({
          //@ts-ignore
          event_id: event.event_id,
          _id: event._id,
          title: "dummy title",
          start: event.start,
          end: event.end,
          // @ts-ignore
          editable: event.editable,
          // @ts-ignore
          deletable: event.deletable,
          // @ts-ignore
          draggable: event.draggable,
          room: event.room,
        }
        );
        setEvents(events);
        setUpdate(!update);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error message:', error.message);
        } else {
          console.error('Unexpected error:', error);
        }
      }
    };
    
    // Call the function to make the POST request
    makePostRequest();
    return Promise.resolve(event);
  }

  
  const CurrLevelRooms = rooms.filter(room => room.level == currLevel);
  const displayedRooms = CurrLevelRooms.slice(currentIndex, currentIndex + roomsDisplay);

  // Render a loading message while data is being fetched
  if (isLoading) {
    return <p>Loading...</p>;
  }

  // Render the Scheduler component when data has been loaded
  return <>
    <Button onClick={prevPage} disabled={currentIndex === 0}>
        Back
    </Button>
    <Button onClick={nextPage} disabled={currentIndex >= rooms.length - roomsDisplay}>
      Next
    </Button>
    <div className="scrollable-scheduler">
      <Scheduler
        key={currentIndex}
        view="day"
        day={{
          startHour: 0,
          endHour: 24,
          step: 60,
          cellRenderer: ({ height, start, onClick, ...props }) => {
            // Fake some condition up
            // const hour = start.getHours();
            const currTime = new Date()
            currTime.setMinutes(0);
            currTime.setHours(currTime.getHours() - 1);
            const disabled = start < currTime;
            const restProps = disabled ? {} : props;
            return (
              <Button
                style={{
                  height: "100%",
                  background: disabled ? "#eee" : "transparent",
                  cursor: disabled ? "not-allowed" : "pointer"
                }}

                // this disables the modal for prev times
                onClick={disabled ? () => {} : onClick}
                
                disableRipple={disabled}
                {...restProps}
              ></Button>
            );
          }
        }}
        hourFormat="24"
        navigation={false}
        disableViewer={false}
        selectedDate={selectedDate}
        disableViewNavigator={true}
        resourceViewMode={"default"}
        resources={displayedRooms}
        draggable={false}
        onDelete={deleteBookings}
        events={events}
        onConfirm={onConfirm}
        fields={[
          {
            name: "Description",
            type: "input",
            default: "Default Value...",
            config: { label: "Details", multiline: true, rows: 4 }
          },
          {
            name: "room_id",
            type: "select",
            default: rooms[0]._id,
            options: rooms.map((res) => {
              return {
                id: res._id,
                text: `${res.name}`,
                value: res._id //Should match "name" property
              };
            }),
            config: { label: "Room", required: true }
          }, {
            name: "User",
            type: "select",
            default: token?.userId,
            options: users.map((user: User) => {
              return {
                id: user._id,
                text: `${user.name} (${user.zid})`,
                value: user._id //Should match "name" property
              };
            }),
            config: { label: "User", required: true, disabled: !isAdmin }
          }
        ]}
        resourceFields={{
          idField: "admin_id",
          textField: "title",
          avatarField: "title",
          colorField: "color"
        }}
      />
    </div>
  </>
  
});

export default RoomTimetable;
