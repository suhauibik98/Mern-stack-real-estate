import { useSelector } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Card,
  CardContent,
} from "@mui/material";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  useGetAllListingsCountQuery,
  useGetAllUserCountQuery,
} from "../../../redux/apis/AdminApi";
import CardInfoUser from "./CardInfoUser";
import CardInfoListings from "./CardInfoListings";

const HomeAdmin = () => {
  const { currentUser, token } = useSelector((state) => state.user);
  const { data: userCount } = useGetAllUserCountQuery({ token });
  const { data: listingsCount } = useGetAllListingsCountQuery({ token });
  // const { data: FetchListings } = useGetAllListingsForAdminQuery({ token , page });

  return (
    <div className="w-full flex flex-col gap-5 ">
      <div className="">
        <Typography variant="h5">{currentUser?.username}</Typography>
        <Typography variant="body1">
          last login : {new Date(currentUser?.lastLogin).toLocaleString()}{" "}
        </Typography>
      </div>
      <div className="w-full flex bg-gray-100 shadow-lg p-4 my-2">
        <div className="flex justify-center items-center flex-col gap-2 w-full h-32 md:h-60">
          <label>Total users</label>
          <CircularProgressbar value={userCount} text={`${userCount}`} />
        </div>
        <div className="flex justify-center items-center flex-col gap-2  w-full h-32 md:h-60">
          <label>Total Listings</label>
          <CircularProgressbar
            value={listingsCount}
            text={`${listingsCount}`}
          />
        </div>
      </div>
      <div className="w-full h-full flex gap-4 flex-col md:flex-row">
        <CardInfoUser title={"all user"} />
        <CardInfoListings title={"All listings"} />
      </div>
    </div>
  );
};

export default HomeAdmin;
