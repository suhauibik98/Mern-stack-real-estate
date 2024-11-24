import { useEffect } from "react";
import ListingCard from "../components/ListingCard";
import { useDispatch ,useSelector } from "react-redux";
import { setListing } from "../redux/user/ListingSlice";

function Home() {
  // const [data, setData] = useState(null);
 const dispatch = useDispatch()
 const {listing} = useSelector((state) => state.listing);
 

  

 useEffect(() => {
  const handleGetAll = async () => {
    try {
      const res = await fetch("/api/listing/get-all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();
      dispatch(setListing(result));
    } catch (error) {
      console.error(error);
    }
  };

  handleGetAll();
}, [dispatch]);

  return (
    <div className="flex flex-wrap justify-center px-4 py-8">
      {listing ? (
        Array.isArray(listing) ? (
          listing.map((item, index) => (
            <ListingCard key={index} listing={item} />
          ))
        ) : (
          <ListingCard listing={listing} />
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Home;
