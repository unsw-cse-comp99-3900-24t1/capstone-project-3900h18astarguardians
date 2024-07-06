import React, { useState } from 'react';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, Modal, TextField, Typography } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const FilterModal = ({ open, handleClose, handleFilter }) => {
  const [capacity, setCapacity] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [resources, setResources] = useState({
    printer: false,
    projector: false,
  });

  const handleResourceChange = (event) => {
    setResources({ ...resources, [event.target.name]: event.target.checked });
  };

  const submitFilters = () => {
    // Here you would typically call a function that applies these filters
    // This could involve setting state in a parent component or making a backend call
    handleFilter({ capacity, startTime, endTime, resources });
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="filter-modal-title"
      aria-describedby="filter-modal-description"
    >
      <Box sx={style}>
        <Typography id="filter-modal-title" variant="h6" component="h2">
          Filter Rooms
        </Typography>
        <TextField
          label="Capacity"
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          fullWidth
          margin="normal"
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <TimePicker
            label="Start Time"
            value={startTime}
            onChange={setStartTime}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />
          <TimePicker
            label="End Time"
            value={endTime}
            onChange={setEndTime}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />
        </LocalizationProvider>
        <FormControl component="fieldset" margin="normal">
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={resources.printer} onChange={handleResourceChange} name="printer" />}
              label="Printer"
            />
            <FormControlLabel
              control={<Checkbox checked={resources.projector} onChange={handleResourceChange} name="projector" />}
              label="Projector"
            />
          </FormGroup>
        </FormControl>
        <Button onClick={submitFilters} variant="contained" sx={{ mt: 2 }}>
          Apply Filters
        </Button>
      </Box>
    </Modal>
  );
};

export default FilterModal;