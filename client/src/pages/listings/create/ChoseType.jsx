import { useState } from "react";
import { Box, Button } from "@mui/joy";
import { motion } from "framer-motion";
import {
  useGetEstateTypesQuery,
  useGetEstateSubTypeQuery,
} from "../../../redux/apis/ListingApi";
import { useSelector } from "react-redux";
import Spinner from "../../../components/Spinner";
import CreateListing from "./create/CreateListing";
import sale from "../../../../public/images/sale.jpg";
import rent from "../../../../public/images/rent.webp";
import Lands from "../../../../public/images/land.jpg";
import Residential from "../../../../public/images/Residential.jpg";
import Commercial from "../../../../public/images/Commercial.jpg";

const ChoseType = () => {
  const { token } = useSelector((state) => state.user);
  const [selectedType, setSelectedType] = useState(null);
  const [Type, setType] = useState(null);

  const estateImages = {
    Lands,
    Residential,
    Commercial,
  };
  // Fetch estate types
  const {
    data: DataType,
    isLoading,
    isError: isErrorType,
  } = useGetEstateTypesQuery({ token }, { skip: !Type });

  // Fetch estate subtypes
  const {
    data: DataSubType,
    isLoading: isLoadingSubType,
    isError: isErrorSubType,
  } = useGetEstateSubTypeQuery(
    { token, type: selectedType },
    { skip: !selectedType }
  );

  const handleClickTypeChange = (e) => {
    setSelectedType(e.target.id);
  };

  const handleClick = (e) => {
    setType(e.target.getAttribute("data-name"));
  };

  // Show spinner while loading
  if (isLoading || isLoadingSubType) return <Spinner />;

  // Show error message if API fails
  if (isErrorType || isErrorSubType)
    return (
      <div className="text-red-500 text-center">
        Error loading data. Please try again later.
      </div>
    );

  return (
    <div className="w-full mt-32">
      <h1 className="text-center font-extrabold text-3xl sm:text-4xl text-gray-800 m-6">
        {Type ? `Choose what you want ${Type}` : "Choose Sale or Rent"}
      </h1>

      {!DataType && (
        <Box className="cursor-pointer grid md:grid-cols-2 justify-items-center w-full items-center gap-6 p-6">
          <motion.div
            onClick={handleClick}
            data-name="sale"
            // whileHover={{ scale: 1.05 }}
            // whileTap={{ scale: 0.95 }}
            className="relative w-full h-[300px] md:h-[400px] flex justify-center items-center overflow-hidden rounded-lg shadow-lg"
          >
            <img
              src={sale}
              className="w-full h-full object-cover transition-all duration-300 hover:brightness-75"
              alt="Sale"
              data-name="sale"
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-xl font-bold px-4 py-2 rounded">
              Sale - بيع
            </div>
          </motion.div>

          <motion.div
            onClick={handleClick}
            data-name="rent"
            // whileHover={{ scale: 1.05 }}
            // whileTap={{ scale: 0.95 }}
            className="relative w-full h-[300px] md:h-[400px] flex justify-center items-center overflow-hidden rounded-lg shadow-lg"
          >
            <img
              src={rent}
              className="w-full h-full object-cover transition-all duration-300 hover:brightness-75"
              alt="Rent"
              data-name="rent"
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-xl font-bold px-4 py-2 rounded">
              Rent - أيجار
            </div>
          </motion.div>
        </Box>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 w-full">
        {Type &&
          Array.isArray(DataType) &&
          DataType.map((item, key) => (
            <motion.div
              key={key}
              
              className={`relative rounded-lg font-semibold text-lg shadow-md transition-all cursor-pointer overflow-hidden h-80 flex items-center justify-center w-full ${
                selectedType === item
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              // whileHover={{ scale: 1.05 }}
              // whileTap={{ scale: 0.95 }}
            >
              <img
                src={estateImages[item] || sale}
                alt={item}
                id={item}
              onClick={handleClickTypeChange}
                className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
              />
              <span className="relative z-10 bg-black bg-opacity-50 px-4 py-2 rounded text-white text-xl">
                {item} {item === "Lands" ? " أرض" : ""}
                {item === "Residential" ? "سكني" : ""}
                {item === "Commercial" ? "تجاري" : ""}
              </span>
            </motion.div>
          ))}
      </div>

      <div className="mt-8">
        {DataType && DataSubType && (
          <CreateListing
            selectedType={selectedType}
            type={Type}
            dataSubType={DataSubType}
          />
        )}
      </div>
    </div>
  );
};

export default ChoseType;
