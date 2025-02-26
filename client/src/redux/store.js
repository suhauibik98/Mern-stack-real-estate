import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./user/userSlice";
import { allUsersSlice } from "./user/allUsersSlice";
import { ListingSlice } from "./user/ListingSlice";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { authApi } from "./apis/AuthApi";
import { listingApi } from "./apis/ListingApi";
import { userApi } from "./apis/UserApi";
import { adminApi} from  "./apis/AdminApi";
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    listing: ListingSlice.reducer,
    allUsers: allUsersSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [listingApi.reducerPath] :listingApi.reducer,
    [userApi.reducerPath] :userApi.reducer,
    [adminApi.reducerPath] :adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
  .concat(authApi.middleware)
  .concat(listingApi.middleware)
  .concat(userApi.middleware)
  .concat(adminApi.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

export { store };
