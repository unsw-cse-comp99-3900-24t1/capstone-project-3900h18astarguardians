import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput, SelectChangeEvent, TextField } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: '500px',
  bgcolor: 'background.paper',
  borderRadius: '15px',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface FilterModalProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: (filters: { selectedOptions: string[], capacity: number }) => void;
  options: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({ open, handleClose, handleConfirm, options }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [capacity, setCapacity] = useState<number | "">(10);  // Default capacity

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const valueArray = typeof value === 'string' ? [value] : value;
    setSelectedOptions(valueArray);
  };

  const handleCapacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCapacity(Number(event.target.value) || "");
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="filter-modal-title"
        aria-describedby="filter-modal-description"
      >
        <Box sx={style}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-multiple-checkbox-label">Equipment</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={selectedOptions}
              onChange={handleChange}
              input={<OutlinedInput label="Equipment" />}
              renderValue={(selected) => (Array.isArray(selected) ? selected.join(', ') : '')}
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  <Checkbox checked={selectedOptions.indexOf(option) > -1} />
                  <ListItemText primary={option} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Capacity"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={capacity}
              onChange={handleCapacityChange}
            />
          </FormControl>
          <Button
            variant="contained"
            onClick={() => {
              handleConfirm({ selectedOptions, capacity: Number(capacity) });
              handleClose();
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default FilterModal;
