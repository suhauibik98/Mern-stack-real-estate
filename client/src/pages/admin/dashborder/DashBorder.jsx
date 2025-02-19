import { useEffect, useState } from "react";
import {
  Home,
  Person,
  Info,
  ListAlt,
  Dashboard,
  Edit,
  CreditCard,
  Menu,
  Close,
} from "@mui/icons-material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Avatar,
  Button,
  Tooltip,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import AdminProdector from "../../../components/AdminProdector";
import HomeAdmin from "../adminHome/HomeAdmin";
import UsersAdmin from "../users/UsersAdmin";
import SingleUser from "../users/SingleUser";
import Profile from "../profile/Profile";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../../../redux/user/userSlice";
import { useGetMessegesFromDBQuery } from "../../../redux/apis/AdminApi";

const DashBorder = () => {
  const { currentUser, token, loading, error } = useSelector(
    (state) => state.user
  );
  const baseUrl = "http://10.10.30.30:5000";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [ItemNav, setItemNav] = useState({
    label: "Home",
    icon: <Home />,
    path: "/admin/home",
  });


// const {data , isLoading} = useGetMessegesFromDBQuery({token})
// console.log(data);

  const navItems = [
    { label: "Home", icon: <Home />, path: "/admin/home" },
    { label: "About", icon: <Info />, path: "/admin/about" },
    { label: "Users", icon: <Person />, path: "/admin/users" },
    { label: "Profile", icon: <Dashboard />, path: "/admin/profile" },
    {
      label: "Create Listing",
      icon: <ListAlt />,
      path: "/admin/create-listing",
    },
    {
      label: "Card Details",
      icon: <CreditCard />,
      path: "/admin/card-details",
    },
    { label: "Card Update", icon: <Edit />, path: "/admin/card-update" },
  ];

function ali() {
var a = 2 ;
var b  = function(){
  console.log(a * 2);
}  
return b
}

console.log(ali()());


  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    dispatch(signOutSuccess());
    navigate("/login");
    setIsLogoutDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex"
      >
        <motion.div
          initial={{ x: isSidebarCollapsed ? -200 : 0 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className={`${
            isSidebarCollapsed ? "w-20 items-center" : "w-64"
          } bg-gray-800 text-white p-4 min-h-screen shadow-lg flex flex-col  transition-all duration-300`}
        >
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="flex justify-between items-center mb-4 text-gray-100 hover:text-white"
          >
            {!isSidebarCollapsed && (
              <h1 className="text-lg font-semibold flex items-center gap-2">
                <Dashboard className="text-xl" /> Dashboard
              </h1>
            )}
            <Menu />
          </button>

          <ul className="flex flex-col gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => setItemNav(item)}
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-700 transition ${
                    isActive ? "bg-gray-700" : ""
                  }`
                }
              >
                <li className="flex items-center gap-1 w-full">
                  <Tooltip arrow placement="right" title={item.label}>
                    <span>{item.icon}</span>
                  </Tooltip>
                  {!isSidebarCollapsed && (
                    <span className="text-sm w-full font-semibold">
                      {item.label}
                      <NavigateNextIcon
                        sx={{ float: "right" }}
                        fontSize="small"
                      />
                    </span>
                  )}
                </li>
              </NavLink>
            ))}
          </ul>

          {/* Profile Section */}
          <div className="mt-auto">
            <NavLink to="/admin/profile">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 p-2 rounded-md mb-2 bg-gray-700"
              >
                <Avatar
                  src={
                    currentUser?.avatar
                      ? baseUrl + currentUser?.avatar
                      : "https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png"
                  }
                />
                {!isSidebarCollapsed && (
                  <span className="text-sm font-semibold">
                    {currentUser?.username}
                  </span>
                )}
              </motion.div>
            </NavLink>
            <Button
              variant="contained"
              color="error"
              onClick={() => setIsLogoutDialogOpen(true)}
              className="w-full mt-2 text-white "
              startIcon={<LogoutIcon />}
            >
              {!isSidebarCollapsed && "Logout"}
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Mobile Sidebar */}
              <motion.div
                initial={{ x: -400 }}
                animate={{ x: 0 }}
                exit={{ x: -400 }}
                transition={{ duration: 0.5 }}
                className="fixed flex flex-col justify-between top-0 left-0 w-64 h-full bg-gray-800 text-white p-4 shadow-lg z-50"
              >
                <ul className="mt-1 flex flex-col gap-1">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-white flex items-center justify-between"
                  >
                    <span className="text-xl font-extrabold">Dashborder</span>
                    <Close />
                  </button>
                  {navItems.map((item) => (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      onClick={() => {
                        setItemNav(item);
                        setIsMobileMenuOpen(false);
                      }}
                      className={({ isActive }) =>
                        `flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-700 transition ${
                          isActive ? "bg-gray-700" : ""
                        }`
                      }
                    >
                      <li className="flex items-center gap-1 w-full">
                        <Tooltip arrow placement="right" title={item.label}>
                          <span>{item.icon}</span>
                        </Tooltip>
                        <span className="text-sm w-full font-semibold">
                          {item.label}
                        </span>
                      </li>
                    </NavLink>
                  ))}
                </ul>

                {/* Profile Section */}
                <div className="mt-auto">
                  <NavLink to="/admin/profile" onClick={() => {
                        setIsMobileMenuOpen(false);
                      }}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center gap-2 p-2 mb-2 rounded-md bg-gray-600"
                    >
                      <Avatar
                        src={
                          currentUser?.avatar
                            ? baseUrl + currentUser?.avatar
                            : "https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png"
                        }
                      />
                      <span className="text-sm font-semibold">
                        {currentUser?.username}
                      </span>
                    </motion.div>
                  </NavLink>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setIsLogoutDialogOpen(true)}
                    className="w-full mt-2 text-white hover:bg-gray-700"
                    startIcon={<LogoutIcon />}
                  >
                    Logout
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`flex-1 p-6 ${
          isSidebarCollapsed ? "md:ml-0" : "md:ml-"
        } transition-all duration-300`}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold bg-gray-200 w-full p-2 mx-1 rounded-xl text-gray-700 uppercase">
            {ItemNav.label}
          </h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden bg-gray-800 text-white p-2 rounded-md"
          >
            <Menu />
          </button>
        </div>

        <Routes>
          <Route
            path="/home"
            element={
              <AdminProdector>
                <HomeAdmin />
              </AdminProdector>
            }
          />
          <Route
            path="/users"
            element={
              <AdminProdector>
                <UsersAdmin />
              </AdminProdector>
            }
          />
          <Route
            path="/profile"
            element={
              <AdminProdector>
                <Profile />
              </AdminProdector>
            }
          />
          <Route
            path="/single-user/:id"
            element={
              <AdminProdector>
                <SingleUser />
              </AdminProdector>
            }
          />
          <Route path="*" element={<HomeAdmin />} />
        </Routes>
      </motion.div>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
      >
        <DialogTitle variant="body1">Are you sure you want to logout?</DialogTitle>
        <DialogActions>
          <Button size="small" onClick={() => setIsLogoutDialogOpen(false)}>Cancel</Button>
          <Button size="small" onClick={handleLogout} color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DashBorder;
