import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Typography, Avatar } from "@mui/material";
import {
  updateFailure,
  updateStart,
  updateSuccess,
  signOutStart,
  signOutSuccess,
  signOutFailure,
  updateAvatarSuccess,
  deleteAvatarSuccess,
} from "../../redux/user/userSlice";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import DeleteUser from "../../components/DeleteUser";
import { useLogOutUserMutation } from "../../redux/apis/AuthApi";
import LoadingButton from "@mui/lab/LoadingButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddCircleSharpIcon from "@mui/icons-material/AddCircleSharp";
import DashboardSharpIcon from "@mui/icons-material/DashboardSharp";
import ExitToAppSharpIcon from "@mui/icons-material/ExitToAppSharp";
import PersonRemoveSharpIcon from "@mui/icons-material/PersonRemoveSharp";
import DownloadSharpIcon from "@mui/icons-material/DownloadSharp";
import {
  useDeleteUserAvatarMutation,
  useUpdateUserMutation,
  useUploadUserAvatarMutation,
} from "../../redux/apis/UserApi";
import PopUpMessages from "../../components/popup/PopUpMasseges";
import { motion } from "framer-motion";

function Profile() {
  const { currentUser, token, loading, error } = useSelector(
    (state) => state.user
  );

  const fileRef = useRef(null);

  const [file, setFile] = useState(undefined);

  const baseUrl = "http://10.10.30.30:5000";

  const [Popup, setPopup] = useState(false);

  const [formData, setformData] = useState({});

  const dispatch = useDispatch();

  const nav = useNavigate();

  const [logOutUser, { isLoading }] = useLogOutUserMutation();

  const [updateUser, { isSuccess, isLoading: updateIsLoading }] =
    useUpdateUserMutation();

  const [
    uploadUserAvatar,
    {
      isLoading: isLoadinguploadUserAvatar,
      isSuccess: isSuccessuploadUserAvatar,
    },
  ] = useUploadUserAvatarMutation();

  const [deleteUserAvatar, { isLoading: isloadingdeleteUserAvatar }] =
    useDeleteUserAvatarMutation();

  const handleFileUplod = async (file) => {
    const newUploadAvatar = new FormData();
    newUploadAvatar.append("avatar", file);

    try {
      const data = await uploadUserAvatar({
        token,
        file: newUploadAvatar,
      }).unwrap();
      dispatch(updateAvatarSuccess({ data: data?.publicUrl }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (file) {
      handleFileUplod(file);
    }
  }, [file]);

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();    
    try {
      dispatch(updateStart());
      const data = await updateUser({
        ...formData,
        token,
        userId: currentUser?._id,
      });

      dispatch(updateSuccess(data));
      setformData({});
      // nav("/");
    } catch (error) {
      dispatch(updateFailure({ error: error.massage }));
      console.log(error);
    } finally {
      dispatch(updateFailure());
    }
  };

  const setToValueDeleted = () => {
    setPopup(true);
  };

  const callBackFun = (el) => {
    setPopup(el);
  };

  const handleSignOut = async () => {
    dispatch(signOutStart());
    try {
      await logOutUser({ token });
      dispatch(signOutSuccess());
    } catch (err) {
      dispatch(signOutFailure(err));
    }
  };

  const renderPasswordFields = () => {
    if (currentUser?.isGoogle) {
      return currentUser?.isModifiedPassword ? (
        <>
          <input
            type="password"
            id="password"
            placeholder="Current password"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="password"
            id="new_password"
            placeholder="New password"
            className="border p-3 rounded-lg mt-2"
            onChange={handleChange}
          />
        </>
      ) : (
        <input
          type="password"
          id="new_password"
          placeholder="Create new password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
      );
    } else {
      return (
        <>
          <input
            type="password"
            id="password"
            placeholder="Current password"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="password"
            id="new_password"
            placeholder="New password"
            className="border p-3 rounded-lg mt-2"
            onChange={handleChange}
          />
        </>
      );
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await deleteUserAvatar({ token }).unwrap();
      dispatch(deleteAvatarSuccess());
    } catch (error) {
      console.log(error);
    }
  };

  const hideDelete = currentUser?.avatar ? false : true;

  const isFillForm = Object.keys(formData).length > 0;

  if (isLoading) return <Spinner />;
  return (
    <>
  <Box
    display="flex"
    flexWrap="wrap"
    justifyContent="center"
    alignItems="flex-start"
    gap={0}
    padding={0}
    marginTop={15}
    width="100%"
  >
    {/* Left Panel */}
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full sm:w-full md:w-1/4 "
    >
      <Box display="flex" flexDirection="column" alignItems="center" p={3}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={3}
          p={3}
          boxShadow={3}
          width="100%"
          borderRadius={2}
          bgcolor="white"
        >
          <Typography variant="h6" textAlign="center">
            Quick Actions
          </Typography>
          <hr className="w-full" />
          <Button
            onClick={() => nav("/create-listing")}
            variant="contained"
            color="success"
            className="flex w-full gap-3"
          >
            <AddCircleSharpIcon />
            Create Listing
          </Button>

          <Button
            onClick={() => nav("/user-listing")}
            variant="contained"
            color="success"
            className="flex w-full gap-3"
          >
            <DashboardSharpIcon />
            My Listings
          </Button>
        </Box>
      </Box>
    </motion.div>

    {/* Center Panel */}
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={4}
      p={3}
      flexGrow={1}
      className="w-full md:w-2/4"
    >
      {/* Photo Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[1000px]"
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          gap={2}
          p={3}
          borderRadius={2}
          boxShadow={3}
          bgcolor="white"
        >
          <Typography variant="h6">Photo</Typography>
          <hr />

          <section className="flex flex-wrap items-center justify-between gap-4 py-4">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              ref={fileRef}
              hidden
              readOnly
              accept="image/*"
            />
            <Avatar
              src={
                currentUser?.avatar
                  ? baseUrl + currentUser?.avatar
                  : "https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png"
              }
              alt="Avatar"
              sx={{ width: 100, height: 100, cursor: "pointer" }}
              onClick={() => fileRef.current.click()}
            />
            <div className="flex flex-col gap-1">
              <Typography>Choose an image from your computer</Typography>
              <Typography className="opacity-50">
                Maximum size 100x100 px
              </Typography>
              <div className="my-2 flex flex-wrap gap-2">
                <LoadingButton
                  loading={isLoadinguploadUserAvatar}
                  loadingPosition="start"
                  startIcon={<CloudUploadIcon />}
                  variant={`${hideDelete ? "contained" : "outlined"}`}
                  onClick={() => fileRef.current.click()}
                >
                  Upload
                </LoadingButton>
                <LoadingButton
                  variant="contained"
                  loading={isloadingdeleteUserAvatar}
                  loadingPosition="start"
                  startIcon={<DeleteForeverIcon />}
                  color="error"
                  onClick={handleDeleteAvatar}
                  disabled={hideDelete}
                >
                  Delete
                </LoadingButton>
              </div>
              {isSuccessuploadUserAvatar && (
                <PopUpMessages message="Avatar upload successful" code={200} />
              )}
              {isSuccess && (
                <PopUpMessages message="User updated successfully" code={200} />
              )}
            </div>
          </section>
        </Box>
      </motion.div>

      {/* Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[1000px]"
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          gap={2}
          p={3}
          borderRadius={2}
          boxShadow={3}
          bgcolor="white"
        >
          <Typography variant="h6">Information</Typography>
          <hr />
          <section>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                id="username"
                placeholder="Username"
                className="border p-3 rounded-lg"
                onChange={handleChange}
                defaultValue={currentUser?.username}
              />
                {/* <label htmlFor="email">Email :</label> */}
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="border p-3 rounded-lg"
                onChange={handleChange}
                defaultValue={currentUser?.email}
              />
              {/* <label htmlFor="phone">Mobile number :</label> */}
              <input
                type="phone"
                id="phone"
                placeholder="Phone..."
                className="border p-3 rounded-lg"
                onChange={handleChange}
                defaultValue={currentUser?.phone}
              />
              {renderPasswordFields()}
              <div className="flex justify-end">
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={loading || updateIsLoading}
                  loadingPosition="start"
                  disabled={!isFillForm}
                  startIcon={<DownloadSharpIcon />}
                  // className="w-1/4"
                  sx={{fontSize:{xs:"0.6rem" ,md:"1rem" ,lg:"1rem"} , width:{xs:"1/2" , md:"1/4" , lg:"1/6"}}}
                >
                  Update User
                </LoadingButton>
              </div>
            </form>
          </section>
        </Box>
      </motion.div>
    </Box>

    {/* Right Panel */}
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full sm:w-full md:w-1/4 "
    >
      <Box display="flex" flexDirection="column" alignItems="center" p={3}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
          p={3}
          borderRadius={2}
          boxShadow={3}
          bgcolor="white"
          width="100%"
        >
          <Typography variant="h6" textAlign="center">
            Account Management
          </Typography>
          <hr className="w-full" />
          <Button
            variant="contained"
            color="error"
            className="flex w-full gap-3"
            onClick={handleSignOut}
          >
            <ExitToAppSharpIcon /> Sign Out
          </Button>
          <Button
            variant="contained"
            color="error"
            className="flex w-full gap-3"
            onClick={setToValueDeleted}
          >
            <PersonRemoveSharpIcon /> Delete Account
          </Button>
          <DeleteUser open={Popup} setOpen={callBackFun}></DeleteUser>
          <p className="text-red-700 mt-4">{error ? error : ""}</p>
        </Box>
      </Box>
    </motion.div>
  </Box>
  {Popup && <DeleteUser />}
</>

  );
}
export default Profile;
