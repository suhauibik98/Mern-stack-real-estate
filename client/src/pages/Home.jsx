import { useEffect, useState } from "react";
import ListingCard from "../components/ListingCard";

function Home() {
  const [data, setData] = useState(null);

  const handleGetAll = async () => {
    try {
      const res = await fetch("/api/listing/get-all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": "Bearer " + localStorage.getItem("token")
        },
      });
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAll();
  }, []);

  return (
    <div className="flex flex-wrap justify-center px-4 py-8">
      {data ? (
        Array.isArray(data) ? (
          data.map((item, index) => (
            <ListingCard key={index} listing={item} />
          ))
        ) : (
          <ListingCard listing={data} />
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Home;
