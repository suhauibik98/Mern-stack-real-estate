/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useCreateListingMutation } from "../../../../redux/apis/ListingApi";
import { useSelector } from "react-redux";
import Spinner from "../../../../components/Spinner";
import Map from "../../../../components/Map";
import { cityAreas } from "../../../../cityAreas";
const CreateListing = ({ type, dataSubType, selectedType }) => {
  const { token } = useSelector((state) => state.user);

  // const [location, setLocation] = useState({ latitude: null, longitude: null });

  const [images, setImages] = useState([]);

  const [createListing, { isLoading }] = useCreateListingMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    area: "",
    regularPrice: "",
    discountPrice: "",
    plateNum: "",
    alhood: "",
    bathrooms: "",
    bedrooms: "",
    furnished: "",
    address: "",
    type,
    city: "",
    parking: "",
    offer: "",
    estateType: selectedType,
    estateSubType: "",
    latitude: null,
    longitude: null,
  });

  const handleLocationSelect = (coords) => {
    // setLocation(coords);
    setFormData((prev) => ({ ...prev, ...coords }));
  };
  // useEffect(()=>{
  //   setFormData({...formData , ...location })
  // },[location])

  const [selectedCity, setSelectedCity] = useState("");
  const [areas, setAreas] = useState([]);
  const [alhoodList, setAlhoodList] = useState([]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setFormData({ ...formData, city, address: "", alhood: "" });

    // Update areas based on the selected city
    if (city === "Irbid") {
      const irbidAreas = cityAreas.Irbid[0].values.map((area) => area.label);
      setAreas(irbidAreas);
    } else {
      setAreas(cityAreas[city] || []);
    }
    setAlhoodList([]); // Reset alhood list when changing the city
  };

  const handleAreaChange = (e) => {
    const area = e.target.value;
    setFormData({ ...formData, address: area, alhood: "" });

    // Update alhood list based on the selected area
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
    setFormData({ ...formData, alhood: alhood });
  };

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "") {
        formDataToSend.append(key, value);
      }
    });

    images.forEach((image) => {
      formDataToSend.append("images", image);
    });

    try {
      console.log(Object.fromEntries(formDataToSend));

      await createListing({ formData: formDataToSend, token });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDataSubTypeChange = (e) => {
    setFormData({ ...formData, estateSubType: e.target.value });
  };

  if (isLoading) return <Spinner />;

  return (
    <main className="p-6 max-w-4xl mx-auto mt-10">
      <h1 className="text-4xl font-semibold text-center mb-8 text-gray-700">
        Create a Listing
      </h1>
      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        onSubmit={handleFormSubmit}
      >
        {/* Sub Type Dropdown */}
        {dataSubType && (
          <div className="flex flex-col">
            <label
              htmlFor="dataSubType"
              className="text-gray-600 mb-1 font-semibold"
            >
              Sub Type
            </label>
            <select
              id="dataSubType"
              required
              value={formData.estateSubType}
              onChange={handleDataSubTypeChange}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="">Select</option>
              {dataSubType.map((subType) => (
                <option key={subType} value={subType}>
                  {subType}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* City Dropdown */}
        <div className="flex flex-col">
          <label htmlFor="city" className="text-gray-600 mb-1 font-semibold">
            City
          </label>
          <select
            id="city"
            required
            value={selectedCity}
            onChange={handleCityChange}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="">Select a City</option>
            {Object.keys(cityAreas).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Country/Address Dropdown */}
        <div className="flex flex-col">
          <label htmlFor="address" className="text-gray-600 mb-1 font-semibold">
            Country
          </label>
          <select
            id="address"
            required
            value={formData.address}
            onChange={handleAreaChange}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            disabled={!areas.length}
          >
            <option value="">Select a Country</option>
            {areas.map((area, index) => (
              <option key={index} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Alhood Dropdown */}
        {
          <div className="flex flex-col">
            <label
              htmlFor="alhood"
              className="text-gray-600 mb-1 font-semibold"
            >
              Alhood
            </label>
            <select
              id="alhood"
              required
              value={formData.alhood}
              onChange={handleAlhoodChange}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="">Select Alhood</option>
              {alhoodList.map((alhood) => (
                <option key={alhood.id} value={alhood.label}>
                  {alhood.label}
                </option>
              ))}
            </select>
          </div>
        }

        {/* Input Fields */}
        {[
          {
            id: "name",
            label: "Title",
            type: "text",
            placeholder: "Enter title",
          },
          {
            id: "description",
            label: "Description",
            type: "textarea",
            placeholder: "Enter description",
          },
          {
            id: "regularPrice",
            label: "Regular Price",
            type: "number",
            placeholder: "Enter regular price",
          },
          {
            id: "discountPrice",
            label: "Discount Price",
            type: "number",
            placeholder: "Enter discount price",
          },
          {
            id: "area",
            label: "Area",
            type: "number",
            placeholder: "Enter area",
          },
          {
            id: "plateNum",
            label: "Plate Number",
            type: "text",
            placeholder: "Enter plate number",
          },
        ].map(({ id, label, type, placeholder }) => (
          <div key={id} className="flex flex-col">
            <label htmlFor={id} className="text-gray-600 mb-1 font-semibold">
              {label}
            </label>
            {type === "textarea" ? (
              <textarea
                id={id}
                placeholder={placeholder}
                required
                value={formData[id]}
                onChange={handleInputChange}
                className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            ) : (
              <input
                type={type}
                id={id}
                placeholder={placeholder}
                required
                value={formData[id]}
                onChange={handleInputChange}
                className="border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            )}
          </div>
        ))}

        {/* Bathrooms and Bedrooms */}
        {selectedType !== "Lands" && (
          <>
            {[
              { id: "bathrooms", label: "Bathrooms", type: "number" },
              { id: "bedrooms", label: "Bedrooms", type: "number" },
            ].map(({ id, label, type }) => (
              <div key={id} className="flex flex-col">
                <label
                  htmlFor={id}
                  className="text-gray-600 mb-1 font-semibold"
                >
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

        {/* Furnished, Offer, Parking */}
        {selectedType !== "Lands" &&
          [
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

        {/* Image Upload */}
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
        </div>
        <div className="flex flex-col sm:col-span-2">
          <Map onLocationSelect={handleLocationSelect} />
        </div>

        {/* Submit Button */}
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
