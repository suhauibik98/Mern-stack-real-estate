import { useDispatch, useSelector } from "react-redux";
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
import CreateNewUser from "./CreateNewUser";
import Spinner from "../../../components/Spinner";
import socket from "../../../redux/socket";
import CheckPasswordAdmin from "../../../components/CheckPasswordAdmin";
import { useNavigate } from "react-router-dom";
import { setAllUsers } from "../../../redux/user/allUsersSlice";
import AddIcon from '@mui/icons-material/Add';

const UsersAdmin = () => {
  const { token, currentUser } = useSelector((state) => state.user);
  const { allUsers } = useSelector((state) => state.allUsers);
  
  const dispatch = useDispatch();
  const [singleUser, setSingleUser] = useState(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [openPopup, setPopup] = useState(false);
  const [openPopupAdd, setPopupAdd] = useState(false);
  const [checkPassword, setCheckPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingState, setLoadingState] = useState({});
  const [loadingBlockState, setLoadingBlockState] = useState({});
  
  const { data: AllUsers, isLoading, refetch } = useGetAllUserQuery({ token, page }, { skip: !token });
  
  const UserRef = useRef();

  const [deleteUserAndHisListingsByAdmin, { isLoading: deleteUserLoading, isSuccess }] = useDeleteUserAndHisListingsByAdminMutation();
  
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
  }, [AllUsers ,  dispatch]);
  
  useEffect(() => {
    if (users) {
      dispatch(setAllUsers(users));
    }
  }, [users]);
  
  const [changeUserRole, { isLoading: RoleLoading }] = useChangeUserRoleMutation();
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
      await refetch();
      socket.emit("delete_user", selectedUser?._id);
      handleClosePopup();
    } catch (err) {
      setErrorPassword(err);
      console.log(err?.data?.message);
    }
  };

  const handleConfirmDelete = async () => {
    setCheckPassword(true);
  };

  const PopUpDeleteUser = () => (
    <Dialog
      open={openPopup}
      onClose={handleClosePopup}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">Delete User</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Are you sure you want to delete <strong>{selectedUser?.username}</strong> and all related listings?
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
  );

  const AddNewUser = () => (
    <Dialog
      open={openPopupAdd}
      onClose={() => setPopupAdd((pre) => !pre)}
      aria-labelledby="add-dialog-title"
    >
      <DialogTitle id="add-dialog-title" className="text-center">Add User</DialogTitle>
      <DialogContent>
        <CreateNewUser setPopupAdd={setPopupAdd} />
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <Box
        sx={{
          maxWidth: "90vw",
          padding: { xs: "8px", sm: "16px", md: "24px" },
          margin: "auto",
          overflowX: "auto",
        }}
        component={motion.div}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-gradient-to-r from-gray-50 to-gray-100 rounded-md shadow-lg"
      >
        {!singleUser && (
          <>
            <Box className="flex items-center justify-between mb-4">
              <Typography
                variant="h6"
                component={motion.h4}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "gray.700",
                  fontSize: { xs: "16px", sm: "18px", md: "20px" },
                }}
              >
                User Management
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setPopupAdd(true)}
                sx={{ fontSize: { xs: "12px", sm: "14px", md: "14px" } }}
              >
                Add new user <AddIcon fontSize="small" />
              </Button>
            </Box>

            {/* Table Section */}
            <TableContainer
              onScroll={handleScroll}
              ref={UserRef}
              component={motion.div}
              sx={{
                minWidth: "10%",
                overflow: "auto",
                maxHeight: {xs:"500px",md:"680px"},
                minHeight: "100px",
              }}
            >
              <Table>
                <TableHead className="sticky top-0 bg-gray-400 z-10">
                  <TableRow>
                    <TableCell sx={{fontSize:{xs:"10px",md:"14px"}}}>#</TableCell>
                    <TableCell sx={{fontSize:{xs:"10px",md:"14px"}}}>Name</TableCell>
                    <TableCell sx={{fontSize:{xs:"10px",md:"14px"}}}>Email</TableCell>
                    <TableCell sx={{fontSize:{xs:"10px",md:"14px"}}}>Role</TableCell>
                    <TableCell sx={{fontSize:{xs:"10px",md:"14px"}}}>Created At</TableCell>
                    <TableCell sx={{fontSize:{xs:"10px",md:"14px"}}}>Change Role</TableCell>
                    <TableCell sx={{fontSize:{xs:"10px",md:"14px"}}}>Blocked user</TableCell>
                    <TableCell sx={{fontSize:{xs:"10px",md:"14px"}}}>Delete user</TableCell>
                    <TableCell sx={{fontSize:{xs:"10px",md:"14px"}}}>Edit user</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody >
                  {allUsers.map((user, index) => (
                    <TableRow
                      key={user?._id || Math.random()}
                      component={motion.tr}
                      whileHover={{ scale: 1.0 }}
                      className="hover:bg-gray-100"
                      
                    
                    >
                      {[index + 1, user?.username, user?.email, user?.isAdmin ? "Admin" : "User", new Date(user?.createdAt).toLocaleDateString(), 
                      <Box sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1 }}>
                        {!loadingState[user?._id] && (
                          <GreenSwitch
                          sx={{fontSize:{xs:"1px",md:"1px"}}}
                            defaultChecked={user?.isAdmin}
                            onClick={(e) => handleChangeRole(e, user?._id)}
                          />
                        )}
                        {loadingState[user?._id] && <CircularProgress className="ml-5" size={24} />}
                      </Box>, 
                      <Box sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1 }}>
                        {!loadingBlockState[user?._id] && (
                          <GreenSwitch
                            defaultChecked={user?.isBlocked}
                            onClick={(e) => handleBlockedUser(e, user?._id)}
                          />
                        )}
                        {loadingBlockState[user?._id] && <CircularProgress className="ml-5" size={24} />}
                      </Box>, 
                      <Button sx={{fontSize:{xs:"10px", md:"14px"}}} onClick={(e) => handleDeleteUser(e, user)} variant="contained" color="error">
                        Delete
                      </Button>, 
                      <Button sx={{fontSize:{xs:"10px", md:"14px"}}} onClick={() => handleUserClick(user)} variant="contained" color="primary">
                        Edit
                      </Button>].map((item, index) => (
                        <TableCell sx={{fontSize:{xs:"10px",md:"14px"}}} key={index}>{item}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {isLoading && (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                      <CircularProgress size={24} />
                    </Box>
                  )}
                  {page === AllUsers?.totalPage && AllUsers?.All_users.length > 0 && (
                    <TableCell colSpan={9}>
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
      {openPopupAdd && AddNewUser()}
      <CheckPasswordAdmin
        open={checkPassword}
        handleClose={handleClosePopup}
        handleConfirm={handleConfirm}
        loading={deleteUserLoading}
        error={errorPassword}
      />
    </>
  );
};

export default UsersAdmin;
