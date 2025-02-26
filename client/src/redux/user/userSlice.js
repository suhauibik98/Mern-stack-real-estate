import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  token: localStorage.getItem("token")? JSON.parse(localStorage.getItem("token")): null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {       
      state.loading = false;
      state.currentUser = action.payload.currentUser;
      state.token = action.payload.token;
      state.error = null;
      if(action.payload.token){
        localStorage.setItem("token", JSON.stringify(action.payload.token));
      }
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStart: (state) => {
      state.loading = true;
    },
    updateSuccess: (state, action) => {     
      state.currentUser = {...action.payload.data};
      state.loading = false;
      state.error = null;
    },
    updateAvatarSuccess:(state , action)=>{
      state.currentUser = {...state.currentUser , avatar : action.payload.data }
    },
    deleteAvatarSuccess:(state )=>{
      state.currentUser = {...state.currentUser , avatar : "https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png" }
    },
    updateFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;

    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutStart: (state) => {
      state.loading = true;
    },
    signOutSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.token = null
      state.error = null;
      localStorage.removeItem("token");
    },
    signOutFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  signInFailure,
  signInStart,
  signInSuccess,
  updateFailure,
  updateSuccess,
  updateStart,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutStart,
  signOutSuccess,
  signOutFailure,
  updateAvatarSuccess,
  deleteAvatarSuccess
} = userSlice.actions;

export { userSlice };
