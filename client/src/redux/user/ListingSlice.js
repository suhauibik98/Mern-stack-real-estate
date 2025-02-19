import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listing: [],
};

const ListingSlice = createSlice({
  name: "listing",
  initialState,
  reducers: {
    setListing: (state, action) => {
      state.listing = action.payload;
    },



    updateListing: (state, action) => {  
      const index = state.listing.findIndex(item => item?._id === action.payload?._id);
      if (index !== -1) {
        state.listing[index] = { ...state.listing[index], ...action.payload };
      }
    },


    deleteListing: (state, action) => {
      state.listing = state.listing.filter(
        listing => listing._id.toString() !== action.payload.listingId
      );
    },

    setMapLocation:(state,payload)=>{
      console.log(payload);
      
      state.listing.map((item)=>{
        if(item._id===payload.listingId){
          item.location=payload.location
          }
          })
    }
  },
});

export const { setListing, updateListing, deleteListing , setMapLocation } = ListingSlice.actions;
export {ListingSlice};
