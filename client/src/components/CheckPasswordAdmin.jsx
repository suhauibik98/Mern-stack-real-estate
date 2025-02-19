import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
} from "@mui/material";

const CheckPasswordAdmin = ({
  open,
  loading,
  handleClose,
  handleConfirm,
  error,
}) => {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (password.trim()) {
      handleConfirm(password);
      setPassword(""); // Reset input after confirmation
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Enter Admin Password</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error?.data?.message && (
            <Typography variant="subtitle2" color="error">
              {error.data.message}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            loading={loading}
            type="submit"
            color="error"
            variant="contained"
            disabled={loading}
          >
            Confirm
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CheckPasswordAdmin;
