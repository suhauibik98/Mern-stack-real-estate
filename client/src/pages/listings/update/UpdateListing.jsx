import {  useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateListing } from "../../../redux/user/ListingSlice";
import { motion } from "framer-motion";
import {
  useUpdateListingByIdMutation,
  useDeleteImageByUrlMutation,
} from "../../../redux/apis/ListingApi";
import Spinner from "../../../components/Spinner";
import PopUpMessages from "../../../components/popup/PopUpMasseges";

const UpdateListing = () => {
  const location = useLocation();
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const baseUrl = `${import.meta.env.VITE_BASEURL}`;

  const prevData = location.state.listings;

  const [ArrayDeleteSubmit, setArrayDeleteSubmit] = useState([]);
  const [formData, setFormData] = useState({
    ...prevData,
    imageUrls: prevData.imageUrls || [],
  });
  const [previews, setPreviews] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const { token } = useSelector((state) => state.user);
  const [updateListingById, { isLoading ,isSuccess , isError  }] = useUpdateListingByIdMutation();
  const [deleteImageByUrl, { isLoading: deleteImageByUrlLoading }] =
    useDeleteImageByUrlMutation();


  const handleInputChange = (e) => {
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
        // navigate("/");
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

  if (isLoading || deleteImageByUrlLoading) return <Spinner />;

  return (
    <>
    {isSuccess && <PopUpMessages message="Listing updated successfully" code={200} />}
    {isError && <PopUpMessages message="Failed to update listing" code={400} />}
    <main className="p-6 max-w-4xl mx-auto">
      <motion.h1
        className="text-4xl font-semibold text-center mb-8 text-gray-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Update a Listing
      </motion.h1>
      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        onSubmit={handleFormSubmit}
      >
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
            id: "bathrooms",
            label: "Bathrooms",
            type: "number",
            placeholder: "Enter bathrooms",
            required: true,
          },
          {
            id: "bedrooms",
            label: "Bedrooms",
            type: "number",
            placeholder: "Enter bedrooms",
            required: true,
          },
          {
            id: "address",
            label: "Address",
            type: "text",
            placeholder: "Enter address",
            required: true,
          },
          {
            id: "city",
            label: "city",
            type: "text",
            placeholder: "Enter city",
            required: true,
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
            value={formData.type}
            onChange={handleInputChange}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Plate">Plate</option>
          </select>
        </motion.div>

        {/* Toggles for Offer, Parking, and Furnished */}
        {["Offer", "Parking", "Furnished"].map((field) => (
          <motion.div
            key={field}
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <label className="text-gray-600 mr-4 font-semibold">{field}</label>
            <button
              type="button"
              onClick={() => handleToggleChange(field.toLowerCase())}
              className={`${
                formData[field.toLowerCase()] ? "bg-green-500" : "bg-gray-300"
              } p-2 rounded-full`}
            >
              {formData[field.toLowerCase()] ? "Yes" : "No"}
            </button>
          </motion.div>
        ))}

        {/* Image Upload Section */}
        <motion.div
          className="flex flex-col sm:col-span-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <label htmlFor="images" className="text-gray-600 mb-1 font-semibold">
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
              <li
                key={index}
                className=" relative text-sm"
              >
                {/* <span>{imageUrl}</span> */}
                <img className="aspect-square  m-2 w-20" src={baseUrl + imageUrl} />
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

        <motion.button
          type="submit"
          className="bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg mt-4 sm:col-span-2 hover:bg-green-700 transition duration-200"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          // disabled={true}
        >
          Update 
        </motion.button>
      </form>
    </main></>
  );
};

export default UpdateListing;
