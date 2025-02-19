import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

export const Header = () => {
  const { currentUser, token } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolling, setScrolling] = useState(false);
  const location = useLocation();
  const baseUrl = `${import.meta.env.VITE_BASEURL}`;

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Function to check if a link is active
  const isActive = (path) => location.pathname === path;
  
   const bgRout = ["/profile" , "/create-listing" , "/card-details" ]
   const isBgDark = bgRout.some((route) => location.pathname.startsWith(route));

  return (
    <>
      {/* Sub-Header */}
      <div className="relative h-full ">
        <div className="bg-gray-900 text-white w-full fixed top-0 z-10 py-2 px-4">
          <div className="max-w-7xl mx-auto flex flex-co md:flex-row justify-between items-center">
            {/* Left Content */}
            <p className="text-[8px] md:text-sm">
              Discover your dream home or land with{" "}
              <em className="text-gray-400">AK RealEstate</em> — your trusted
              partner in finding the best properties.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 ">
              <a href="#" className="text-white hover:text-blue-500">
                <FaFacebook />
              </a>
              <a href="#" className="text-white hover:text-blue-400">
                <FaTwitter />
              </a>
              <a href="#" className="text-white hover:text-blue-700">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Navbar */}
        <AppBar
          sx={{
            position: "fixed",
            // backgroundColor: scrolling ? "#fff" : "#ffffff0d",
            backgroundColor: scrolling ? "#fff" : isBgDark ? "#1f2937 ":"#ffffff0d",
            transition: "all 0.3s ease-in-out",
            boxShadow: scrolling ? 2 : "none",
            padding: "0.5% 10%",
            top: scrolling ? 0 : 35,
          }}
          className="top-8"
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* Logo */}
            <Typography
              variant="subtitle1"
              component={Link}
              to="/"
              sx={{
                fontWeight: "bold",
                color: scrolling ? "#374151" : "white",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
              className="text-7xl"
            >
              AK RealEstate
            </Typography>

            {/* Navigation Links */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 2,
                alignItems: "center",
              }}
            >
              {token ? (
                <>
                  <Typography
                    component={Link}
                    to="/"
                    sx={{
                      color: isActive("/")
                        ? "#86B822"
                        : scrolling
                        ? "#374151"
                        : "white",
                      textDecoration: "none",
                      fontWeight: isActive("/") ? "bold" : "normal",
                      "&:hover": { color: "#afdb56" },
                    }}
                  >
                    Home
                  </Typography>

                  <Typography
                    component={Link}
                    to="/about"
                    sx={{
                      color: isActive("/about")
                        ? "#86B822"
                        : scrolling
                        ? "#374151"
                        : "white",
                      textDecoration: "none",
                      fontWeight: isActive("/about") ? "bold" : "normal",
                      "&:hover": { color: "#afdb56" },
                    }}
                  >
                    About
                  </Typography>
                  <Typography
                    component={Link}
                    to="/contact"
                    sx={{
                      color: isActive("/contact")
                        ? "#86B822"
                        : scrolling
                        ? "#374151"
                        : "white",
                      textDecoration: "none",
                      fontWeight: isActive("/contact") ? "bold" : "normal",
                      "&:hover": { color: "#afdb56" },
                    }}
                  >
                    Contact
                  </Typography>
                  <Typography
                    component={Link}
                    to="/listings-list"
                    sx={{
                      color: isActive("/listings-list")
                        ? "#86B822"
                        : scrolling
                        ? "#374151"
                        : "white",
                      textDecoration: "none",
                      fontWeight: isActive("/listings-list")
                        ? "bold"
                        : "normal",
                      "&:hover": { color: "#afdb56" },
                    }}
                  >
                    Listings
                  </Typography>

                  {currentUser?.isAdmin && (
                    <Typography
                      component={Link}
                      to="/dashboard"
                      sx={{
                        color: isActive("/dashboard")
                          ? "#86B822"
                          : scrolling
                          ? "#374151"
                          : "white",
                        textDecoration: "none",
                        fontWeight: isActive("/dashboard") ? "bold" : "normal",
                        "&:hover": { color: "#afdb56" },
                      }}
                    >
                      Dashboard
                    </Typography>
                  )}

                  <IconButton component={Link} to="/profile">
                    <Avatar
                      src={
                        currentUser?.avatar
                          ? `${baseUrl}${currentUser.avatar}`
                          : "https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png"
                      }
                      alt="profile"
                    />
                  </IconButton>
                  {/* <Typography sx={{color: isActive("/listings")
                      ? "#86B822"
                      : scrolling
                      ? "#374151"
                      : "white",}} variant="subtitle2">
                  <Typography  variant="subtitle2">
                    {currentUser?.username}
                  </Typography>
                  <Typography variant="subtitle2">
                    {currentUser?.email}
                  </Typography>
                </Typography> */}
                </>
              ) : (
                <>
                  <Typography
                    component={Link}
                    to="/"
                    sx={{
                      color: isActive("/")
                        ? "#86B822"
                        : scrolling
                        ? "#374151"
                        : "white",
                      textDecoration: "none",
                      fontWeight: isActive("/") ? "bold" : "normal",
                      "&:hover": { color: "#afdb56" },
                    }}
                  >
                    Home
                  </Typography>

                  <Typography
                    component={Link}
                    to="/about"
                    sx={{
                      color: isActive("/about")
                        ? "#86B822"
                        : scrolling
                        ? "#374151"
                        : "white",
                      textDecoration: "none",
                      fontWeight: isActive("/about") ? "bold" : "normal",
                      "&:hover": { color: "#afdb56" },
                    }}
                  >
                    About
                  </Typography>
                  <Typography
                    component={Link}
                    to="/contact"
                    sx={{
                      color: isActive("/contact")
                        ? "#86B822"
                        : scrolling
                        ? "#374151"
                        : "white",
                      textDecoration: "none",
                      fontWeight: isActive("/contact") ? "bold" : "normal",
                      "&:hover": { color: "#afdb56" },
                    }}
                  >
                    Contact
                  </Typography>
                  <Typography
                    component={Link}
                    to="/sign-in"
                    sx={{
                      color: isActive("/sign-in")
                        ? "#86B822"
                        : scrolling
                        ? "#374151"
                        : "white",
                      fontWeight: isActive("/sign-in") ? "bold" : "medium",
                      textDecoration: "none",
                      "&:hover": { color: "#afdb56" },
                    }}
                  >
                    Sign in
                  </Typography>
                  <Typography
                    component={Link}
                    to="/sign-up"
                    sx={{
                      color: isActive("/sign-up")
                        ? "#86B822"
                        : scrolling
                        ? "#374151"
                        : "white",
                      fontWeight: isActive("/sign-up") ? "bold" : "medium",
                      textDecoration: "none",
                      "&:hover": { color: "#afdb56" },
                    }}
                  >
                    Sign up
                  </Typography>
                </>
              )}
            </Box>

            {/* Mobile Menu */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton edge="start" color="inherit" onClick={handleMenuOpen}>
                <MenuIcon sx={{ color: scrolling ? "black" : "white" }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {token ? (
                  <>
                    <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                      Home
                    </MenuItem>
                    
                    <MenuItem
                      component={Link}
                      to="/about"
                      onClick={handleMenuClose}
                    >
                      About
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/listings-list"
                      onClick={handleMenuClose}
                    >
                      Listings
                    </MenuItem>
                    {currentUser?.isAdmin && (
                      <MenuItem
                        component={Link}
                        to="/dashboard"
                        onClick={handleMenuClose}
                      >
                        Dashboard
                      </MenuItem>
                    )}
                    <MenuItem
                      component={Link}
                      to="/profile"
                      onClick={handleMenuClose}
                    >
                      Profile
                    </MenuItem>
                  </>
                ) : (
                  <>
                   <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                      Home
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/about"
                      onClick={handleMenuClose}
                    >
                      About
                    </MenuItem>
                    <MenuItem component={Link} to="/contact" onClick={handleMenuClose}>
                    contact
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/sign-in"
                      onClick={handleMenuClose}
                    >
                      Sign in
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/sign-up"
                      onClick={handleMenuClose}
                    >
                      Sign up
                    </MenuItem>
                  </>
                )}
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      </div>
    </>
  );
};
