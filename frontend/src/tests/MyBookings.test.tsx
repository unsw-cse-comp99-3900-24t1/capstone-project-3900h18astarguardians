import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyBookings from '../pages/MyBookings';
import { request } from '../utils/axios';
import { useGlobalContext } from '../utils/context';
import exportIcs from '../utils/exportIcs';

// Mock dependencies
jest.mock('../utils/axios');
jest.mock('../utils/context');
jest.mock('../utils/exportIcs');

const mockSetNumCheckIns = jest.fn();
const mockDisplaySuccess = jest.fn();
const mockDisplayError = jest.fn();

describe('MyBookings Component', () => {
  beforeEach(() => {
    (useGlobalContext as jest.Mock).mockReturnValue({
      displaySuccess: mockDisplaySuccess,
      displayError: mockDisplayError,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders MyBookings component', () => {
    render(<MyBookings setNumCheckIns={mockSetNumCheckIns} />);
    expect(screen.getByText('My Bookings')).toBeInTheDocument();
  });

  test('fetches and displays bookings', async () => {
    const mockBookings = [
      {
        id: '1',
        date: '01/01/2023',
        start_time: '10am',
        end_time: '11am',
        room: 'Room 1',
        description: 'Meeting',
        checked_in: false,
        backgroundColor: 'rgba(0,0,0, 0.1)',
        dateString: '2023-01-01T10:00:00Z',
      },
    ];

    (request.get as jest.Mock).mockResolvedValueOnce({ data: { bookings: mockBookings } });

    render(<MyBookings setNumCheckIns={mockSetNumCheckIns} />);

    await waitFor(() => expect(request.get).toHaveBeenCalledTimes(1));
    expect(screen.getByText('Room 1')).toBeInTheDocument();
    expect(screen.getByText('Meeting')).toBeInTheDocument();
  });

  test('handles check-in', async () => {
    const mockBookings = [
      {
        id: '1',
        date: '01/01/2023',
        start_time: '10am',
        end_time: '11am',
        room: 'Room 1',
        description: 'Meeting',
        checked_in: false,
        backgroundColor: 'rgba(0,0,0, 0.1)',
        dateString: '2023-01-01T10:00:00Z',
      },
    ];

    (request.get as jest.Mock).mockResolvedValueOnce({ data: { bookings: mockBookings } });
    (request.patch as jest.Mock).mockResolvedValueOnce({ data: { updatedBooking: { isCheckedIn: true } } });

    render(<MyBookings setNumCheckIns={mockSetNumCheckIns} />);

    await waitFor(() => expect(request.get).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByText('Check In'));

    await waitFor(() => expect(request.patch).toHaveBeenCalledTimes(1));
    expect(mockDisplaySuccess).toHaveBeenCalledWith('Checked in');
    expect(mockSetNumCheckIns).toHaveBeenCalledWith(expect.any(Function));
  });

  test('handles delete booking', async () => {
    const mockBookings = [
      {
        id: '1',
        date: '01/01/2023',
        start_time: '10am',
        end_time: '11am',
        room: 'Room 1',
        description: 'Meeting',
        checked_in: false,
        backgroundColor: 'rgba(0,0,0, 0.1)',
        dateString: '2023-01-01T10:00:00Z',
      },
    ];

    (request.get as jest.Mock).mockResolvedValueOnce({ data: { bookings: mockBookings } });
    (request.delete as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    render(<MyBookings setNumCheckIns={mockSetNumCheckIns} />);

    await waitFor(() => expect(request.get).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => expect(request.delete).toHaveBeenCalledTimes(1));
    expect(mockDisplaySuccess).toHaveBeenCalledWith('Successfully delete bookings');
  });

  test('handles export ICS', async () => {
    const mockBookings = [
      {
        id: '1',
        date: '01/01/2023',
        start_time: '10am',
        end_time: '11am',
        room: 'Room 1',
        description: 'Meeting',
        checked_in: false,
        backgroundColor: 'rgba(0,0,0, 0.1)',
        dateString: '2023-01-01T10:00:00Z',
      },
    ];

    (request.get as jest.Mock).mockResolvedValueOnce({ data: { bookings: mockBookings } });

    render(<MyBookings setNumCheckIns={mockSetNumCheckIns} />);

    await waitFor(() => expect(request.get).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByText('Export ICS'));

    expect(exportIcs).toHaveBeenCalledWith([mockBookings[0]]);
    expect(mockDisplaySuccess).toHaveBeenCalledWith('success import ics file');
  });
});