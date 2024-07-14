import React, { useState, useEffect } from 'react';
import {
  Box, Button, Modal, IconButton, Accordion, AccordionSummary, AccordionDetails,
  FormControl, FormGroup, FormControlLabel, Checkbox, TextField, Typography, Divider,
  RadioGroup, Radio, InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface FilterModalProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: (filters: {
    selectedOptions: string[];
    selectedType: string;
    capacityMin: number;
    capacityMax: number;
    startTime: string;
    endTime: string;
  }) => void;
  options: string[];
  types: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  open, handleClose, handleConfirm, options, types}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [capacityMin, setCapacityMin] = useState<number | "">("");
  const [capacityMax, setCapacityMax] = useState<number | "">("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [equipmentExpanded, setEquipmentExpanded] = useState<boolean>(false);
  const [typeExpanded, setTypeExpanded] = useState<boolean>(false);
  const [timeExpanded, setTimeExpanded] = useState<boolean>(false);
  const [modalStyle, setModalStyle] = useState({});

  useEffect(() => {
    const newStyle = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: { xs: '90%', sm: '80%', md: '60%', lg: '20%' },
      maxHeight: '80vh',
      bgcolor: 'background.paper',
      borderRadius: '12px',
      border: 'none',
      boxShadow: 24,
      p: 4,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    };
    setModalStyle(newStyle);
  }, [equipmentExpanded, typeExpanded]);

  const clearFilters = () => {
    setSelectedOptions([]);
    setSelectedType("");
    setCapacityMin("");
    setCapacityMax("");
    setStartTime("");
    setEndTime("");
    setEquipmentExpanded(false);
    setTypeExpanded(false);
    setTimeExpanded(false);
  };

  const handleToggleOption = (option: string) => {
    const index = selectedOptions.indexOf(option);
    const newSelectedOptions = [...selectedOptions];
    if (index === -1) {
      newSelectedOptions.push(option);
    } else {
      newSelectedOptions.splice(index, 1);
    }
    setSelectedOptions(newSelectedOptions);
  };

  const handleCapacityChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setter: React.Dispatch<React.SetStateAction<number | "">>) => {
    setter(Number(event.target.value) || "");
  };

  const preventInvalidInput = (event: React.KeyboardEvent) => {
    if (!/[0-9]/.test(event.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'].includes(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="filter-modal-title"
      aria-describedby="filter-modal-description"
    >
      <Box sx={modalStyle}>
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="filter-modal-title" variant="h6" component="h2" sx={{ mb: 2, ml: 3 }}>
          Apply Filters
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Accordion sx={{ mb: 2 }} expanded={equipmentExpanded} onChange={() => setEquipmentExpanded(!equipmentExpanded)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography>Equipment</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {options.map((option) => (
                <FormControlLabel
                  key={option}
                  control={<Checkbox checked={selectedOptions.includes(option)} onChange={() => handleToggleOption(option)} />}
                  label={option}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ mb: 2 }} expanded={typeExpanded} onChange={() => setTypeExpanded(!typeExpanded)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
            <Typography>Type</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <RadioGroup
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {types.map((type) => (
                <FormControlLabel
                  key={type}
                  value={type}
                  control={<Radio />}
                  label={type}
                />
              ))}
            </RadioGroup>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ mb: 2 }} expanded={timeExpanded} onChange={() => setTimeExpanded(!timeExpanded)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4a-content" id="panel4a-header">
            <Typography>Time Span</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth>
              <TextField
                label="Start Time"
                type="time"
                InputLabelProps={{
                  shrink: true,
                }}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="End Time"
                type="time"
                InputLabelProps={{
                  shrink: true,
                }}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                sx={{ mb : 2 }}
              />
            </FormControl>
          </AccordionDetails>
        </Accordion>
        <Divider sx={{ my: 2 }} />
        <FormControl fullWidth>
          <TextField
            label="Capacity Min"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={capacityMin}
            onChange={(e) => handleCapacityChange(e, setCapacityMin)}
            sx={{ mb: 2 }}
            inputProps={{ min: 0 }}
            onKeyDown={preventInvalidInput}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setCapacityMin('')} edge="end">
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            label="Capacity Max"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={capacityMax}
            onChange={(e) => handleCapacityChange(e, setCapacityMax)}
            sx={{ mb: 2 }}
            inputProps={{ min: 0 }}
            onKeyDown={preventInvalidInput}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setCapacityMax('')} edge="end">
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={clearFilters}
            sx={{ mt: 2 }}
          >
            Clear Filters
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleConfirm({
                selectedOptions,
                selectedType,
                capacityMin: Number(capacityMin),
                capacityMax: Number(capacityMax),
                startTime,
                endTime
              });
              handleClose();
            }}
            sx={{ mt: 2 }}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FilterModal;
