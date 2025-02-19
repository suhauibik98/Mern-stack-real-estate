import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signOutSuccess,
} from "./redux/user/userSlice";
import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import { useLogedUserMutation } from "./redux/apis/AuthApi";
import Spinner from "./components/Spinner";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Profile from "./pages/user/Profile";
import { Header } from "./pages/header/Header";
import Prodector from "./components/Prodector";
import { CardDetails } from "./pages/listings/deitals/CardDeitails";
import UpdateListing from "./pages/listings/update/UpdateListing";
import UpdateListingUser from "./pages/user/listing/UpdateListingUser";
import AdminProdector from "./components/AdminProdector";
import DashBorder from "./pages/admin/dashborder/DashBorder";
import UserListings from "./pages/user/listing/UserListings";
import ChoseType from "./pages/listings/create/ChoseType";
import ListingsList from "./pages/listings_list/ListingsList";
import Footer from "./pages/footer/Footer";
import Contact from "./pages/contact/Contact";
import socket from "./redux/socket";
import PopWarning from "./components/PopWarning ";

function App() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const { currentUser, token, loading } = user;

  const [logedUser, logedUserResponse] = useLogedUserMutation();

  const [isAuthResolved, setIsAuthResolved] = useState(false); // Track if auth state is resolved

  const [popupWaring, setPopWaring] = useState(false);

  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    if (currentUser === null && token) {
      logedUser({ token });
      dispatch(signInStart());
    } else {
      setIsAuthResolved(true); // If no token, auth state is resolved
    }
  }, [currentUser, token]);

  useEffect(() => {
    if (!logedUserResponse.isLoading && !logedUserResponse.isUninitialized) {
      if (logedUserResponse.isError) {
        dispatch(signOutSuccess());
      } else {
        dispatch(
          signInSuccess({ currentUser: { ...logedUserResponse?.data }, token })
        );
      }
      setIsAuthResolved(true); // Auth state is resolved
    }
  }, [logedUserResponse]);

  useEffect(() => {
    if (token && currentUser?._id) {
      socket.emit("register", currentUser?._id);
    }
  }, [token, currentUser]);

  const handleClose = () => {
    setPopWaring(false);
    dispatch(signOutSuccess());
  };

  useEffect(() => {
    const handleBlocked = () => {
      if (currentUser) {
        setPopWaring(true);
        setPopupMessage("Blocked");
      }
    };
    // const handleBlocked = () => dispatch(signOutSuccess());
    // const handleDeleteUser = () => dispatch(signOutSuccess());
    const handleDeleteUser = () => {
      if (currentUser) {
        setPopWaring(true);
        setPopupMessage("Deleted");
      }
    };
    const handleRoleChange = (data) =>
      dispatch(signInSuccess({ currentUser: { ...data }, token }));

    socket.on("blocked", handleBlocked);
    socket.on("chenge-role-done", handleRoleChange);
    socket.on("delete_user", handleDeleteUser);

    return () => {
      socket.off("blocked", handleBlocked);
      socket.off("chenge-role-done", handleRoleChange);
      socket.off("delete_user", handleDeleteUser);
    };
  }, [dispatch, token]);

  // Show a spinner while auth state is being resolved
  if (!isAuthResolved || logedUserResponse.isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <BrowserRouter>
        {currentUser?.isAdmin ? (
           <Routes>
           <Route
             path="/admin/*"
             element={
               <Prodector>
                 <AdminProdector>
                   <DashBorder />
                 </AdminProdector>
               </Prodector>
             }
           />
           <Route path="*" element={<Navigate to="/admin/home" />} />
         </Routes>
        ) : (
          <>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/profile"
                element={
                  <Prodector>
                    <Profile />
                  </Prodector>
                }
              />
              <Route
                path="/create-listing"
                element={
                  <Prodector>
                    <ChoseType />
                  </Prodector>
                }
              />
              <Route
                path="/card-details/:cardId"
                element={
                  <Prodector>
                    <CardDetails />
                  </Prodector>
                }
              />
              <Route
                path="/card-update/:cardId"
                element={
                  <Prodector>
                    <UpdateListing />
                  </Prodector>
                }
              />
              <Route
                path="/card-update-user/:cardId"
                element={
                  <Prodector>
                    <UpdateListingUser />
                  </Prodector>
                }
              />
              <Route
                path="/user-listing"
                element={
                  <Prodector>
                    <UserListings />
                  </Prodector>
                }
              />
              <Route
                path="/listings-list"
                element={
                  <Prodector>
                    <ListingsList />
                  </Prodector>
                }
              />
              <Route
                path="/sign-in"
                element={currentUser ? <Navigate to="/" /> : <SignIn />}
              />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Footer />
          </>
        )}
      </BrowserRouter>
      <PopWarning
        open={popupWaring}
        message={popupMessage}
        handleClose={handleClose}
      />
    </>
  );
}

export default App;
