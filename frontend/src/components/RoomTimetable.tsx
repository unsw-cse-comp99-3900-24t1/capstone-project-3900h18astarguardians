import { Scheduler } from "@aldabil/react-scheduler";
import { useEffect, useState, memo, useCallback } from "react";
import { request } from "../utils/axios";
import "../styles/RoomTimetable.css";
import { Button } from "@mui/material";
import { EventActions, ProcessedEvent } from "@aldabil/react-scheduler/types";
import axios from "axios";
import { useGlobalContext } from "../utils/context";
import sendEmailFn from "../utils/SendEmailFn";
import deleteBookingsFn from "../utils/DeleteBookingsFn";
import { Room, Event, RoomTimetableProps, User } from '../interfaces/IRoomTimeTable';
import FilterModal from './FilterModal';

const RoomTimetable: React.FC<RoomTimetableProps> = memo(({ selectedDate, currLevel }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [update, setUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
  const [clickedRoom, setClickedRoom] = useState<Room>();
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const roomsDisplay = 5;
  const { displaySuccess, displayError, token } = useGlobalContext();

  const initializeFilteredRooms = useCallback(() => {
    const CurrLevelRooms = rooms.filter(room => room.level === currLevel);
    setFilteredRooms(CurrLevelRooms);
  }, [rooms, currLevel]);

  useEffect(() => {
    initializeFilteredRooms();
  }, [rooms, currLevel, initializeFilteredRooms]);

  const fetchRoomsAndEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const [roomsResponse, eventsResponse, usersResponse] = await Promise.all([
        request.get<{ rooms: Room[] }>("/rooms"),
        request.get<{ bookings: Event[] }>("/bookings"),
        request.get<{ users: User[] }>("/users")
      ]);

      const coloredRooms = roomsResponse.data.rooms.map(room => ({
        ...room,
        color: getColorForRoomType(room.type),
        title: room.name,
        admin_id: room._id,
        avatar: "https://picsum.photos/200/300",
      }));

      setRooms(coloredRooms);
      setEvents(eventsResponse.data.bookings.map(event => ({
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

      const newUsers: User[] = usersResponse.data.users;
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
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRoomsAndEvents();
  }, [update, selectedDate, currLevel, fetchRoomsAndEvents]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [currLevel]);

  const getColorForRoomType = (type: string): string => {
    switch (type) {
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
      setEvents(events.filter(item => item.event_id !== event_id));
    };
    const errorFn = (msg: string) => {
      displayError(msg);
    };
    setIsLoading(true);
    await deleteBookingsFn(event_id, successFn, errorFn);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isLoading) {
      const schedulerElement = document.querySelector('.scrollable-scheduler') as HTMLElement;
      if (schedulerElement) {
        const smallerGrids = schedulerElement.querySelectorAll('.css-1gyej37');
        smallerGrids.forEach((grid, gridIndex) => {
          if (gridIndex !== 0) {
            const timeCells = grid.querySelectorAll('.rs__cell.rs__time');
            timeCells.forEach(cell => {
              cell.textContent = '';
            });
            (grid as HTMLElement).style.gridTemplateColumns = '4% repeat(1, 1fr)';
          }
        });
      }
    }
  }, [isLoading, currentIndex]);

  const onConfirm = async (event: ProcessedEvent, _action: EventActions): Promise<ProcessedEvent> => {
    try {
      const response = await request.post("/bookings", {
        "room": clickedRoom?._id,
        "start": event.start.toString(),
        "duration": Math.abs(event.end.getTime() - event.start.getTime()) / 3600000,
        ...(isAdmin && event.User !== token?.userId ? { "user": event.User } : {})
      });
      if (response?.data?.booking._id) {
        sendEmailFn(response?.data?.booking._id, true);
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
      });
      setUpdate(prevUpdate => !prevUpdate);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error message:', error.message);
        const msg = error.response!.data.msg;
        displayError(msg);
      } else {
        console.error('Unexpected error:', error);
      }
    }
    return event;
  };

  const nextPage = () => {
    setCurrentIndex(prevIndex => Math.min(prevIndex + roomsDisplay, filteredRooms.length - roomsDisplay));
  };

  const prevPage = () => {
    setCurrentIndex(prevIndex => Math.max(prevIndex - roomsDisplay, 0));
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const handleFilterModalClose = () => {
    setFilterModalOpen(false);
  };


  const handleFilterModalConfirm = (filters: { selectedOptions: string[]; capacity: number }) => {
    const filtered = rooms.filter(room =>
      room.size >= filters.capacity && room.level === currLevel
    );
    setFilteredRooms(filtered);
    setCurrentIndex(0);
    handleFilterModalClose();
  };

  
  
  // handleCellClick is called when a cell is clicked to get the selected room details
  const handleCellClick = (_start: Date, _end: Date, _resourceKey?: string, resourceVal?: string | number) => {
    console.log("Clicked room resource value:", resourceVal);
    const room = rooms.find(room => room._id === resourceVal);
    console.log("Setting clicked room to:", room);
    setClickedRoom(room);
  };

  return (
    <>
      <Button onClick={() => setFilterModalOpen(true)}>Open Filter</Button>
      <FilterModal
        open={filterModalOpen}
        handleClose={handleFilterModalClose}
        handleConfirm={handleFilterModalConfirm}
        options={['Option 1', 'Option 2', 'Option 3']} // Replace with actual options
      />
      <Button onClick={prevPage} disabled={currentIndex === 0}>Back</Button>
      <Button onClick={nextPage} disabled={currentIndex + roomsDisplay >= filteredRooms.length}>Next</Button>
      <div className="scrollable-scheduler">
        <Scheduler
          onCellClick={handleCellClick}
          key={currentIndex}
          view="day"
          day={{
            startHour: 0,
            endHour: 24,
            step: 60,
            cellRenderer: ({ height, start, onClick, ...props }) => {
              const currTime = new Date();
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
                  onClick={disabled ? () => { } : onClick}
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
          resources={filteredRooms.slice(currentIndex, currentIndex + roomsDisplay)}
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
              name: "room",
              type: "input",
              default: clickedRoom?.name,
              config: { label: "Room", required: true, disabled: true }
            },
            {
              name: "User",
              type: "select",
              default: token?.userId,
              options: users.map(user => ({
                id: user._id,
                text: `${user.name} (${user.zid})`,
                value: user._id
              })),
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
  );
});

export default RoomTimetable;
