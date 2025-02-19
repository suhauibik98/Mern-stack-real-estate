import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetListingByIdQuery } from "../../../redux/apis/ListingApi";
import { Box, Typography, Button, Skeleton, Grid } from "@mui/material";
import { circIn, motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
// import GoogleMapReact from "google-map-react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Map from "../../../components/Map";
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const ActionBox = ({ title, buttons }) => (
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
      {title}
    </Typography>
    <hr className="w-full" />
    {buttons.map(({ label, onClick }, idx) => (
      <Button
        key={idx}
        onClick={onClick}
        variant="contained"
        className="flex w-full gap-3"
      >
        {label}
      </Button>
    ))}
  </Box>
);

export const CardDetails = () => {
  const params = useParams();
  const { token, currentUser } = useSelector((state) => state.user);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, isLoading, error, refetch } = useGetListingByIdQuery(
    { token, Listings_id: params?.cardId },
    { skip: !params.cardId }
  );

  useEffect(() => {
    refetch();
  }, [params?.cardId, refetch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const listing = useMemo(() => data || {}, [data]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h6" color="error">
          Failed to load listing details. Please try again.
        </Typography>
      </Box>
    );
  }

  const {
    name,
    description,
    address,
    city,
    bathrooms,
    bedrooms,
    furnished,
    estateSubType,
    offer,
    parking,
    discountPrice,
    regularPrice,
    type,
    updatedAt,
    area,
    estateType,
    plateNum,
    alhood,
    imageUrls = [],
    latitude = undefined,
    longitude = undefined,
    _id,
  } = listing;

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
      gap={2}
      padding={2}
      marginTop={12}
      width="100%"
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[800px]"
      >
        <div className="flex gap-2 mt-6">
          <span className="text-center h-full leading-5 py-1 px-4 hover:cursor-pointer hover:bg-[#3986e4d2] bg-[#3987E4] rounded  text-white">
            {type}
          </span>
          <span className="text-center h-full leading-5 py-1 px-4 hover:cursor-pointer hover:bg-[#3986e4d2] bg-[#3987E4] rounded  text-white">
            {estateType}
          </span>
          <span className="text-center h-full leading-5 py-1 px-4  hover:cursor-pointer hover:bg-[#3986e4d2] bg-[#3987E4] rounded text-white">
            {estateSubType}
          </span>
        </div>
        <div className="my-6">
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            {name}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 500, color: "#3986e4d2" }}>
            JD {regularPrice}
          </Typography>
        </div>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          m={0}
          p={0}
          width="100%"
          // maxWidth={1000}
          // borderRadius={2}
          // boxShadow={3}
          // bgcolor="bl"
        >
          <Swiper
            style={{
              "--swiper-navigation-color": "#000",
              "--swiper-navigation-size": "1em",
              "--swiper-pagination-color": "#fff",
            }}
            loop={true}
            spaceBetween={window.innerWidth > 768 ? 10 : 2} // Adjust spacing based on screen size
            navigation
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs]}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="mySwiper2 w-full mb-2 aspect-[4/3] sm:aspect-[16/9]" // Adjust aspect ratio responsively
          >
            {imageUrls.map((url, index) => (
              <SwiperSlide
                key={index}
                className="flex justify-center items-center"
              >
                <img
                  src={`http://10.10.30.30:5000${url}`}
                  alt={`Listing ${index}`}
                  className="object-cover w-full"
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <Swiper
            onSwiper={setThumbsSwiper}
            loop={true}
            spaceBetween={5}
            slidesPerView={4.2}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper aspect-[8/1] w-full"
          >
            {imageUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <img
                  src={`http://10.10.30.30:5000${url}`}
                  alt={`Thumbnail ${index}`}
                  className={`w-full transition-opacity ${
                    activeIndex === index ? "opacity-60" : "opacity-100"
                  }`}
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        {/* details */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
          my={4}
          width="100%"
        >
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center gap-2 p-6 bg-white w-full "
          >
            <Typography variant="subtitle1">Overview</Typography>
            <Typography variant="body2">
              Updated On: {new Date(updatedAt).toLocaleDateString()}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 120 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center gap-2 p-6 bg-white w-full "
          >
            <Typography variant="subtitle1">Description</Typography>
            <Typography variant="body2">{description}</Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 140 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center gap-2 p-6 bg-white w-full "
          >
            <Typography variant="subtitle1">Address</Typography>
            <Typography variant="body2">
              City : {city} <br /> Country : {address} <br />
              alhood : {alhood}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 160 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center gap-2 p-6 bg-white w-full "
          >
            <Typography variant="subtitle1">Area</Typography>
            <Typography variant="body2">
              area : {area} m²{" "}
              {currentUser?.isAdmin && (
                <>
                  <br /> Plate number : {plateNum}
                </>
              )}{" "}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 180 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center gap-2 p-6 bg-white w-full "
          >
            <Typography variant="subtitle1">Salary</Typography>
            <Typography variant="body2">
              Regular price : {regularPrice} JOD <br /> discountPrice :{" "}
              {discountPrice} JOD <br />{" "}
              <span className="font-medium">finsh price </span> :{" "}
              {regularPrice - discountPrice} JOD{" "}
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 180 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center gap-2 p-6 bg-white w-full "
          >
            <Typography variant="subtitle1">Map location</Typography>
            {/* <Map lat={32.50693017306834} long ={35.87955916766078}/> */}
            <Map lat={latitude} long={longitude} />
            {/* <LoadScript googleMapsApiKey="AIzaSyD77qREvcXuWhNt2aNILS9ywDzidz7uVhk">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11}>
        <Marker position={center} />
      </GoogleMap>
    </LoadScript> */}
          </motion.div>

          {estateType !== "Lands" && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center gap-2 p-6 bg-white w-full "
            >
              <Accordion sx={{ boxShadow: 0 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography component="h6">More Features</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    display="flex"
                    justifyContent={"flex-start"}
                    gap={2}
                    flexWrap={"wrap"}
                  >
                    <span>
                      <BedIcon fontSize="medium" color="action" />
                      <Typography variant="caption">
                        {" "}
                        {bedrooms} Beds
                      </Typography>
                    </span>
                    <span>
                      <BathtubIcon fontSize="medium" color="action" />
                      <Typography variant="caption">
                        {bathrooms} Baths
                      </Typography>
                    </span>
                    <span>
                      {furnished ? (
                        <CheckIcon fontSize="medium" sx={{ color: "green" }} />
                      ) : (
                        <CloseIcon fontSize="medium" sx={{ color: "red" }} />
                      )}
                      <Typography variant="caption">furnished</Typography>
                    </span>
                    <span>
                      {parking ? (
                        <CheckIcon fontSize="medium" sx={{ color: "green" }} />
                      ) : (
                        <CloseIcon fontSize="medium" sx={{ color: "red" }} />
                      )}
                      <Typography variant="caption">parking</Typography>
                    </span>
                    <span>
                      {offer ? (
                        <CheckIcon fontSize="medium" sx={{ color: "green" }} />
                      ) : (
                        <CloseIcon fontSize="medium" sx={{ color: "red" }} />
                      )}
                      <Typography variant="caption">offer</Typography>
                    </span>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>
          )}
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ActionBox
          title="New Actions"
          buttons={[
            { label: "Add Listing", onClick: () => console.log("Add Listing") },
            { label: "Do Listing", onClick: () => console.log("Do Listing") },
          ]}
        />
      </motion.div>
    </Box>
  );
};
