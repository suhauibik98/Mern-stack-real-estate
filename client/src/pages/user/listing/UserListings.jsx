import { useSelector } from "react-redux";
import { useGetUserListingsQuery } from "../../../redux/apis/ListingApi";
import { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import { Box, Skeleton, Typography } from "@mui/material";
import { motion, animate } from "framer-motion";
import ListingCard from "../../listings/cards/ListingCard";
import { Link } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SearchIcon from "@mui/icons-material/Search";

const UserListings = () => {
  const { currentUser, token } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredListings, setFilteredListings] = useState([]);
  const [page, setPage] = useState(1);

  const {
    data: listings,
    isLoading,
    refetch,
  } = useGetUserListingsQuery(
    { token, userId: currentUser?._id, page },
    { skip: !currentUser?._id }
  );

  useEffect(() => {
    if (listings?.listings) {
      setFilteredListings(listings.listings);
    }
  }, [listings]);

  useEffect(() => {
    if (currentUser?._id) {
      refetch();
    }
  }, [page, refetch, currentUser?._id]);

  // useEffect(()=>{
  //   // if (window.scrollY > 400) {
  //     animate(window.scrollY, 400, {
  //       duration: 1.0, // Smooth scrolling duration
  //       ease: "easeInOut", // Easing for a natural feel
  //       onUpdate: (value) => window.scrollTo(0, value) ,

  //     });
  //   // }

  //   console.log(window.scrollY);
  // },[page])

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchQuery(searchValue);

    if (!listings?.listings) return;

    const filteredResults = listings.listings.filter((listing) =>
      Object.values(listing).some((value) =>
        String(value).toLowerCase().includes(searchValue)
      )
    );
    setFilteredListings(filteredResults);
  };

  const renderSkeletons = () => (
    <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from(new Array(8)).map((_, index) => (
        <div key={index} className="w-full bg-white rounded-lg p-4">
          <Skeleton variant="rectangular" height={180} animation="wave" />
          <Skeleton variant="text" animation="wave" sx={{ mt: 1 }} />
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" animation="wave" />
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div
        className="w-full bg-primary py-10 mb-10 flex items-center justify-center text-center"
        style={{
          background:
            "linear-gradient(rgba(20, 20, 31, 0.7), rgba(20, 20, 31, 0.7)), url('../../public/images/es_2.jpg')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="container py-20">
          <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-4xl mb-2 md:text-5xl text-white font-bold animate-slideInDown">
              My Listings
            </h1>
            <nav aria-label="breadcrumb">
              <ol className="flex justify-center items-center space-x-2 text-white text-lg">
                <li className="breadcrumb-item">
                  <Link
                    to="/profile"
                    className="hover:text-primary-normal-hover"
                  >
                    Profile
                  </Link>
                </li>
                <KeyboardArrowRightIcon fontSize="small" className="ml-4" />

                <li className="text-primary-normal active" aria-current="page">
                  My Listings
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-3 bg-white shadow-md p-3 lg:p-4 rounded-lg border border-gray-300 w-full sm:w-auto mb-6">
          <SearchIcon className="text-gray-600" />
          <input
            type="text"
            placeholder="Search Listings..."
            className="bg-transparent text-gray-800 w-full outline-none placeholder-gray-400 text-base"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {isLoading ? (
          renderSkeletons()
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 justify-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredListings.map((item, index) => (
              <motion.div key={index}>
                <ListingCard listing={item} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="flex justify-center my-8">
          <Pagination
            count={listings?.totalPage || 1}
            page={page}
            onChange={handleChange}
            siblingCount={2}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </div>
      </div>
    </>
  );
};

export default UserListings;
