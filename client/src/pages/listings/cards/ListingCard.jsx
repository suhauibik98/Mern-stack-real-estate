/* eslint-disable react/prop-types */
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Avatar,
  IconButton,
  Skeleton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import { motion } from "framer-motion";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

function ListingCard({ listing, isLoading }) {
  const { _id } = listing || {}; // Handle potential undefined `listing`
  const navigate = useNavigate();
  const baseUrl = `${import.meta.env.VITE_BASEURL}`;
  const location = useLocation();
  const handleToAddWishList = (e) => {
    e.stopPropagation();
  };


  const handleNavigate = () => {
    if (location.pathname === "/" || location.pathname === "/listings-list") {
      navigate(`/card-details/${_id}`, { state: { listing } });
    } else if (location.pathname === "/user-listing") {
      navigate(`/card-update-user/${_id}`, { state: { listing } });
    }
  };
  if (isLoading) {
    return (
      <Card
        sx={{
          width: { xs: "100%", sm: "300px", md: "350px" },
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: 3,
        }}
      >
        <Skeleton variant="rectangular" height={200} animation="wave" />
        <CardContent>
          <Skeleton variant="text" width="80%" animation="wave" />
          <Skeleton variant="text" width="60%" animation="wave" />
          <Skeleton variant="rectangular" height={40} animation="wave" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.0 }}
      whileTap={{ scale: 1.0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          width: { xs: "280px", sm: "300px", md: "350px" },
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 1,
          cursor: "pointer",
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: 1,
          },
        }}
        onClick={handleNavigate}
      >
        <Box position={"relative"} height={"100%"} width={"100%"}>
          <CardMedia
            component="img"
            sx={{
              height: { xs: "140px", sm: "180px", md: "200px" },
              objectFit: "cover",
              objectPosition: "center",
              width: "100%",
            }}
            image={
              `${baseUrl}${listing?.imageUrls[0]}` ||
              "https://via.placeholder.com/300x180"
            }
            alt={listing?.name || "No Image Available"}
            className="hover:scale-105 transition-transform duration-700"
          />
          <Box
            position="absolute"
            top={10}
            left={10}
            bgcolor="#669111"
            color="white"
            zIndex={1}
            borderRadius={2}
            p={0.2}
            px={0.8}
            sx={{
              fontSize: { xs: "0.65rem", sm: "0.85rem", md: "0.80rem" },
              textTransform: "capitalize",
              fontWeight: "500",
            }}
          >
            {listing?.type}
          </Box>
          <Box
            position="absolute"
            bottom={10}
            right={10}
            // bgcolor="#2D7CBF"
            color="white"
            zIndex={1}
            borderRadius={2}
            p={0.2}
            px={0.8}
            sx={{
              fontSize: { xs: "0.65rem", sm: "0.85rem", md: "0.80rem" },
              textTransform: "capitalize",
              fontWeight: "500",
            }}
          >
            <PhotoCameraIcon fontSize="small" /> {listing?.imageUrls?.length}
          </Box>
        </Box>

        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mb: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: { xs: "1rem", sm: "1.2rem" },
            }}
          >
            {listing?.name}
          </Typography>
          <Typography
            variant="body1"
            color="primary"
            fontWeight="bold"
            mb={1}
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            JOD{" "}
            {listing?.offer ? listing?.discountPrice : listing?.regularPrice}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              fontSize: { xs: "0.75rem", sm: "0.85rem" },
            }}
            mb={2}
          >
            {listing?.address}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              fontSize: { xs: "0.75rem", sm: "0.85rem" },
            }}
            mb={2}
          >
            {listing?.description.length > 40
              ? `${listing?.description.slice(0, 40)}...`
              : listing?.description}
          </Typography>
          <hr className="my-2" />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
          >
            <Box display="flex" gap={1}>
              {listing?.bedrooms && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <BedIcon fontSize="small" color="action" />
                  <Typography variant="caption">
                    {listing?.bedrooms} Beds
                  </Typography>
                </Box>
              )}
              {listing?.bathrooms && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <BathtubIcon fontSize="small" color="action" />
                  <Typography variant="caption">
                    {listing?.bathrooms} Baths
                  </Typography>
                </Box>
              )}
              <Box display="flex" alignItems="center" gap={0.5}>
                <SquareFootIcon fontSize="small" color="action" />
                <Typography variant="caption">{listing?.area} m²</Typography>
              </Box>
            </Box>
          </Box>
         {/* <hr className="my-2" />
           <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
          >
            <Box display="flex" alignItems="center">
              <Avatar
                src={baseUrl + listing?.userRef?.avatar}
                alt="user"
                sx={{ width: 32, height: 32, mr: 1 }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                }}
              >
                {listing?.userRef?.username}
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              <IconButton size="small" onClick={handleToAddWishList}>
                <FavoriteBorderIcon fontSize="small" />
              </IconButton>
              <IconButton size="small">
                <ShareIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box> */}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ListingCard;
