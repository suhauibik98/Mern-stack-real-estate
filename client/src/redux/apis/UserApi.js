import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_URL}/user`,
  }),
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: ({
        password,
        new_password,
        username,
        email,
        avatar,
        token,
        userId,
        phone
      }) => ({
        url: `/update/${userId}`,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: { password, new_password, username, email, avatar ,phone },
      }),
    }),
    deleteUser: builder.mutation({
      query: ({ token, userId }) => ({
        url: `/delete/${userId}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    uploadUserAvatar: builder.mutation({
      query: ({ token, file }) => ({
        url: "/upload-avatar",
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: file,
      }),
    }),
    deleteUserAvatar: builder.mutation({
      query: ({ token }) => ({
        url: "/delete-avatar",
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    contactMessage: builder.mutation({
      query: ({ formData }) => ({
        url: "/contact-message",
        method: "POST",
        body:  formData ,
      }),
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUploadUserAvatarMutation,
  useDeleteUserAvatarMutation,
  useContactMessageMutation,
} = userApi;
