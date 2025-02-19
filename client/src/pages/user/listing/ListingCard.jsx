/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
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

// eslint-disable-next-line react/prop-types
function ListingCard({ listing, isLoading }) {
  
  const { _id } = listing || {}; // Handle potential undefined `listing`
  const Navigate = useNavigate();
const baseUrl = `${import.meta.env.VITE_BASEURL}`
  if (isLoading) {
    // Skeleton loader while data is being fetched
    return (
      <Card
        sx={{
          maxWidth: 300,
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: 3,
        }}
      >
        <Skeleton variant="rectangular" height={280} animation="wave" />
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
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          maxWidth: 600,
          borderRadius: 1,
          overflow: "hidden",
          boxShadow: 0,
          cursor: "pointer",
             
        }}
        onClick={() => Navigate(`/card-update-user/${_id}`, { state: { listing } })}
      >
        <CardMedia
          component="img"
          style={{
            height: 200,
            objectFit: "cover",
            width:"100%",
            position: "relative",
          }}
          image={`${baseUrl}${listing?.imageUrls[0]}` || "https://via.placeholder.com/300x180"}
          alt={listing?.name || "No Image Available"}
        />
        <Box position="absolute" top={0} left={0} bgcolor="green" color="white" p={1}>
          {listing.type}
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
            }}
          >
            {listing.name}
          </Typography>
          <Typography variant="body1" color="primary" fontWeight="bold" mb={1}>
            JOD {listing.offer ? listing?.discountPrice : listing?.regularPrice}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            mb={2}
          >
            {listing.description}
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" gap={1}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <BedIcon fontSize="small" color="action" />
                <Typography variant="caption">{listing.bedrooms} Beds</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <BathtubIcon fontSize="small" color="action" />
                <Typography variant="caption">{listing.bathrooms} Baths</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <SquareFootIcon fontSize="small" color="action" />
                <Typography variant="caption">{listing.area} m²</Typography>
              </Box>
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
              <Avatar
                src={listing.userRef?.avatar}
                alt="user"
                sx={{ width: 32, height: 32, mr: 1 }}
              />
              <Typography variant="caption">{listing.userRef?.username}</Typography>
            </Box>
            <Box display="flex" gap={1}>
              <IconButton size="small">
                <FavoriteBorderIcon fontSize="small" />
              </IconButton>
              <IconButton size="small">
                <ShareIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ListingCard;
