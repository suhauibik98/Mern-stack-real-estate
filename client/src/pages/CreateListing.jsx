import {  useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";


const CreateListing = () => {
  const Nav = useNavigate()
  const [fileProgress, setFileProgress] = useState(0)
  const [fileUploadError, setfileUploadError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    regularPrice: "",
    discountPrice: "",
    bathrooms: "",
    bedrooms: "",
    furnished: "",
    address: "",
    type: "",
    parking: "",
    offer: "",
    images: [], // Array for multiple image files
    userRef: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    handleFileUpload(e.target.files)
   
  };

const handleFileUpload = (files)=>{
Array.from(files).map((file)=>{

 
  const storage = getStorage(app);
  const fileName = new Date().getTime() + "_" + file.name;
  const uploadTask = uploadBytesResumable(ref(storage, fileName), file);

uploadTask.on("state_changed" , (snapshot)=>{
const progress = (snapshot.bytesTransferred / snapshot.totalBytes) *100;
setFileProgress(Math.round(progress))

},
(error)=>{
  setfileUploadError(error)
  console.log(error)
},
async ()=>{
  const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  setFormData((prev) => ({ ...prev, images: [...prev.images, downloadURL]
    }));
}
)
 })
}


  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const submissionData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        formData.images.forEach((file) => submissionData.append("images", file));
      } else {
        submissionData.append(key, formData[key]);
      }
    });

    try {
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        body:JSON.stringify(formData),
      });
      const data = await res.json();
          Nav("/")
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-semibold text-center mb-8 text-gray-700">Create a Listing</h1>
      <p className="text-sm self-center">
            {fileUploadError ? (
              <span className="text-red-700">
                Error Image Upload (image must be less 2 mb)
              </span>
            ) : fileProgress > 0 && fileProgress < 100 ? (
              <span className="text-slate-500">{`Upload ${fileProgress}%`}</span>
            ) 
            : fileProgress === 100 ? (
              <span className="text-green-400">Image successfuly upload</span>
            ) : (
              ""
            )}
          </p>
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-6" onSubmit={handleFormSubmit}>
        {[
          { id: "name", label: "Name", type: "text", placeholder: "Enter name", required: true },
          { id: "description", label: "Description", type: "textarea", placeholder: "Enter description", required: true },
          { id: "regularPrice", label: "Regular Price", type: "number", placeholder: "Enter regular price", required: true },
          { id: "discountPrice", label: "Discount Price", type: "number", placeholder: "Enter discount price" },
          { id: "bathrooms", label: "Bathrooms", type: "number", placeholder: "Enter bathrooms", required: true },
          { id: "bedrooms", label: "Bedrooms", type: "number", placeholder: "Enter bedrooms", required: true },
          { id: "address", label: "Address", type: "text", placeholder: "Enter address", required: true },
          { id: "type", label: "Type", type: "text", placeholder: "Enter type (e.g., Apartment, House)", required: true },
          { id: "userRef", label: "User Reference", type: "text", placeholder: "Enter user reference", required: true },
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

        {[
          { id: "furnished", label: "Furnished" },
          { id: "offer", label: "Offer" },
          { id: "parking", label: "Parking" },
        ].map(({ id, label }) => (
          <div key={id} className="flex flex-col">
            <label htmlFor={id} className="text-gray-600 mb-1 font-semibold">
              {label}
            </label>
            <select
              id={id}
              required
              value={formData[id]}
              onChange={handleInputChange}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="">Select {label}</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        ))}

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
            {formData.images.map((file, index) => (
              <li key={index} className="text-sm">
                {file.name}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg mt-4 sm:col-span-2 hover:bg-green-700 transition duration-200"
        >
          Submit Listing
        </button>
      </form>
    </main>
  );
};

export default CreateListing;
