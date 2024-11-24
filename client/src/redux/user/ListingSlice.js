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
      const index = state.listing.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.listing[index] = { ...state.listing[index], ...action.payload };
      }
    },
    deleteListing: (state, action) => {
      state.listing = state.listing.filter(
        listing => listing._id.toString() !== action.payload.listingId
      );
    },
  },
});

export const { setListing, updateListing, deleteListing } = ListingSlice.actions;
export default ListingSlice.reducer;
