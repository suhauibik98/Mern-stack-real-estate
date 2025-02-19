import { useSelector, useDispatch } from "react-redux";
import {
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
} from "../redux/user/userSlice";
import Spinner from "./Spinner";
import { useDeleteUserMutation } from "../redux/apis/UserApi";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

// eslint-disable-next-line react/prop-types
const DeleteUser = ({ open, setOpen }) => {
  const { currentUser, token } = useSelector((state) => state.user);
  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      // const res = await fetch(`/api/user/delete/${currentUser._id}`, {
      //   method: "DELETE",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      // const data = await res.json();
      await deleteUser({ token: token, userId: currentUser._id });
      dispatch(deleteUserSuccess());
    } catch (error) {
      console.error(error);
      dispatch(deleteUserFailure(error));
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    open && (
      <>
        <Dialog
          open={open}
          onClose={handleCancel}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">Delete User</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete this user?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              color="error"
              // disabled={deleteLoading}
            >
              {/* {isLoading ? "Deleting..." : "Delete"} */}
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        {isLoading && <Spinner></Spinner>}
      </>
    )
  );
};

export default DeleteUser;
