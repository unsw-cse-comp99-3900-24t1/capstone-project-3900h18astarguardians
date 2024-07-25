import { Scheduler } from "@aldabil/react-scheduler";
import { useEffect, useState, memo, useCallback, useRef } from "react";
import { request } from "../utils/axios";
import "../styles/RoomTimetable.css";
import { Button } from "@mui/material";
import { DayHours, EventActions, ProcessedEvent } from "@aldabil/react-scheduler/types";
import axios from "axios";
import { useGlobalContext } from "../utils/context";
import sendEmailFn from "../utils/SendEmailFn";
import deleteBookingsFn from "../utils/DeleteBookingsFn";
import { Room, Event, RoomTimetableProps, User } from '../interfaces/IRoomTimeTable';
import FilterModal from './FilterModal';
import { sendOverrideEmail } from "../../../backend/utils/sendOverrideEmail" 


const RoomTimetable: React.FC<RoomTimetableProps> = memo(({ selectedDate, currLevel }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [update, setUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTableReady, setIsTableReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
  const [clickedRoom, setClickedRoom] = useState<Room | undefined>();
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [startHour, setStartHour] = useState<DayHours>(0);
  const [endHour, setEndHour] = useState<DayHours>(24);
  const roomsDisplay = 5;
  const { displaySuccess, displayError, token } = useGlobalContext();


  function filterEventsInRange() {
    const startTime = new Date(selectedDate);
    startTime.setHours(startHour, 0, 0); // Set start time to the startHour on the selected date
  
    const endTime = new Date(selectedDate);
    endTime.setHours(endHour, 0, 0); // Set end time to the endHour on the selected date
  
    const filteredEvents = events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
  
      // Include the event if it starts before the endHour and ends after the startHour
      return eventStart < endTime && eventEnd > startTime;
    });
  
    return filteredEvents;
  }

  // Filter available rooms based on the selected time range
  function filterAvailableRooms(filteredRooms: Room[], filterStartTime: string, filterEndTime: string) {
    // initialise the default start and end time
    let startTime = new Date(selectedDate);
    startTime.setHours(0, 0, 0, 0);
    let endTime = new Date(selectedDate);
    endTime.setHours(23, 59, 59, 999);
    // set the start and end time based on the filter inputs
    if (filterStartTime) {
      startTime.setHours(Number(filterStartTime.split(":")[0]), Number(filterStartTime.split(":")[1]), 0, 0);
    };
    if (filterEndTime) {
      endTime.setHours(Number(filterEndTime.split(":")[0]), Number(filterEndTime.split(":")[1]), 0, 0);
    }
    // filter out the events on the selected date
    const eventsOnSelectedDate = events.filter(event => event.start.toDateString() === new Date(selectedDate).toDateString());
    // Filter rooms based on availability
    let availableRooms = filteredRooms.filter(room => {
      // Check if there's any event in the room that conflicts with the criteria
      let isRoomOccupied = eventsOnSelectedDate.some(event => {
        const isPreviousEvent = new Date(event.end) <= startTime;
        const isFutureEvent = new Date(event.start) >= endTime;
        return (room._id === event.room._id) && !(isPreviousEvent || isFutureEvent);
      });
      // If no event conflicts, the room is available
      return !isRoomOccupied;
    });
    return availableRooms;
  }

  const initializeFilteredRooms = useCallback(() => {
    const CurrLevelRooms = rooms.filter(room => room.level === currLevel);
    setFilteredRooms(CurrLevelRooms);
    setIsLoading(false);
  }, [rooms, currLevel]);

  const handleFilterModalClose = () => {
    setFilterModalOpen(false);
  };

  const handleFilterModalConfirm = (filters: { selectedOptions: string[]; selectedType: string, 
    capacityMin: number, capacityMax: number, startTime: string, endTime: string }) => {
    let filteredRooms = rooms.filter(room => room.level === currLevel);
    if (filters.selectedType) {
      filteredRooms = filteredRooms.filter(room => room.type === filters.selectedType);
    }
    if (filters.capacityMin) {
      filteredRooms = filteredRooms.filter(room => room.size >= filters.capacityMin);
    }
    if (filters.capacityMax) {
      filteredRooms = filteredRooms.filter(room => room.size <= filters.capacityMax);
    }
    if (filters.startTime || filters.endTime) {
      if (filters.startTime && filters.endTime && filters.startTime < filters.endTime) {
        filteredRooms = filterAvailableRooms(filteredRooms, filters.startTime, filters.endTime);
        setStartHour(Number(filters.startTime.split(":")[0]) as DayHours);
        setEndHour(Number(filters.endTime.split(":")[0]) as DayHours);
      } else if (filters.startTime && !filters.endTime) {
        filteredRooms = filterAvailableRooms(filteredRooms, filters.startTime, "");
        setStartHour(Number(filters.startTime.split(":")[0]) as DayHours);
      } else if (!filters.startTime && filters.endTime) {
        filteredRooms = filterAvailableRooms(filteredRooms, "", filters.endTime);
        setEndHour(Number(filters.endTime.split(":")[0]) as DayHours);
      }
    }
    setFilteredRooms(filteredRooms);
    setCurrentIndex(0);
    setIsLoading(true);
    setIsTableReady(false);
    handleFilterModalClose();
  };

  const handleResetButton = () => {
    const CurrLevelRooms = rooms.filter(room => room.level === currLevel);
    setFilteredRooms(CurrLevelRooms);
    setStartHour(0);
    setEndHour(24);
    setCurrentIndex(0);
    setIsLoading(true);
    setIsTableReady(false);
  };

  useEffect(() => {
    if (rooms.length > 0) {
      initializeFilteredRooms();
    }
  }, [rooms, currLevel, initializeFilteredRooms]);

  useEffect(() => {
    setIsLoading(false);
  }, [filteredRooms]);
  

  const fetchRoomsAndEvents = useCallback(async () => {
    setIsTableReady(false)
    try {
      setIsLoading(true);
      const [roomsResponse, eventsResponse, usersResponse] = await Promise.all([
        request.get<{ rooms: Room[] }>("/rooms"),
        request.get<{ bookings: Event[] }>("/bookings"),
        request.get<{ users: User[] }>("/users")
      ]);
      console.log(eventsResponse);
      const bookings = eventsResponse.data.bookings.filter(booking => (booking.isOverrided === false) && (booking.isRequest == false || booking.isApproved));

      const coloredRooms = roomsResponse.data.rooms.map(room => ({
        ...room,
        color: getColorForRoomType(room.type),
        title: room.name,
        admin_id: room._id,
        avatar: "https://picsum.photos/200/300",
      }));

      setRooms(coloredRooms);
      setEvents(bookings.map(event => ({
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
    if (!isLoading && filteredRooms.length > 0) {
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
      setIsTableReady(true);
    }
  }, [isLoading, currentIndex]);

  const clickedRoomRef = useRef(clickedRoom);
  useEffect(() => {
    clickedRoomRef.current = clickedRoom;
  }, [clickedRoom]);

  const onConfirm = async (event: ProcessedEvent, _action: EventActions): Promise<ProcessedEvent> => {
    try {
      const response = await request.post("/bookings", {
        "room": clickedRoomRef.current?._id,
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
      const currUserType = token?.type;
      if (currUserType === "non_cse_staff") {
        displaySuccess("Your request has been submitted. The admin will notify you by email upon approval or rejection.")
      }
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
    return <div className="lds-facebook"><div></div><div></div><div></div></div>;
  }

  // handleCellClick is called when a cell is clicked to get the selected room details
  const handleCellClick = (_start: Date, _end: Date, _resourceKey?: string, resourceVal?: string | number) => {
    const room = rooms.find(room => room._id === resourceVal);
    setClickedRoom(room);
  };

  const overrideBooking = async (event_id: string, user_id: string) => {
    // send email
    console.log(event_id);
    console.log(user_id);
    sendOverrideEmail(user_id, event_id);
    await request.patch(`/bookings/${event_id}/overrideBooking`);

    fetchRoomsAndEvents();


  };
  return (
    <>
      <Button onClick={() => setFilterModalOpen(true)}>Open Filter</Button>
      <Button onClick={handleResetButton}>Reset Filter</Button>
      <FilterModal
        open={filterModalOpen}
        handleClose={handleFilterModalClose}
        handleConfirm={handleFilterModalConfirm}
        options={['printer', 'projector', 'other']}
        types={['staff room', 'meeting room', 'hot desk', 'normal']}
      />
      <Button onClick={prevPage} disabled={currentIndex === 0}>Back</Button>
      <Button onClick={nextPage} disabled={currentIndex + roomsDisplay >= filteredRooms.length}>Next</Button>
      {filteredRooms.length > 0 && (
        <div className="scrollable-scheduler" style={isTableReady ? {} : { display: "none" }}>
          <Scheduler
            onCellClick={handleCellClick}
            key={currentIndex}
            view="day"
            day={{
              startHour: startHour,
              endHour: endHour,
              step: 60,
              cellRenderer: ({ height, start, onClick, ...props }) => {
                // Set current time to the beginning of the current hour
                const currTime = new Date();
                currTime.setMinutes(0, 0, 0);
                // Ensure 'start' is a Date object (if it's not already)
                const startTime = new Date(start);
                // Disable the cell if its start time is in the past
                const disabled = startTime <= currTime;
                // Apply disabled-related properties conditionally
                const restProps = disabled ? {} : props;
                return (
                  <Button
                    style={{
                      height: "100%",
                      background: disabled ? "#eee" : "transparent",
                      cursor: disabled ? "not-allowed" : "pointer",
                    }}
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
            resources={filteredRooms.slice(currentIndex, currentIndex + roomsDisplay)}
            draggable={false}
            onDelete={deleteBookings}
            events={filterEventsInRange()}
            onConfirm={onConfirm}
            viewerExtraComponent={(_, event) => {
              return (
                <Button variant="outlined" disabled={!isAdmin} onClick={() => {
                  overrideBooking(event.event_id as string, event.user._id);
                }}>Override</Button>
              );
            }}
            fields={[
              {
                name: "Description",
                type: "input",
                default: "Default Value...",
                config: { label: "Details", multiline: true, rows: 4 }
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
      )}
      {filteredRooms.length == 0 && (
        <h3>No rooms available</h3>
      )}
    </>
  );
});

export default RoomTimetable;