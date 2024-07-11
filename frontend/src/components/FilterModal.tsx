import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface FilterModalProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: (filters: { selectedOptions: string[], selectedTypes: string[], capacityMin: number, capacityMax: number }) => void;
  options: string[];
  types: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({ open, handleClose, handleConfirm, options, types }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [capacityMin, setCapacityMin] = useState<number | "">();
  const [capacityMax, setCapacityMax] = useState<number | "">();
  const [equipmentExpanded, setEquipmentExpanded] = useState<boolean>(false);
  const [typeExpanded, setTypeExpanded] = useState<boolean>(false);
  const [modalStyle, setModalStyle] = useState({});

  useEffect(() => {
    const newStyle = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: { xs: '90%', sm: '80%', md: '60%', lg: '40%' },
      maxHeight: '80vh', // Using viewport height to ensure it's relative to screen size
      bgcolor: 'background.paper',
      borderRadius: '12px',
      border: 'none',
      boxShadow: 24,
      p: 4,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto', // Ensuring content can scroll internally
    };
    setModalStyle(newStyle);
  }, [equipmentExpanded, typeExpanded]);

  const clearFilters = () => {
    setSelectedOptions([]);
    setSelectedTypes([]);
    setCapacityMin("");
    setCapacityMax("");
    setEquipmentExpanded(false);
    setTypeExpanded(false);
  };
  const handleToggleOption = (value: string) => toggleSelection(value, selectedOptions, setSelectedOptions);
  const handleToggleType = (value: string) => toggleSelection(value, selectedTypes, setSelectedTypes);

  const toggleSelection = (value: string, currentSelection: string[], setSelection: React.Dispatch<React.SetStateAction<string[]>>) => {
    const currentIndex = currentSelection.indexOf(value);
    const newChecked = [...currentSelection];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelection(newChecked);
  };

  const handleCapacityChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
    setter: React.Dispatch<React.SetStateAction<number | "">>
  ) => {
    setter(Number(event.target.value) || "");
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
            <FormGroup>
              {types.map((type) => (
                <FormControlLabel
                  key={type}
                  control={<Checkbox checked={selectedTypes.includes(type)} onChange={() => handleToggleType(type)} />}
                  label={type}
                />
              ))}
            </FormGroup>
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
              handleConfirm({ selectedOptions, selectedTypes, capacityMin: Number(capacityMin), capacityMax: Number(capacityMax) });
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
