import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_URL}/auth`,
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ( credentials) => {
        return {
          url: "/signin",
          method: "POST",
          body: credentials,
        };
      },
    }),
    signup: builder.mutation({
      query: ( formData) => {
        return {
          url: "/signup",
          method: "POST",
          body: formData,
        };
      },
    }),
    logedUser: builder.mutation({
      query: ({token}) => {
        return {
          url: "/logedUser",
          headers: { Authorization: `Bearer ${token}` },
          method: "GET",       
        };
      },
    }),
    
    logOutUser:builder.mutation({
      query: ({token}) => {
        return {
          url: "/signout",
          headers: { Authorization: `Bearer ${token}` },
          method: "POST",

        }
      }
    })
  }),
});

export const {useLoginMutation  , useLogedUserMutation ,useLogOutUserMutation , useSignupMutation} = authApi

// export {authApi , useLoginMutation , useLogedUserMutation , useLogOutUserMutation}