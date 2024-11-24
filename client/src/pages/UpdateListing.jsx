import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject
} from "firebase/storage";
import { app } from "../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateListing } from "../redux/user/ListingSlice";
import { getAuth } from "firebase/auth";
import { motion } from "framer-motion";

const UpdateListing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth();

  const prevData = location.state.listing;
  const [fileProgress, setFileProgress] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({
    ...prevData,
    imageUrls: prevData.imageUrls || [],
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleToggleChange = (field) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFileChange = (e) => {
    handleFileUpload(e.target.files);
  };

  const handleFileUpload = (files) => {
    const storage = getStorage(app);
    Array.from(files).forEach((file) => {
      const fileName = `${new Date().getTime()}_${file.name}`;
      const uploadTask = uploadBytesResumable(ref(storage, fileName), file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFileProgress(Math.round(progress));
        },
        (error) => {
          setFileUploadError(true);
          console.error("Upload error:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData((prev) => ({
            ...prev,
            imageUrls: [...prev.imageUrls, downloadURL],
          }));
        }
      );
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `/api/listing/update-cours-id/${prevData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const updatedListing = await response.json();
        dispatch(updateListing(updatedListing));
        navigate("/");
      } else {
        console.error("Failed to update listing");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

   const deleteImage = async (imageUrl) => {
    if (auth.currentUser) {
      const storage = getStorage(app);
      const imageRef = ref(storage, imageUrl);
      try {
        await deleteObject(imageRef);
        setFormData((prev) => ({
          ...prev,
          imageUrls: prev.imageUrls.filter((url) => url !== imageUrl),
        }));
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
  };

  return (
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
          { id: "name", label: "Name", type: "text", placeholder: "Enter name", required: true },
          { id: "description", label: "Description", type: "textarea", placeholder: "Enter description", required: true },
          { id: "regularPrice", label: "Regular Price", type: "number", placeholder: "Enter regular price", required: true },
          { id: "discountPrice", label: "Discount Price", type: "number", placeholder: "Enter discount price" },
          { id: "bathrooms", label: "Bathrooms", type: "number", placeholder: "Enter bathrooms", required: true },
          { id: "bedrooms", label: "Bedrooms", type: "number", placeholder: "Enter bedrooms", required: true },
          { id: "address", label: "Address", type: "text", placeholder: "Enter address", required: true },
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
          <ul className="mt-2 text-gray-600">
            {formData.imageUrls.map((imageUrl, index) => (
              <li key={index} className="text-sm flex items-center justify-between">
                <span>{imageUrl}</span>
                <img className="aspect-square w-20" src={imageUrl} />
                <button
                  type="button"
                  onClick={() => deleteImage(imageUrl)}
                  className="text-red-500 ml-2"
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
        >
          Update Listing
        </motion.button>
      </form>
    </main>
  );
};

export default UpdateListing;
