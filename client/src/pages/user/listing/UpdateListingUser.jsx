import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteListing, updateListing } from "../../../redux/user/ListingSlice";
import { motion } from "framer-motion";
import {
  useUpdateListingByIdMutation,
  useDeleteImageByUrlMutation,
  useDeleteListingByIdMutation,
  useGetEstateSubTypeQuery,
  useGetEstateTypesQuery,
} from "../../../redux/apis/ListingApi";
import Spinner from "../../../components/Spinner";
import PopUpMessages from "../../../components/popup/PopUpMasseges";
import { Button } from "@mui/joy";
import { styled, alpha } from "@mui/material/styles";
import { Switch } from "@mui/material";
import { green } from "@mui/material/colors";
import Map from "../../../components/Map";
import { cityAreas } from "../../../cityAreas";

const UpdateListing = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const baseUrl = `${import.meta.env.VITE_BASEURL}`;

  const prevData = location.state.listing;

  const [ArrayDeleteSubmit, setArrayDeleteSubmit] = useState([]);

  const [previews, setPreviews] = useState([]);

  const [newImages, setNewImages] = useState([]);

  const { token } = useSelector((state) => state.user);

  const [
    deleteListingById,
    { isSuccess: successDeleteListin, isError: errorDeleteListin },
  ] = useDeleteListingByIdMutation();

  const [updateListingById, { isLoading, isSuccess, isError }] =
    useUpdateListingByIdMutation();

  const [deleteImageByUrl, { isLoading: deleteImageByUrlLoading }] =
    useDeleteImageByUrlMutation();

  const { data: DataSubType, isLoading: isLoadingSubType } =
    useGetEstateSubTypeQuery(
      { token, type: prevData?.estateType },
      { skip: !prevData?.estateType }
    );
  // const { data: DataType } = useGetEstateTypesQuery({ token} , { skip: !prevData?.type });

  const [formData, setFormData] = useState({
    ...prevData,
    imageUrls: prevData?.imageUrls || [],
  });

  
  const GreenSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: green[600],
      "&:hover": {
        backgroundColor: alpha(green[600], theme.palette.action.hoverOpacity),
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: green[600],
    },
  }));


  const handleDeleteListing = async (id) => {
    try {
      await deleteListingById({ token, Listings_id: id }).unwrap();

      dispatch(deleteListing(id));

      navigate("/");
    } catch (err) {
      if (err.originalStatus === 403) {
        console.error("User is not authorized to delete this listing.");
      } else if (err.originalStatus === 404) {
        console.error("Listing not found.");
      } else {
        console.error("An unexpected error occurred.");
      }
    }
  };
  const handleInputChange = (e) => {
    console.log(e.target);

    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleToggleChange = (field) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array

    const newPreviews = files.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = () => resolve(reader.result); // Resolve with the data URL
        reader.readAsDataURL(file); // Read the file as a data URL
      });
    });

    Promise.all(newPreviews).then((results) => {
      setPreviews((prev) => [...prev, ...results]); // Append new previews
    });

    setNewImages((prev) => [...prev, ...files]); // Append new files to the state
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Delete images marked for deletion
      if (ArrayDeleteSubmit.length > 0) {
        try {
          await deleteImageByUrl({
            token,
            imageUrl: ArrayDeleteSubmit,
            list_id: prevData?._id,
          }).unwrap();
        } catch (error) {
          console.error("Error deleting images:", error);
          return alert("Failed to delete some images. Please try again.");
        }
      }

      // Step 2: Upload new images
      let uploadedImageUrls = [];
      if (newImages.length > 0) {
        try {
          // Create a single FormData object for all images
          const imageFormData = new FormData();

          newImages.forEach((file) => {
            imageFormData.append("images", file); // Append each file to the FormData object
          });

          // Make a single API call to upload all images
          const response = await updateListingById({
            token,
            Listings_id: prevData._id,
            formData: imageFormData,
          }).unwrap();

          // Extract URLs from the response
          uploadedImageUrls = response.imageUrls || [];
        } catch (error) {
          console.error("Error uploading images:", error);
          return alert("Failed to upload some images. Please try again.");
        }
      }

      // Step 3: Update the listing with updated data and new image URLs
      try {
        const updatedFormData = {
          ...formData,
          imageUrls: [...formData.imageUrls, ...uploadedImageUrls],
        };

        const response = await updateListingById({
          token,
          Listings_id: prevData._id,
          formData: updatedFormData,
        }).unwrap();

        // Dispatch the response and navigate to the desired route
        dispatch(updateListing(response));
        navigate("/user-listing");
      } catch (error) {
        console.error("Error updating the listing:", error);
        return alert("Failed to update the listing. Please try again.");
      }
    } catch (error) {
      console.error("Error handling form submission:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const deleteImage = (imageUrl) => {
    if (!ArrayDeleteSubmit.includes(imageUrl)) {
      setArrayDeleteSubmit([...ArrayDeleteSubmit, imageUrl]);

      const updatedImageUrls = formData.imageUrls.filter(
        (url) => url !== imageUrl
      );
      setFormData((prev) => ({
        ...prev,
        imageUrls: updatedImageUrls,
      }));

      dispatch(
        updateListing({
          ...formData, // Keep the existing formData
          imageUrls: updatedImageUrls, // Update the imageUrls field
          _id: formData._id, // Ensure the ID is included for reducer logic
        })
      );
    } else {
      console.log("already deleted");
    }
  };

   const handleLocationSelect =(coord)=>{
const {longitude , latitude} = coord
setFormData({...formData , latitude , longitude})

   }

useEffect(()=>{
  window.scrollTo(0,0)
},[])

   if (isLoading || deleteImageByUrlLoading) return <Spinner />;

  return (
    <>
      {isSuccess && (
        <PopUpMessages message="Listing updated successfully" code={200} />
      )}
      {isError && (
        <PopUpMessages message="Failed to update listing" code={400} />
      )}
      <main className="p-6 max-w-4xl mx-auto">
        <motion.h1
          className="text-4xl font-semibold text-center mb-8 text-gray-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Update a Listing
        </motion.h1>
        <motion.p className="w-full text-center my-4 text-3xl border border-red-400 bg-slate-200 ">
          {prevData?.estateType}
        </motion.p>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6" onSubmit={handleFormSubmit}>
          {/* Input Fields */}
          {[
            {
              id: "name",
              label: "Name",
              type: "text",
              placeholder: "Enter name",
              required: true,
            },
            {
              id: "description",
              label: "Description",
              type: "textarea",
              placeholder: "Enter description",
              required: true,
            },
            {
              id: "regularPrice",
              label: "Regular Price",
              type: "number",
              placeholder: "Enter regular price",
              required: true,
            },
            {
              id: "area",
              label: "area",
              type: "number",
              placeholder: "Enter area",
              required: true,
            },
            {
              id: "discountPrice",
              label: "Discount Price",
              type: "number",
              placeholder: "Enter discount price",
            },
            {
              id: "plateNum",
              label: "plateNum ",
              type: "number",
              placeholder: "Enter plateNum ",
            },
            
            // eslint-disable-next-line no-unused-vars
          ].map(({ id, label, type, placeholder, required }) => (
            <motion.div
              key={id}
              className="flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <label htmlFor={id} className="text-gray-600 mb-1 font-semibold">
                {label}
              </label>
              {type === "textarea" ? (
                <textarea
                  id={id}
                  value={formData[id]}
                  onChange={handleInputChange}
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              ) : (
                <input
                  type={type}
                  id={id}
                  required={required}
                  value={formData[id]}
                  onChange={handleInputChange}
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              )}
            </motion.div>
          ))}
{prevData?.estateType !== "Lands" && (
      <>
        {[
          { id: "bathrooms", label: "Bathrooms", type: "number" },
          { id: "bedrooms", label: "Bedrooms", type: "number" },
        ].map(({ id, label, type }) => (
          <div key={id} className="flex flex-col">
            <label htmlFor={id} className="text-gray-600 mb-1 font-semibold">
              {label}
            </label>
            <input
              type={type}
              id={id}
              placeholder={`Enter ${label.toLowerCase()}`}
              required
              value={formData[id]}
              onChange={handleInputChange}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
        ))}
      </>
    )}
          {/* Dropdown for Type */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <label htmlFor="type" className="text-gray-600 mb-1 font-semibold">
              Type
            </label>
            <select
              id="type"
              value={formData?.type}
              onChange={handleInputChange}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </select>
          </motion.div>
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <label className="text-gray-600 mb-1 font-semibold">Sub Type</label>
            <select
              id="estateSubType"
              required
              value={formData?.estateSubType}
              onChange={handleInputChange}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              {/* <option value="">Select</option> */}
              {DataSubType?.map((subType) => (
                <option key={subType} value={subType}>
                  {subType}
                </option>
              ))}
            </select>
          </motion.div>



{/*            */ }


<motion.div className="flex flex-col">
      <label className="text-gray-600 mb-1 font-semibold">City</label>
      <select
        id="city"
        required
        value={formData?.city || ""}
        onChange={handleInputChange}
        className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
      >
        <option value="">Select a city</option>
        {Object.keys(cityAreas).map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </motion.div>

    {/* Address Selection */}
    {formData?.city && (
      <motion.div className="flex flex-col">
        <label className="text-gray-600 mb-1 font-semibold">Address</label>
        <select
          id="address"
          required
          value={formData?.address || ""}
          onChange={handleInputChange}
          className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
        >
          <option value="">Select an address</option>
          {cityAreas[formData?.city][0]?.values.map((address) => (
            <option key={address.id} value={address.label}>
              {address.label}
            </option>
          ))}
        </select>
      </motion.div>
    )}

    {/* Alhood Selection */}
    {formData?.address && (
      <motion.div className="flex flex-col">
        <label className="text-gray-600 mb-1 font-semibold">Alhood</label>
        <select
          id="alhood"
          required
          value={formData?.alhood || ""}
          onChange={handleInputChange}
          className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
        >
          <option value="">Select an alhood</option>
          {cityAreas[formData?.city][0]?.values
            .find((addr) => addr.label === formData?.address)
            ?.alhodlist.map((alhood) => (
              <option key={alhood.id} value={alhood.label}>
                {alhood.label}
              </option>
            ))}
        </select>
      </motion.div>
    )}


{/*            */ }








          {/* Toggles for Offer, Parking, and Furnished */}
          {prevData?.estateType !=="Lands" && <div className="w-full flex flex-row gap-4 flex-wrap">
            {["Offer", "Parking", "Furnished"].map((field) => (
              <motion.div
                key={field}
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <label className="text-gray-600 mr-4 font-semibold">
                  {field}
                </label>
                <GreenSwitch
                  onClick={() => handleToggleChange(field.toLowerCase())}
                  defaultChecked={formData[field.toLowerCase()]}
                />
              </motion.div>
            ))}
          </div>}

          {/* Image Upload Section */}
          <motion.div
            className="flex flex-col sm:col-span-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <label
              htmlFor="images"
              className="text-gray-600 mb-1 font-semibold"
            >
              Upload Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <div className="flex gap-2">
              {previews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md border"
                />
              ))}
            </div>
            <ul className="mt-2 relative flex flex-wrap text-gray-600">
              {formData.imageUrls.map((imageUrl, index) => (
                <li key={index} className=" relative text-sm">
                  {/* <span>{imageUrl}</span> */}
                  <img
                    className="aspect-square  m-2 w-20"
                    src={baseUrl + imageUrl}
                  />
                  <button
                    type="button"
                    onClick={() => deleteImage(imageUrl)}
                    className="text-red-500 absolute top-2 z-10 "
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div>
              <Map lat={formData?.latitude} long={formData?.longitude} onLocationSelect={handleLocationSelect}/>
            
          </motion.div>

          <motion.button
            type="submit"
            className="bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg mt-4 sm:col-span-2 hover:bg-green-700 transition duration-200"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            // disabled={true}
          >
            Update Listing
          </motion.button>
        </form>
        <motion.button
          className="bg-red-400 w-full text-white font-semibold py-3 px-6 rounded-lg mt-4 sm:col-span-2 hover:bg-red-700 transition duration-200"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          onClick={() => handleDeleteListing(prevData?._id)}
        >
          Delete
        </motion.button>
      </main>
    </>
  );
};

export default UpdateListing;
