import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  deleteObject,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateListing } from "../redux/user/ListingSlice";

import { getAuth } from "firebase/auth";

const UpdateListing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth();
  //   console.log(auth.currentUser.uid);

  // Load previous listing data
  const prevData = location.state.listing;
  const [fileProgress, setFileProgress] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({
    ...prevData,
    imageUrls: prevData.imageUrls || [], // Load previous image URLs
  });

  useEffect(() => {
    // console.log(prevData);

    console.log(formData);
  }, [formData.imageUrls]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle new file uploads
  const handleFileChange = (e) => {
    handleFileUpload(e.target.files);
  };

  // Handle image deletion
  const deleteImage = async (imageUrl) => {
    if (auth.currentUser) {
      const storage = getStorage(app);

      const imageRef = ref(storage, imageUrl);
      try {
        await deleteObject(imageRef); // Delete the file from Firebase

        setFormData((prev) => ({
          ...prev,
          imageUrls: prev.imageUrls.filter((url) => url !== imageUrl),
        })); // Remove from state
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    } else console.log("no user");

  };

  const changeImage = (url)=>{
   console.log(formData , url);
   
    setFormData((prev)=>({
      ...prev,
      imageUrls: prev.imageUrls.filter((Url) => Url !== url )
    }))

  }

  // Upload new imageUrls

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

  // Handle form submission
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

        // Update Redux state
        dispatch(updateListing(updatedListing));

        // Navigate back to listings page
        navigate("/listings");
      } else {
        console.error("Failed to update listing");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-semibold text-center mb-8 text-gray-700">
        Update a Listing
      </h1>
      <p className="text-sm self-center">
        {fileUploadError ? (
          <span className="text-red-700">
            Error uploading image (must be less than 2 MB)
          </span>
        ) : fileProgress > 0 && fileProgress < 100 ? (
          <span className="text-slate-500">{`Upload ${fileProgress}%`}</span>
        ) : fileProgress === 100 ? (
          <span className="text-green-400">Image successfully uploaded</span>
        ) : (
          ""
        )}
      </p>
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
            id: "type",
            label: "Type",
            type: "text",
            placeholder: "Enter type (e.g., Apartment, House)",
            required: true,
          },
        ].map(({ id, label, type, placeholder, required }) => (
          <div key={id} className="flex flex-col">
            <label htmlFor={id} className="text-gray-600 mb-1 font-semibold">
              {label}
            </label>
            {type === "textarea" ? (
              <textarea
                id={id}
                placeholder={placeholder}
                required={required}
                value={formData[id]}
                onChange={handleInputChange}
                className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            ) : (
              <input
                type={type}
                id={id}
                placeholder={placeholder}
                required={required}
                value={formData[id]}
                onChange={handleInputChange}
                className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            )}
          </div>
        ))}

        {/* Image Upload Section */}
        <div className="flex flex-col sm:col-span-2">
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
              <li
                key={index}
                className="text-sm flex items-center justify-between"
              >
                <span>{imageUrl}</span>
                <img className="aspect-square w-20" src={imageUrl} />
                <button
                  type="button"
                  onClick={() => changeImage(imageUrl)}
                  className="text-red-500 ml-2"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg mt-4 sm:col-span-2 hover:bg-green-700 transition duration-200"
        >
          Update Listing
        </button>
      </form>
    </main>
  );
};

export default UpdateListing;
