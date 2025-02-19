import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.10.30.30:5000/api/admin",
  }),
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: ({ token, page }) => ({
        url: `/get-all-users?page=${page}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    changeUserRole: builder.mutation({
      query: ({ token, userId }) => ({
        url: `/change-role-user/${userId}`,
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    blockedUser: builder.mutation({
      query: ({ token, userId }) => ({
        url: `/blocked-user/${userId}`,
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    getUserById: builder.query({
      query: ({ token, userId }) => ({
        url: `/get-user/${userId}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    updateUser: builder.mutation({
      query: ({ token, userId, formData }) => ({
        url: `/update/${userId}`,
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }),
    }),
    getUserListingsAdmin: builder.query({
      query: ({ token, userId, page }) => ({
        url: `/get-user-listings-admin/${userId}?page=${page}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    deleteUserListingsAdmin: builder.mutation({
      query: ({ token, Listings_id }) => ({
        url: `/delete-user-listings-admin/${Listings_id}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    getAllUserCount: builder.query({
      query: ({ token }) => ({
        url: "/get-all-users-count",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    getAllListingsCount: builder.query({
      query: ({ token }) => ({
        url: "/get-all-listings-count",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    getAllListingsForAdmin: builder.query({
      query: ({ token, page }) => ({
        url: `/get-all-listings-admin?page=${page}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    deleteUserAndHisListingsByAdmin: builder.mutation({
      query: ({ token, userId  , password }) => ({
        url: `/delete-user-and-listings-by-admin/${userId}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        body:{password}
      }),
    }),
    getMessegesFromDB : builder.query({
      query: ({ token }) => ({
        url: "/get-messeges-from-db",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        }),
    })
  }),
});
export const {
  useGetAllUserQuery,
  useChangeUserRoleMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useBlockedUserMutation,
  useGetUserListingsAdminQuery,
  useDeleteUserListingsAdminMutation,
  useGetAllUserCountQuery,
  useGetAllListingsCountQuery,
  useGetAllListingsForAdminQuery,
  useDeleteUserAndHisListingsByAdminMutation,
  useGetMessegesFromDBQuery
} = adminApi;
