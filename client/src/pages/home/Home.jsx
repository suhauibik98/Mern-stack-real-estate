import { useEffect, useState } from "react";
import ListingCard from "../listings/cards/ListingCard";
import { useDispatch, useSelector } from "react-redux";
import { setListing } from "../../redux/user/ListingSlice";
import {
  useGetListingNotAuthQuery,
  useGetLastListingNotAuthQuery,
} from "../../redux/apis/ListingApi";
import {
  Box,
  Skeleton,
  CardMedia,
  Typography,
  Grid2,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import heroImage1 from "../../../public/images/es_main_7.jpg";
import { Link, useNavigate } from "react-router-dom";
import video from "../../../public/videos/Video.mp4";
import {
  FaArrowRight,
  FaBuilding,
  FaCar,
  FaHome,
  FaHotel,
  FaConciergeBell,
} from "react-icons/fa";
import { useContactMessageMutation } from "../../redux/apis/UserApi";
import Footer from "../footer/Footer";

function Home() {
  
  const dispatch = useDispatch();
  
  const nav = useNavigate();
  
  const { listing } = useSelector((state) => state.listing);
  
  const { token , currentUser } = useSelector((state) => state.user);
  
  const [destinations, setDestinations] = useState([]);
  
  const [contactFrom, setContactForm] = useState({
    name: currentUser?.username || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    message: "",
  });
  const baseUrl = "http://10.10.30.30:5000";

  const [contactMessage] = useContactMessageMutation();
  const { data: getAll, isLoading, refetch } = useGetListingNotAuthQuery();
  const { data: getLastAll, refetch: refetchGetAllLast } =
    useGetLastListingNotAuthQuery();

  useEffect(() => {
    if (getAll) {
      dispatch(setListing(getAll));
    }
  }, [getAll, dispatch, refetch]);

  useEffect(() => {
    if (getLastAll) {
      setDestinations(getLastAll);
    }
  }, [getLastAll, refetchGetAllLast]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleClicked = (id) => {
    nav(`/card-details/${id}`);
  };

  const handleSubmaitContactForm = async (e) => {
    e.preventDefault();
    // console.log(contactFrom);
try {
      await contactMessage({ formData: contactFrom }).unwrap();
      // setContactForm({
      //   name: currentUser?.username || "",
      //   email: currentUser?.email || "",
      //   phone: currentUser?.phone || "",
      //   message: "",
      // });
    } catch (error) {
      console.log(error);
    } 
  };

  const handleChanged = (e) => {
    setContactForm({ ...contactFrom, [e.target.id]: e.target.value });
  };

  const renderSkeletons = () => (
    <Grid2
      container
      spacing={2}
      className="p-20 w-full"
      justifyContent="center"
    >
      {Array.from(new Array(4)).map((_, index) => (
        <Grid2 item minWidth="250px" xs={12} sm={6} md={3} key={index}>
          <Skeleton variant="rectangular" height={200} animation="wave" />
          <Skeleton variant="text" animation="wave" sx={{ mt: 1 }} />
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" animation="wave" />
        </Grid2>
      ))}
    </Grid2>
  );

  return (
    <Box className="w-full">
      {/* Hero Section with Overlay and Fade Transition */}
      <section
        className="relative max-h-full overflow-hidden mb-[-7px]"
        id="top"
        data-section="section1"
      >
        <video
          autoPlay
          muted
          playsInline
          loop
          className="min-w-full min-h-screen max-w-full max-h-screen object-cover -z-10"
          id="bg-video"
        >
          <source src={video} type="video/mp4" />
        </video>

        <div className="absolute bg-[#1F272B] bg-opacity-75 z-0 top-0 left-0 bottom-0 right-0 w-full">
          <div className="caption px-[10%] absolute top-1/2 transform -translate-y-1/2 text-left">
            <h6 className="mt-0 text-xs uppercase font-semibold text-white tracking-wider">
              Your Dream Home Awaits
            </h6>
            <h2 className="mt-5 mb-5 text-xl md:text-4xl uppercase font-extrabold text-white tracking-wide">
              Welcome to AK RealEstate
            </h2>
            <p className="text-white text-[10px] md:text-sm max-w-[570px] mx-auto">
              Discover the best properties at unbeatable prices. Whether you're
              looking for a cozy apartment, a spacious family home, or a luxury
              villa, we have the perfect place for you. Let us help you find
              your dream property today.
            </p>
            {!token && (
              <div className="mt-7">
                <Link
                  to="/signin"
                  className="px-6 py-2 text-xs md:text-sm bg-primary-normal text-white font-semibold rounded-full hover:bg-primary-normal-hover transition duration-300"
                >
                  Get Started Now!
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-gray-100">
        <div className="container p-4 mx-auto py-16">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, y: 150 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative h-[400px] lg:h-auto rounded-lg overflow-hidden shadow-lg transform "
            >
              <img
                className="w-full h-full object-cover absolute"
                src={heroImage1} // Replace with your image URL
                alt="About Us"
              />
            </motion.div>

            {/* Text Section */}
            <motion.div
              initial={{ opacity: 0, y: 180 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-6"
              data-wow-delay="0.3s"
            >
              <h6 className="text-primary-normal px-3 inline-block uppercase font-bold text-xs md:text-lg py-1 ">
                About Us
              </h6>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 leading-tight mb-6">
                Welcome to{" "}
                <span className="text-primary-normal">AK RealEstate</span>
              </h1>
              <p className="text-sm md:text-lg text-gray-600 mb-6">
                We provide premium real estate services with a range of
                properties, including luxury homes, apartments, and commercial
                spaces. Our mission is to help you find your dream property.
              </p>
              <p className="text-sm md:text-lg text-gray-600 mb-6">
                Whether you're looking to buy, sell, or rent, we offer
                personalized services to guide you every step of the way.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="mb-0 flex items-center text-sm md:text-base text-gray-700 hover:text-primary transition duration-300">
                    <FaHome className="mr-3" color="#86B822" /> Residential
                    Properties
                  </p>
                </div>
                <div>
                  <p className="mb-0 flex items-center text-sm md:text-base text-gray-700 hover:text-primary transition duration-300">
                    <FaBuilding className="mr-3" color="#86B822" /> Commercial
                    Properties
                  </p>
                </div>
                <div>
                  <p className="mb-0 flex items-center text-sm md:text-base text-gray-700 hover:text-primary transition duration-300">
                    <FaHotel className="mr-3" color="#86B822" /> Luxury Villas &
                    Apartments
                  </p>
                </div>
                <div>
                  <p className="mb-0 flex items-center text-sm md:text-base text-gray-700 hover:text-primary transition duration-300">
                    <FaCar className="mr-3" color="#86B822" /> Parking Space
                    Available
                  </p>
                </div>
                <div>
                  <p className="mb-0 flex items-center text-sm md:text-base text-gray-700 hover:text-primary transition duration-300">
                    <FaConciergeBell className="mr-3" color="#86B822" />{" "}
                    Concierge Services
                  </p>
                </div>
                <div>
                  <p className="mb-0 flex items-center text-sm md:text-base text-gray-700 hover:text-primary transition duration-300">
                    <FaArrowRight className="mr-3" color="#86B822" /> 24/7
                    Customer Support
                  </p>
                </div>
              </div>

              <Link
                to="/about"
                className="inline-block text-sm py-1 px-3 md:text-base md:py-3 md:px-6 bg-primary-normal text-white font-semibold rounded-full shadow-md transition duration-300 ease-in-out transform hover:bg-primary-normal-hover"
              >
                Read More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container p-4 mx-auto py-16">
        {/* Heading Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h6 className="text-primary-normal px-3 inline-block uppercase font-bold text-xs md:text-lg py-1">
            New Listings
          </h6>
          <h1 className="mb-5 text-2xl md:text-3xl lg:text-4xl font-extrabold">
            Discover Your Dream Land & Home
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 text-sm md:text-base lg:text-lg">
            Explore our exclusive listings of luxury homes, lands, modern
            apartments, and prime commercial properties. Find the perfect space
            that fits your lifestyle and investment goals.
          </p>
        </motion.div>

        {/* Destination Grid */}
        <div className="md:h-[530px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-2 mt-8">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination?._id}
              onClick={() => handleClicked(destination?._id)}
              className={`relative overflow-hidden h-full ${
                index === 0
                  ? "lg:col-span-2 row-span-1"
                  : index === 1
                  ? "lg:col-span-1 lg:row-span-2"
                  : ""
              }`}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              // whileHover={{ scale: 1.05 }}
            >
              <a href="#" className="block h-full">
                <motion.img
                  className="w-full h-full object-cover"
                  src={baseUrl + destination?.imageUrls[0]}
                  alt={destination?.title}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute top-0 left-0 m-3 bg-white text-primary-normal font-bold px-2 py-1 text-sm md:text-base">
                  NEW
                </div>
                <div className="absolute bottom-0 right-0 m-3 bg-white text-primary font-bold px-2 py-1 text-sm md:text-base">
                  {destination?.alhood}
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-gray-100">
        <Box className="container p-4 mx-auto py-16">
          {/* Listings Section */}
          <div className="text-center">
            <h6 className="text-primary-normal px-3 inline-block uppercase font-bold text-xs md:text-lg py-1 ">
              Best Listings
            </h6>
            <h1 className="mb-5 text-2xl md:text-3xl lg:text-4xl font-extrabold">
              Featured Listings
            </h1>
            <p className="max-w-2xl mx-auto text-gray-600 text-sm md:text-base lg:text-lg">
              Explore our top real estate listings, from luxury homes to modern
              apartments. Find the perfect property that matches your needs and
              lifestyle.
            </p>
          </div>

          <Grid2
            container
            spacing={2}
            className="p-2 my-6 w-full"
            justifyContent="center"
          >
            {isLoading
              ? renderSkeletons()
              : listing &&
                (Array.isArray(listing) ? (
                  [...listing].map((item, index) => (
                    <Grid2
                      item
                      minWidth="250px"
                      xs={12}
                      sm={6}
                      md={3}
                      key={index}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        viewport={{ once: true }}
                      >
                        <ListingCard listing={item} />
                      </motion.div>
                    </Grid2>
                  ))
                ) : (
                  <Grid2 item xs={12}>
                    <ListingCard listing={listing} />
                  </Grid2>
                ))}
          </Grid2>

          {/* Pagination */}
          <Box mt={4} display="flex" justifyContent="center" width={"100%"}>
            <Button
              variant="outlined"
              color="success"
              onClick={() => nav("/listings-list")}
            >
              Show More
              <FaArrowRight className="ml-3" />
            </Button>
          </Box>
        </Box>
      </div>

      <div className="container mx-auto p-4 py-16">
        {/* Heading Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h6 className="text-primary-normal px-3 inline-block uppercase font-bold text-xs md:text-lg py-1">
            Get in Touch
          </h6>
          <h1 className="mb-5 text-2xl md:text-3xl lg:text-4xl font-extrabold">
            Contact Us Today
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 text-sm md:text-base lg:text-lg">
            Have questions about buying, selling, or renting properties? Our
            team is here to assist you every step of the way. Reach out to us
            for expert real estate advice and personalized service.
          </p>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="container my-3 mx-auto px-5 lg:px-10 rounded-lg overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          style={{
            background:
              "linear-gradient(rgba(15, 23, 43, 0.7), rgba(15, 23, 43, 0.7)), url('../../../public/images/hero-image.jpg')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center py-8 bg-opacity-80">
            {/* Left Side - Contact Info */}
            <motion.div
              className="text-white"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h6 className="uppercase text-xs md:text-lg font-semibold">Contact Us</h6>
              <h1 className="text-2xl md:text-4xl font-bold mb-4">
                Get In Touch
              </h1>
              <p className="text-xs md:text-base mb-4">
                Have questions about buying, selling, or renting properties? Our
                team is here to help. Contact us today and let’s find the
                perfect property for you.
              </p>
              <p className="text-xs md:text-base mb-4">
                We provide expert real estate services, from property listings
                to consultation and financing options.
              </p>

              <Link
                to={"/contact"}
                className="border text-xs py-2 px-4 md:py-3 md:px-6 md:text-base border-white text-white  rounded-lg inline-block hover:bg-[#ffffff3b] transition"
              >
                Learn More
              </Link>
            </motion.div>

            {/* Right Side - Contact Form */}
            <motion.div
              className="bg-white p-6 md:p-8 rounded-lg shadow-lg"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h1 className="text-primary text-lg md:text-2xl font-bold mb-4">
                Send Us A Message
              </h1>
              <form onSubmit={handleSubmaitContactForm}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-700 font-medium text-sm md:text-base">
                      Your Name
                    </label>
                    <input
                    required
                      onChange={(e) => handleChanged(e)}
                      value={contactFrom.name}
                      id="name"
                      type="text"
                      className="w-full p-1 placeholder:text-xs md:p-3 md:placeholder:text-base border border-gray-300 rounded-lg mt-1"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 font-medium text-sm md:text-base">
                      Your Email
                    </label>
                    <input
                    required
                      onChange={(e) => handleChanged(e)}
                      value={contactFrom.email}
                      id="email"
                      type="email"
                      className="w-full p-1 placeholder:text-xs md:p-3 md:placeholder:text-base border border-gray-300 rounded-lg mt-1"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-gray-700 font-medium text-sm md:text-base">
                    Phone Number
                  </label>
                  <input
                    onChange={(e) => handleChanged(e)}
                    value={contactFrom.phone}
                    id="phone"
                    type="number"
                    className="w-full p-1 placeholder:text-xs md:p-3 md:placeholder:text-base border border-gray-300 rounded-lg mt-1"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-gray-700 font-medium text-sm md:text-base">Message</label>
                  <textarea
                  required
                    onChange={(e) => handleChanged(e)}
                    value={contactFrom.message}
                    id="message"
                    className="w-full p-1 placeholder:text-xs md:p-3 md:placeholder:text-base border border-gray-300 rounded-lg mt-1 h-24"
                    placeholder="Write your message"
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  className="w-full mt-4 bg-primary-normal text-white py-1 md:py-3 rounded-lg hover:bg-primary-normal-hover transition"
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Box>
  );
}

export default Home;
