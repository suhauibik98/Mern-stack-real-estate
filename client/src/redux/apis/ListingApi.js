import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const listingApi = createApi({
  reducerPath: "listingApi", // Unique key for this API slice
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_URL}/listing`, // Base URL for the API
  }),
  tagTypes: ["Listing"], // Tags for caching and invalidation
  endpoints: (builder) => ({
    // Create a listing
    createListing: builder.mutation({
      query: ({ token, formData }) => ({
        url: "/create", // Endpoint path
        method: "POST", // HTTP method
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }),
      invalidatesTags: ["Listing"], // Invalidates cache when a listing is created
    }),

    // Get all listings with pagination
    getAllListing: builder.query({
      query: ({ token, page }) => ({
        url: `/get-all?page=${page}`, // Endpoint path with pagination
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
      providesTags: ["Listing"], // Provides cache tags for listings
    }),

    // Get a listing by ID
    getListingById: builder.query({
      query: ({ token, Listings_id }) => ({
        url: `/get-card-id/${Listings_id}`, // Endpoint path with ID
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
      providesTags: (result, error, { Listings_id }) => [
        { type: "Listing", id: Listings_id },
      ], // Provides cache tag specific to the listing ID
    }),

    // Update a listing by ID
    updateListingById: builder.mutation({
      query: ({ token, Listings_id, formData }) => ({
        url: `/update-card-id/${Listings_id}`, // Endpoint path with ID
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }),
      invalidatesTags: (result, error, { Listings_id }) => [
        { type: "Listing", id: Listings_id },
      ], // Invalidates cache for the specific listing
    }),

    // Delete a listing by ID
    deleteListingById: builder.mutation({
      query: ({ token, Listings_id }) => ({
        url: `/delete-card-id/${Listings_id}`, // Endpoint path with ID
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }),
      invalidatesTags: (result, error, { Listings_id }) => [
        { type: "Listing", id: Listings_id },
      ], // Invalidates cache for the deleted listing
    }),
    getEstateTypes: builder.query({
      query: ({ token }) => ({
        url: "/estate-types", // Endpoint path with ID
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    getEstateSubType: builder.query({
      query: ({ token ,type}) => ({
        url: `/estate-sub-type/${type}`, // Endpoint path with ID
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    deleteImageByUrl: builder.mutation({
      query: ({ token ,imageUrl , list_id}) => ({
        url: "/delete-image", // Endpoint path with ID
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        body: {imageUrl ,list_id}
      }),
    }),
    getAllListingTypeSales: builder.query({
      query: ({ token  , page}) => ({
        url: `/get-type-sales?page=${page}`, // Endpoint path with ID
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    //method to get all user listings must be in userApi file
    getUserListings: builder.query({
      query: ({ token  ,userId, page}) => ({
        url: `/get-user-listings/${userId}?page=${page}`, // Endpoint path with ID
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    getListingsByFilter: builder.mutation({
      query: ({ token  ,formData, page}) => ({
        url: `/get-listings-filter?page=${page}`, 
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body:{formData}
      }),
    }),
    //method to get listings not auth
    getListingNotAuth: builder.query({
      query: () => ({
        url: "/get-listing-not-auth", 
        method: "GET",
      }),
    }),
    //method to get listings not auth
    getLastListingNotAuth: builder.query({
      query: () => ({
        url: "/get-last-listing-not-auth", 
        method: "GET",
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllListingQuery,
  useCreateListingMutation,
  useGetListingByIdQuery,
  useUpdateListingByIdMutation,
  useDeleteListingByIdMutation,
  useGetEstateTypesQuery,
  useGetEstateSubTypeQuery,
  useDeleteImageByUrlMutation,
  useGetAllListingTypeSalesQuery,
  useGetUserListingsQuery,
  useGetListingsByFilterMutation,
  useGetListingNotAuthQuery,
  useGetLastListingNotAuthQuery,
} = listingApi;
