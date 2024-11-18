import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteListing } from "../redux/user/ListingSlice";

export const CardDetails = () => {
  const Nav = useNavigate();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const dispatch = useDispatch();

console.log(params);

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const response = await fetch(
          `/api/listing/get-cours-id/${params.cardId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setListing(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchListingDetails();
  }, [params.cardId]);

  


  if (!listing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-gray-500">Loading...</p>
      </div>
    );
  }
const {
    name,
    description,
    address,
    bathrooms,
    bedrooms,
    furnished,
    offer,
    parking,
    discountPrice,
    regularPrice,
    type,
    imageUrls,
  } = listing;
  const handleDeleteListing = async (id) => {
    try {
      await fetch(`/api/listing/delete-cours-id/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch(deleteListing(id));
      Nav("/");
    } catch (err) {
      console.error(err);
    }
  };

const handleUpdateListing =(id)=>{
    //update listing logic here
Nav(`/card-update/${id}` , {state:{listing}})
}


  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Image Section */}
        <div className="relative">
          <img
            src={imageUrls[0]}
            alt={name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 left-4 bg-green-600 text-white text-sm uppercase px-3 py-1 rounded-full">
            {offer ? "Offer" : "No Offer"}
          </div>
          {furnished && (
            <div className="absolute top-4 right-4 bg-blue-600 text-white text-sm uppercase px-3 py-1 rounded-full">
              Furnished
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6  space-y-4">
          <button
            onClick={() => handleDeleteListing(listing._id)}
            className="bg-red-500 mx-2 text-white p-2 rounded-xl text-lg font-bold"
          >
            Delete listing
          </button> 
          <button
            onClick={() => handleUpdateListing(listing._id)}
            className="bg-green-500 text-white p-2 rounded-xl text-lg font-bold"
          >
            Update listing
          </button> 
          
          <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
          <p className="text-gray-600">{description}</p>
         

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="text-lg font-medium">{type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-lg font-medium">{address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bedrooms</p>
              <p className="text-lg font-medium">{bedrooms}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bathrooms</p>
              <p className="text-lg font-medium">{bathrooms}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Parking</p>
              <p className="text-lg font-medium">
                {parking ? "Available" : "Not Available"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-500">Regular Price</p>
              <p className="text-lg font-medium">${regularPrice}</p>
            </div>
            {offer && (
              <div>
                <p className="text-sm text-gray-500">Discount Price</p>
                <p className="text-lg font-medium text-green-600">
                  ${discountPrice}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Images Section */}
        {imageUrls.length > 1 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-3">More Images</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {imageUrls.slice(1).map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Additional Image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
