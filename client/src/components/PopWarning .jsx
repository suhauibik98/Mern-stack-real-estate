import React from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";

function PopWarning({ open, handleClose, message }) {
    return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Warning</DialogTitle>
      <DialogContent>You have been {message}.</DialogContent>
      <Button  onClick={handleClose}>Close</Button>
    </Dialog>
  );
}

export default PopWarning;
