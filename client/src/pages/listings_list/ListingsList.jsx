import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ListingCard from "../listings/cards/ListingCard";
import {
  useGetAllListingQuery,
  useGetListingsByFilterMutation,
} from "../../redux/apis/ListingApi";
import { useSelector } from "react-redux";
import { Box, Skeleton, Typography, Grid2, Button } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { cityAreas } from "../../cityAreas";
import { Link } from "react-router-dom";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
const ListingsList = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [areas, setAreas] = useState([]);
  const [alhoodList, setAlhoodList] = useState([]);
  const [type, setType] = useState("");
  const [activeSection, setActiveSection] = useState("All");
  const { token } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPage, setTotalPage] = useState(1);
  const [filteredListings, setFilteredListings] = useState([]);
  const [allListings, setAllListings] = useState([]); // Keeps original data for search
  const [formData, setFormData] = useState({
    alhood: "",
    address: "",
    type: "",
    city: "",
    estateType: "",
  });

  const [getListingsByFilter, { isLoading }] = useGetListingsByFilterMutation();

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setFormData({ ...formData, city, address: "", alhood: "" });

    if (city === "Irbid") {
      const irbidAreas = cityAreas.Irbid[0].values.map((area) => area.label);
      setAreas(irbidAreas);
    } else {
      setAreas(cityAreas[city] || []);
    }
    setAlhoodList([]);
  };

  const handleAreaChange = (e) => {
    const area = e.target.value;
    setFormData({ ...formData, address: area, alhood: "" });

    if (selectedCity === "Irbid") {
      const selectedArea = cityAreas.Irbid[0].values.find(
        (areaItem) => areaItem.label === area
      );
      setAlhoodList(selectedArea?.alhodlist || []);
    } else {
      setAlhoodList([]);
    }
  };

  const handleAlhoodChange = (e) => {
    const alhood = e.target.value;
    setFormData({ ...formData, alhood });
  };

  const handleTypeChange = (event) => {
    const typeValue = event.target.value;
    setType(typeValue);
    setFormData({ ...formData, type: typeValue });
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setFormData({ ...formData, estateType: section });
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchQuery(searchValue);

    const filteredResults = allListings.filter((listing) =>
      Object.values(listing).some((value) =>
        String(value).toLowerCase().includes(searchValue)
      )
    );

    setFilteredListings(filteredResults);
  };
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const fetchFilteredListings = async () => {
    try {
      const response = await getListingsByFilter({ token, formData, page });
      if (response.data) {
        setFilteredListings(response.data.listings || []);
        setAllListings(response.data.listings || []);
        setTotalPage(response.data?.totalPage || 1);
      }
    } catch (error) {
      console.error("Error fetching filtered listings:", error);
    }
  };

  useEffect(() => {
    fetchFilteredListings();
  }, [formData, page]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderSkeletons = () => (
    <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from(new Array(20)).map((_, index) => (
        <div className="w-full bg-white  rounded-lg p-4">
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
              Listings List
            </h1>
            <nav aria-label="breadcrumb">
              <ol className="flex justify-center items-center space-x-2 text-white text-lg">
                <li className="breadcrumb-item">
                  <Link to="/" className="hover:text-primary-normal-hover">
                    Home
                  </Link>
                </li>
                <KeyboardArrowRightIcon fontSize="small" className="ml-4"/>
                <li className="text-primary-normal active" aria-current="page">
                  Listings List
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="w-full relative bg-white min-h-screen px-0 lg:px-2 py-10">
        {/* Filters */}
        <div className="flex flex-wrap lg:sticky top-[3rem] lg:top-[5rem] bg-white shadow-lg rounded-xl p-4 lg:p-6 z-10 justify-center lg:justify-evenly items-center gap-4 lg:gap-6 mb-6 border border-gray-200">
          {/* Search Bar */}
          <div className="flex items-center gap-3 bg-white shadow-md p-3 lg:p-4 rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-primary-normal transition-all w-full sm:w-auto">
            <SearchIcon className="text-gray-600" />
            <input
              placeholder="Search Listings..."
              className="bg-transparent text-gray-800 w-full outline-none placeholder-gray-400 font-medium text-base"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          {/* Sections */}
          <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-4">
            {["All", "Lands", "Residential", "Commercial"].map((section) => (
              <button
                key={section}
                onClick={() => handleSectionClick(section)}
                className={`text-base sm:text-lg font-semibold py-2 px-3 sm:px-4 rounded-lg transition-all ${
                  activeSection === section
                    ? "bg-primary-normal text-white shadow-md"
                    : "text-gray-600 hover:text-primary-normal hover:bg-gray-100"
                }`}
              >
                {section}
              </button>
            ))}
          </div>

          {/* Dropdowns */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full md:w-auto">
            {/* City */}
            <FormControl
              size="small"
              className="w-full sm:w-[140px] md:w-[160px]"
            >
              <InputLabel id="city-select-label">City</InputLabel>
              <Select
                labelId="city-select-label"
                value={formData.city}
                onChange={handleCityChange}
                className="rounded-lg shadow-md"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {Object.keys(cityAreas).map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Address */}
            <FormControl
              size="small"
              className="w-full sm:w-[140px] md:w-[160px]"
            >
              <InputLabel id="address-select-label">Address</InputLabel>
              <Select
                labelId="address-select-label"
                value={formData.address}
                onChange={handleAreaChange}
                className="rounded-lg shadow-md"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {areas.map((area, index) => (
                  <MenuItem key={index} value={area}>
                    {area}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Alhood */}
            <FormControl
              size="small"
              className="w-full sm:w-[140px] md:w-[160px]"
            >
              <InputLabel id="alhood-select-label">Alhood</InputLabel>
              <Select
                labelId="alhood-select-label"
                value={formData.alhood}
                onChange={handleAlhoodChange}
                className="rounded-lg shadow-md"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {alhoodList.map((alhood) => (
                  <MenuItem key={alhood.id} value={alhood.label}>
                    {alhood.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Type */}
            <FormControl
              size="small"
              className="w-full sm:w-[140px] md:w-[160px]"
            >
              <InputLabel id="type-select-label">Type</InputLabel>
              <Select
                labelId="type-select-label"
                value={type}
                onChange={handleTypeChange}
                className="rounded-lg shadow-md"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="sale">Sale</MenuItem>
                <MenuItem value="rent">Rent</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 lg:px-8">
          {isLoading ? (
            renderSkeletons()
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filteredListings.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ListingCard listing={item} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          <div className="flex justify-center my-8">
            <Pagination
              count={totalPage}
              page={page}
              onChange={handlePageChange}
              siblingCount={2}
              color="primary"
              variant="outlined"
              shape="rounded"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingsList;
