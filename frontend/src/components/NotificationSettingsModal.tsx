import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useGlobalContext } from "../utils/context";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: "500px",
  bgcolor: "background.paper",
  borderRadius: "15px",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const TextModal = ({ handleConfirm, open, label, btnName, handleClose }) => {
  const [value, setValue] = React.useState('mail');

  const { displaySuccess, displayError } =
    useGlobalContext();

  const handleChange = (event) => {
      setValue(event.target.value);
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormControl component="fieldset">
          <FormLabel component="legend">Notification Setting</FormLabel>
          <br />
          <RadioGroup aria-label="Notification" name="Notification1" value={value} onChange={handleChange}>
            <FormControlLabel value="mail" control={<Radio />} label="E-mail" />
            <FormControlLabel value="SMS" control={<Radio />} label="SMS" />
            <FormControlLabel value="app" control={<Radio />} label="app" />
          </RadioGroup>
          </FormControl>
          <br />
          <br />
          <Button
            variant="contained"
            onClick={() => {
              handleClose();
              displaySuccess('Change Notification Setting Success!')
            }}
          >
            CONFIRM
          </Button>
        </Box>
      </Modal>
    </div>
  );
};
export default TextModal;
