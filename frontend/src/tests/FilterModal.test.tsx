import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterModal from '../components/FilterModal';

const mockHandleClose = jest.fn();
const mockHandleConfirm = jest.fn();

const defaultProps = {
  open: true,
  handleClose: mockHandleClose,
  handleConfirm: mockHandleConfirm,
  options: ['Option 1', 'Option 2'],
  types: ['Type 1', 'Type 2'],
  selectedDate: new Date(),
};
const setup = () => {
  return render(<FilterModal {...defaultProps} />);
};

describe('FilterModal', () => {

  // test('validateTimes function', () => {
  //   const { getByLabelText } = component;

  //   const startTimeInput = getByLabelText('Start Time') as HTMLInputElement;
  //   const endTimeInput = getByLabelText('End Time') as HTMLInputElement;

  //   fireEvent.change(startTimeInput, { target: { value: '10:00' } });
  //   fireEvent.change(endTimeInput, { target: { value: '09:00' } });

  //   expect(screen.getByText('End time must be later than start time!')).toBeInTheDocument();

  //   fireEvent.change(startTimeInput, { target: { value: '08:00' } });
  //   fireEvent.change(endTimeInput, { target: { value: '10:00' } });

  //   expect(screen.getByText('End time must be later than start time!')).not.toBeInTheDocument();
  // });

  
  it('renders correctly when open', () => {
    setup();

    // Check if the modal title is rendered
    expect(screen.getByText('Apply Filters')).toBeInTheDocument();

    // Check if the Equipment accordion is rendered
    expect(screen.getByText('Equipment')).toBeInTheDocument();

    // Check if the Type accordion is rendered
    expect(screen.getByText('Type')).toBeInTheDocument();

    // Check if the Available Time Span accordion is rendered
    expect(screen.getByText('Available Time Span')).toBeInTheDocument();
  });

  it('calls handleClose when the close button is clicked', () => {
    setup();

    // Click the close button
    fireEvent.click(screen.getByTestId('Modal close button'));

    // Check if handleClose was called
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('calls handleConfirm with the correct filters when the confirm button is clicked', () => {
    setup();

    // Click the confirm button
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

    // Check if handleConfirm was called with the correct filters
    expect(mockHandleConfirm).toHaveBeenCalledWith({
      selectedOptions: [],
      selectedType: '',
      capacityMin: 0,
      capacityMax: 0,
      startTime: '',
      endTime: '',
    });
  });
  it('Equipment Accordion onChange toggles expansion', () => {
    setup();
    // test equipments
    const eqAttributes = screen.getByTestId('eq-summary');
    expect(eqAttributes).toHaveAttribute('aria-expanded', 'false');
  
    // Simulate user clicking the accordion to trigger onChange
    fireEvent.click(eqAttributes);
    expect(eqAttributes).toHaveAttribute('aria-expanded', 'true');

    // Simulate user clicking again to collapse the accordion
    fireEvent.click(eqAttributes);

    expect(eqAttributes).toHaveAttribute('aria-expanded', 'false'); 
  });
  
  it('Type Accordion onChange toggles expansion', () => {
    setup();
    // test equipments
    const eqAttributes = screen.getByTestId('types');
    expect(eqAttributes).toHaveAttribute('aria-expanded', 'false');
  
    // Simulate user clicking the accordion to trigger onChange
    fireEvent.click(eqAttributes);
    expect(eqAttributes).toHaveAttribute('aria-expanded', 'true');

    // Simulate user clicking again to collapse the accordion
    fireEvent.click(eqAttributes);

    expect(eqAttributes).toHaveAttribute('aria-expanded', 'false'); 
  });

  it('Timespan Accordion onChange toggles expansion', () => {
    setup();
    // test equipments
    const eqAttributes = screen.getByTestId('timespan');
    expect(eqAttributes).toHaveAttribute('aria-expanded', 'false');
  
    // Simulate user clicking the accordion to trigger onChange
    fireEvent.click(eqAttributes);
    expect(eqAttributes).toHaveAttribute('aria-expanded', 'true');

    // Simulate user clicking again to collapse the accordion
    fireEvent.click(eqAttributes);

    expect(eqAttributes).toHaveAttribute('aria-expanded', 'false'); 
  });
  
  it('clears filters when the clear button is clicked', () => {
    setup();

    // Simulate setting some filters
    fireEvent.click(screen.getByLabelText('Option 1'));
    fireEvent.click(screen.getByLabelText('Type 1'));
    fireEvent.change(screen.getByLabelText('Capacity Min'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Capacity Max'), { target: { value: '20' } });
    fireEvent.change(screen.getByLabelText('Start Time'), { target: { value: '10:00' } });
    fireEvent.change(screen.getByLabelText('End Time'), { target: { value: '12:00' } });

    // Click the clear button
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));

    // Verify that the filters have been reset
    expect(screen.getByLabelText('Option 1')).not.toBeChecked();
    expect(screen.getByLabelText('Type 1')).not.toBeChecked();
    expect(screen.getByLabelText('Capacity Min')).toHaveValue(null);
    expect(screen.getByLabelText('Capacity Max')).toHaveValue(null);
    expect(screen.getByLabelText('Start Time')).toHaveValue('');
    expect(screen.getByLabelText('End Time')).toHaveValue('');
  });
});
