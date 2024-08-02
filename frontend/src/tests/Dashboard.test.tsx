import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dashboard from '../pages/Dashboard';
import { BrowserRouter } from 'react-router-dom';

describe('Dashboard Component', () => {
  beforeEach(() => {
    render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );
  });
  test.only('renders initial state correctly', () => {
    
    // Check initial level
    expect(screen.getByDisplayValue('Level Two')).toBeInTheDocument();
    
    // Check initial date
    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
    
    // Check initial view button
    expect(screen.getByText('Map View')).toBeInTheDocument();
  });

  test('date navigation buttons work correctly', () => {
    
    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    
    // Check if the backward button is disabled initially
    expect(screen.getByText('<')).toBeDisabled();
    
    // Move date forward
    fireEvent.click(screen.getByText('>'));
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    const formattedNextDay = `${nextDay.getDate()}/${nextDay.getMonth() + 1}/${nextDay.getFullYear()}`;
    expect(screen.getByText(formattedNextDay)).toBeInTheDocument();
    
    // Move date backward
    fireEvent.click(screen.getByText('<'));
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  test('level selection works correctly', () => {
    
    // Change level to Level Three
    fireEvent.change(screen.getByDisplayValue('Level Two'), { target: { value: '3' } });
    expect(screen.getByDisplayValue('Level Three')).toBeInTheDocument();
    
    // Change level to Level Four
    fireEvent.change(screen.getByDisplayValue('Level Three'), { target: { value: '4' } });
    expect(screen.getByDisplayValue('Level Four')).toBeInTheDocument();
  });

  test('view switch button works correctly', () => {
    
    // Switch to Map View
    fireEvent.click(screen.getByText('Map View'));
    expect(screen.getByText('Timetable View')).toBeInTheDocument();
    
    // Switch back to Timetable View
    fireEvent.click(screen.getByText('Timetable View'));
    expect(screen.getByText('Map View')).toBeInTheDocument();
  });
});