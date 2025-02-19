import { useSelector } from "react-redux";
import {
  useChangeUserRoleMutation,
  useGetAllUserQuery,
  useBlockedUserMutation,
  useDeleteUserAndHisListingsByAdminMutation,
} from "../../../redux/apis/AdminApi";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Switch,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { green } from "@mui/material/colors";
import { motion } from "framer-motion";
import { useState, useMemo, useRef, useEffect } from "react";
import SingleUser from "./SingleUser";
import Spinner from "../../../components/Spinner";
import socket from "../../../redux/socket";
import CheckPasswordAdmin from "../../../components/CheckPasswordAdmin";
import { useNavigate } from "react-router-dom";

const UsersAdmin = () => {
  const { token, currentUser } = useSelector((state) => state.user);
  const [singleUser, setSingleUser] = useState(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [openPopup, setPopup] = useState(false);
  const [checkPassword, setCheckPassword] = useState(false);

  const [errorPassword, setErrorPassword] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingState, setLoadingState] = useState({});
  const [loadingBlockState, setLoadingBlockState] = useState({});

  const {
    data: AllUsers,
    isLoading,
    refetch,
  } = useGetAllUserQuery({ token, page }, { skip: !token });
  const UserRef = useRef();

  const [
    deleteUserAndHisListingsByAdmin,
    { isLoading: deleteUserLoading, isSuccess },
  ] = useDeleteUserAndHisListingsByAdminMutation();
  useEffect(() => {
    if (AllUsers) {
      setUsers((prev) => {
        const newUsers = AllUsers.All_users.filter(
          (newUser) =>
            newUser?._id !== currentUser?._id &&
            !prev.some((existingUser) => existingUser._id === newUser._id)
        );
        return [...prev, ...newUsers];
      });
    }
  }, [AllUsers]);
  const [changeUserRole, { isLoading: RoleLoading }] =
    useChangeUserRoleMutation();
  const [blockedUser, { isLoading: BlockLoading }] = useBlockedUserMutation();

  const GreenSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: green[600],
      "&:hover": {
        backgroundColor: alpha(green[600], theme.palette.action.hoverOpacity),
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: green[600],
    },
  }));

  const handleChangeRole = async (e, userId) => {
    e.stopPropagation();
    try {
      setLoadingState((pre) => ({ ...pre, [userId]: true }));

      const res = await changeUserRole({ userId, token });
      socket.emit("chenge-role", res.data?.user);

      setLoadingState((pre) => ({ ...pre, [userId]: false }));
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user?._id === userId ? { ...user, isAdmin: !user?.isAdmin } : user
        )
      );
      refetch();
    } catch (error) {
      console.error(error);
      setLoadingState((pre) => ({ ...pre, [userId]: false }));
    }
  };

  const handleBlockedUser = async (e, userId) => {
    e.stopPropagation();
    try {
      setLoadingBlockState((pre) => ({ ...pre, [userId]: true }));

      await blockedUser({ userId, token }).unwrap();
      socket.emit("block-user", userId);
      setLoadingBlockState((pre) => ({ ...pre, [userId]: false }));
      setUsers((prev) =>
        prev.map((user) =>
          user?._id === userId ? { ...user, isBlocked: !user?.isBlocked } : user
        )
      );
      refetch();
    } catch (error) {
      console.error(error);
      setLoadingBlockState((pre) => ({ ...pre, [userId]: false }));
    }
  };

  const handleUserClick = (user) => {
    setSingleUser(user);
  };

  const handleScroll = () => {
    const container = UserRef.current;
    if (
      container.scrollTop + container.clientHeight >= container.scrollHeight &&
      !isLoading &&
      !BlockLoading &&
      !RoleLoading &&
      page < AllUsers?.totalPage
    ) {
      setPage((prev) => prev + 1);
    }
  };

  const handleDeleteUser = (e, user) => {
    e.stopPropagation();
    setSelectedUser(user); // Set the selected user
    setPopup(true); // Open popup
  };

  const handleClosePopup = () => {
    setPopup(false);
    setSelectedUser(null);
    setCheckPassword(false);
  };
  const handleConfirm = async (password) => {
    if (!password) return;
    try {
      await deleteUserAndHisListingsByAdmin({
        token,
        userId: selectedUser?._id,
        password,
      }).unwrap();
      console.log("refecyth in ....");
      
     await refetch();
      
      socket.emit("delete_user", selectedUser?._id);
      
      handleClosePopup();
    } catch (err) {
      setErrorPassword(err);
      console.log(err?.data?.message);
    }
    finally{
      console.log("refecyth in finally ....");
      await refetch();

    }
  };
  const handleConfirmDelete = async () => {
    try {
      if (!selectedUser) return;
      setCheckPassword(true);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  // if (BlockLoading || RoleLoading) return <Spinner />;
  const PopUpDeleteUser = () => (
    <>
      <Dialog
        open={openPopup}
        onClose={handleClosePopup}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete{" "}
            <strong>{selectedUser?.username}</strong> and all related listings?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
  return (
    <>
      <Box
        sx={{ overflowX: "auto", maxWidth: "100%" }}
        component={motion.div}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 w-full bg-gradient-to-r from-gray-50 to-gray-100 rounded-md shadow-lg"
      >
        {!singleUser && (
          <>
          <Box className="flex items-center justify-between mb-4">
            <Typography
              variant="h4"
              component={motion.h4}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center font-bold text-gray-700"
            >
              User Management 
            </Typography>
            <Button variant="outlined">
              Add new user 
            </Button>
          </Box>
            

            {/* Table Section */}
            <TableContainer
              onScroll={handleScroll}
              ref={UserRef}
              component={motion.div}
              sx={{
                overflowX: "auto",
                maxWidth: "100%",
                maxHeight: "680px",
                minHeight: "100px",
              }}
            >
              <Table sx={{ minWidth: 800 }}>
                <TableHead className="sticky top-0 bg-gray-400 z-10">
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Change Role</TableCell>
                    <TableCell>Blocked user</TableCell>
                    <TableCell>Delete user</TableCell>
                    <TableCell>Edit user</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user?._id || Math.random()}
                      component={motion.tr}
                      whileHover={{ scale: 1.0 }}
                      className="hover:bg-gray-100"
                    >
                      <TableCell>{user?.username}</TableCell>
                      <TableCell>{user?.email}</TableCell>
                      <TableCell>{user?.isAdmin ? "Admin" : "User"}</TableCell>
                      <TableCell>
                        {new Date(user?.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: 1, // Spacing between the switch and spinner
                          }}
                        >
                          {!loadingState[user?._id] && (
                            <GreenSwitch
                              defaultChecked={user?.isAdmin}
                              onClick={(e) => handleChangeRole(e, user?._id)}
                            />
                          )}
                          {loadingState[user?._id] && (
                            <CircularProgress className="ml-5" size={24} />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: 1, // Spacing between the switch and spinner
                          }}
                        >
                          {!loadingBlockState[user?._id] && (
                            <GreenSwitch
                              defaultChecked={user?.isBlocked}
                              onClick={(e) => handleBlockedUser(e, user?._id)}
                            />
                          )}
                          {loadingBlockState[user?._id] && (
                            <CircularProgress className="ml-5" size={24} />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={(e) => handleDeleteUser(e, user)}
                          variant="contained"
                          color="error"
                        >
                          Delete
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleUserClick(user)}
                          // onClick={() =>navigate(`/admin/single-user/${user?._id}`)}
                          variant="contained"
                          color="primary"
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {isLoading && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 2 }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  )}
                  {page === AllUsers?.totalPage &&
                    AllUsers?.All_users.length > 0 && (
                      <TableCell colSpan={8}>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          textAlign="center"
                          sx={{ pt: 2 }}
                        >
                          No more user to load.
                        </Typography>
                      </TableCell>
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        {singleUser && (
          <SingleUser
            user={singleUser}
            setSingleUser={setSingleUser}
            refetch={refetch}
          />
        )}
      </Box>
      {PopUpDeleteUser()}
      {
        <CheckPasswordAdmin
          open={checkPassword}
          handleClose={handleClosePopup}
          handleConfirm={handleConfirm}
          loading={deleteUserLoading}
          error={errorPassword}
        />
      }
    </>
  );
};

export default UsersAdmin;
