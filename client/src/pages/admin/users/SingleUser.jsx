import PropTypes from "prop-types";
import {
  Input,
  FormGroup,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  useDeleteUserListingsAdminMutation,
  useGetUserListingsAdminQuery,
  useUpdateUserMutation,
} from "../../../redux/apis/AdminApi";
import { useSelector } from "react-redux";
import { useState } from "react";
import PopUpMessages from "../../../components/popup/PopUpMasseges";
import { motion } from "framer-motion";

const SingleUser = ({ user, setSingleUser, refetch }) => {
  const [form, setForm] = useState({});
  const [page, setPage] = useState(1);
  const [updateUser] = useUpdateUserMutation();
  const { token } = useSelector((state) => state.user);
  const [popupMessage, setPopupMessage] = useState(null);
  const {
    data: userListing,
    isLoading,
    refetch: RefetchList,
  } = useGetUserListingsAdminQuery(
    { token, userId: user?._id, page },
    { skip: !user?._id }
  );

  const [deleteUserListingsAdmin, { isLoading: deleteLoading }] =
    useDeleteUserListingsAdminMutation();
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    listingId: null,
  });

  const handleClose = () => {
    setSingleUser(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (Object.keys(form).length === 0) {
      setPopupMessage({ message: "No changes detected.", code: 400 });
      return;
    }

    try {
      await updateUser({
        token,
        userId: user?._id,
        formData: { ...form },
      });
      setPopupMessage({ message: "User updated successfully!", code: 200 });
      refetch();
    } catch (error) {
      setPopupMessage({ message: "Error updating user.", code: 500 });
    }
  };
  console.log(userListing);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDeleteListingUser = async () => {
    try {
      await deleteUserListingsAdmin({
        token,
        Listings_id: deleteDialog.listingId,
      }).unwrap();
      RefetchList();
      setPopupMessage({ message: "Listing deleted successfully!", code: 200 });
    } catch (error) {
      setPopupMessage({ message: "Error deleting listing.", code: 500 });
    } finally {
      setDeleteDialog({ open: false, listingId: null });
    }
  };

  const openDeleteDialog = (listingId) => {
    setDeleteDialog({ open: true, listingId });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, listingId: null });
  };

  const isFormChanged = Object.keys(form).length > 0;

  return (
    <>
      {popupMessage && (
        <PopUpMessages
          message={popupMessage.message}
          code={popupMessage.code}
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="rounded-lg shadow-lg bg-white p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Update User</h2>
          <Button
            onClick={handleClose}
            variant="contained"
            color="primary"
            className="px-4 py-2 text-white"
          >
            Close
          </Button>
        </div>
        <form onSubmit={handleUpdateUser} className="space-y-6">
          {/* Form content */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <label htmlFor="username" className="flex-1 block">
              <span className="text-sm font-medium text-gray-700 mb-1 block">
                Name
              </span>
              <Input
                type="text"
                value={form.username ?? user?.username}
                placeholder="Enter name"
                className="border p-3 rounded-lg w-full"
                id="username"
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="email" className="flex-1 block">
              <span className="text-sm font-medium text-gray-700 mb-1 block">
                Email
              </span>
              <Input
                type="email"
                value={form.email ?? user?.email}
                placeholder="Enter email"
                className="border p-3 rounded-lg w-full"
                id="email"
                onChange={handleChange}
                required
                />
            </label>
            <label htmlFor="phone" className="flex-1 block">
              <span className="text-sm font-medium text-gray-700 mb-1 block">
                Phone
              </span>
              <Input
                type="phone"
                placeholder="Enter phone"
                value={form.phone ?? user?.phone}
                className="border p-3 rounded-lg w-full"
                id="phone"
                onChange={handleChange}
              />
            </label>
            <label htmlFor="password" className="flex-1 block">
              <span className="text-sm font-medium text-gray-700 mb-1 block">
                Password
              </span>
              <Input
                type="password"
                placeholder="Enter password"
                className="border p-3 rounded-lg w-full"
                id="password"
                onChange={handleChange}
              />
            </label>
            
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isFormChanged}
            className="w-full py-2 text-white"
          >
            Update
          </Button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="rounded-lg shadow-lg bg-white p-6 mt-5"
      >
        <h2 className="text-lg font-bold mb-3">
          User Listings ({userListing?.totalListing || 0})
        </h2>
        <TableContainer className="max-h-80">
          <Table>
            <TableHead className="sticky top-0 bg-gray-50 z-10">
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>estateSubType</TableCell>
                <TableCell>estateType</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userListing?.listings.map((card, k) => (
                <TableRow
                  key={card.id || k}
                  className="hover:bg-gray-100"
                >
                  <TableCell>{card?.name}</TableCell>
                  <TableCell>{card?.address}</TableCell>
                  <TableCell>
                    {new Date(card?.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{card?.estateSubType}</TableCell>
                  <TableCell>{card?.estateType}</TableCell>
                  <TableCell className="left-0">
                    <Button
                      color="error"
                      variant="contained"
                      className="py-2 text-white"
                      onClick={() => openDeleteDialog(card?._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="flex justify-center mt-4">
          <Pagination
            count={userListing?.totalPage}
            page={page}
            onChange={handlePageChange}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Listing</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this listing? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteListingUser}
            color="secondary"
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

SingleUser.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  refetch: PropTypes.func,
  setSingleUser: PropTypes.func.isRequired,
};

export default SingleUser;
