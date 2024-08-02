// import { render, screen  } from '@testing-library/react'
// import '@testing-library/jest-dom';
// import RoomTimetable from '../components/RoomTimetable';
// // import { request } from "../utils/axios";


// const mockHandleClose = jest.fn();
// const mockHandleConfirm = jest.fn();
// const mockSetState = jest.fn();

// const defaultProps = {
//   handleClose: mockHandleClose,
//   handleConfirm: mockHandleConfirm,
//   setState: mockSetState,
// };

// const setup = () => {
//   return render(<RoomTimetable 
//     selectedDate={new Date()}
//     currLevel={1}
//     highlightedRoom={''}
//     {...defaultProps} 
//   />);
// };

// describe("DeleteBookingsFn", () => {
//   it('render deleteBookings', () => {
//     setup();
//     expect(screen.getByTestId('scheduler_table')).toBeInTheDocument();
//   })
// })