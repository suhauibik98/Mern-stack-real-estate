import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listing :[],
};



const ListingSlice = createSlice({
    name: "listing",
  initialState,
  reducers: {
      
      
      setListing: (state , action) => {
          state.listing = action.payload ;
        },
        updateListing:(state , action)=>{

             return state.listing.map((item) => {
                if (item.id === action.payload.id) {
                    return { ...item, ...action.payload };
                    }
                    return item;
                    });

        },
        deleteListing:(state,action)=>{
            state.listing.filter(listing => listing._id.toString() !== action.payload.listingId)
        },
        
    },
});

export const {
    setListing,
    deleteListing,
    updateListing
 
} = ListingSlice.actions;
export default ListingSlice.reducer;
