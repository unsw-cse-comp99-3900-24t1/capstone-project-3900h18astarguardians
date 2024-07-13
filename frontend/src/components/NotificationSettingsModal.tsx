import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

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

const TextModal = ({ state, setState, open, handleClose, handleConfirm }) => {
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.hasConfirmationEmail}
                  onChange={handleChange}
                  name="hasConfirmationEmail"
                  color="primary"
                />
              }
              label="Receive Confirmation Email"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.hasNotificationEmail}
                  onChange={handleChange}
                  name="hasNotificationEmail"
                  color="primary"
                />
              }
              label="Receive Notification Email"
            />
          </FormControl>
          <br />
          <br />
          <Button
            variant="contained"
            onClick={handleConfirm}
          >
            CONFIRM
          </Button>
        </Box>
      </Modal>
    </div>
  );
};
export default TextModal;
