import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
  Box,
  Card,
  Divider,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useGetAllUserQuery } from "../../../redux/apis/AdminApi";
import { useSelector } from "react-redux";

const CardInfoUser = ({ title }) => {
  const { token } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const [info, setInfo] = useState([]);
  const baseUrl = `${import.meta.env.VITE_BASEURL}`;
  
  // Correcting the API query hook usage:
  
  const { data: FetchUsers, isLoading } = useGetAllUserQuery(
    { token, page }, 
    { keepPreviousData: true, skip: !token } 
  );

  const UserRef = useRef();

  useEffect(() => {
    // Ensure `map` is an array and update the state
    if (FetchUsers?.All_users.length > 0) {
      setInfo((pre) => [...pre, ...FetchUsers?.All_users]);
    }
  }, [FetchUsers]);

  const handleScroll = () => {
    const { current: element } = UserRef;
    if (
      element.scrollTop + element.clientHeight >= element.scrollHeight &&
      page < FetchUsers?.totalPage
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <Card
      sx={{
        width: { xs: "100%", md: "400px", lg: "450px" },
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 1,
        cursor: "pointer",
        transition: "box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: 5,
        },
      }}
    >
      <Box
        bgcolor="#2D7CBF"
        color="white"
        sx={{
          fontSize: { xs: "1rem", sm: "1.1rem", md: "1.3rem" },
          textTransform: "capitalize",
          fontWeight: "500",
          padding: 1,
        }}
      >
        {title}
        <span className="text-[0.8rem]">({FetchUsers?.Total_users})</span>
      </Box>
      <Divider />
      <CardContent
        onScroll={handleScroll}
        ref={UserRef}
        sx={{ maxHeight: "300px", overflowY: "auto" }}
      >
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {info.length > 0 ? (
            info.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={`${baseUrl}${item?.avatar || ""}`}>
                      {item?.avatar ? null : <Avatar />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item?.username || "Unknown User"}
                    secondary={new Date(item?.createdAt).toLocaleString() || "Unknown Date"}
                  />
                  <span
                    className={`border ${
                      item?.isAdmin
                        ? "border-green-200 text-green-500"
                        : "border-blue-400 text-blue-600 "
                    } float-right px-2 rounded-3xl`}
                  >
                    {item?.isAdmin ? "Admin" : "User"}
                  </span>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No items available.
            </Typography>
          )}
        </List>
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        {page === FetchUsers?.totalPage && info.length > 0 && (
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ py: 2 }}
          >
            No more listings to load.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default CardInfoUser;
