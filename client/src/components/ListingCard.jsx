/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom";


function ListingCard({ listing }) {
const {_id} = listing 
const Navigate = useNavigate();

  return (
    <div className="bg-white cursor-pointer rounded-lg shadow-lg overflow-hidden w-full max-w-sm m-4" onClick={()=>Navigate(`/card-ditails/${_id}` , {state:{listing}} )}>
      <div className="relative h-48">
        {listing.imageUrls?.[0] ? (
          <img
            src={listing.imageUrls[0]}
            alt={listing.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            No Image Available
          </div>
        )}
        {listing.offer && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
            Offer
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 truncate">{listing.name}</h3>
        <p className="text-blue-500 text-lg font-bold mb-2">
          JOD {listing.offer ? listing.discountPrice : listing.regularPrice}
        </p>
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{listing.description}</p>
        <div className="flex items-center text-gray-600 mb-4">
          <div className="flex items-center mr-4">
            <span className="material-icons text-gray-500 mr-1">bed</span>
            {listing.bedrooms}
          </div>
          <div className="flex items-center mr-4">
            <span className="material-icons text-gray-500 mr-1">bathtub</span>
            {listing.bathrooms}
          </div>
          <div className="flex items-center">
            <span className="material-icons text-gray-500 mr-1">square_foot</span>
            {listing.size} m²
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={listing.userRef?.avatar} // replace with actual profile image or remove if unnecessary
              alt="user"
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-gray-600">{listing.userRef?.username}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <button>
              <span className="material-icons">favorite_border</span>
            </button>
            <button>
              <span className="material-icons">share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingCard;
