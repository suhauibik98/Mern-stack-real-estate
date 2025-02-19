import React, { useState, useEffect, useRef } from "react";
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
import { useGetAllListingsForAdminQuery } from "../../../redux/apis/AdminApi";
import { useSelector } from "react-redux";

const CardInfoListings = ({ title }) => {
  const { token } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const [listings, setListings] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const listContainerRef = useRef(null);

  const { data: FetchListings, isLoading } = useGetAllListingsForAdminQuery({
    token,
    page,
  });

  const baseUrl = "http://10.10.30.30:5000";

  useEffect(() => {
    if (FetchListings?.listings?.length > 0) {
      setListings((prev) => [...prev, ...FetchListings.listings]);
      setIsFetching(false); // Stop spinner after data fetch
    }
  }, [FetchListings]);

  const handleScroll = () => {
    const container = listContainerRef.current;
    if (
      container.scrollTop + container.clientHeight >= container.scrollHeight &&
      !isFetching &&
      page < FetchListings?.totalPage
    ) {
      setPage((prevPage) => prevPage + 1);
      setIsFetching(true);
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
        <span className="text-[0.8rem]">({FetchListings?.total || 0})</span>
      </Box>
      <Divider />
      <CardContent
        ref={listContainerRef}
        onScroll={handleScroll}
        sx={{
          maxHeight: "300px", // Set a max height for scrollable content
          overflowY: "auto",
        }}
      >
        <List className="ulli" sx={{ width: "100%", bgcolor: "background.paper" }}>
          {listings.length > 0 ? (
            listings.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={`${baseUrl}${item?.imageUrls[0] || ""}`}>
                      {item?.imageUrls[0] ? null : <ImageIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item?.name || "Unknown Listing"}
                    secondary={
                      new Date(item?.updatedAt).toLocaleString() ||
                      "Unknown Date"
                    }
                  />
                  <ListItemText
                    secondary={item?.userRef?.username}
                  />
                  <span className="border border-orange-300 text-orange-600 float-right px-2 rounded-3xl">
                    {item?.estateType}
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
        {isFetching && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        {page === FetchListings?.totalPage && listings.length > 0 && (
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

export default CardInfoListings;
