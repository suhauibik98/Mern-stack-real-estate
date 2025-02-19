import { useEffect, useState } from "react";

export default function useGeolocation() {
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [status, setStatus] = useState("prompt"); // Possible values: "granted", "denied", "prompt"

  useEffect(() => {
    const geo = navigator.geolocation;

    if (!geo) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    // Check permissions
    navigator.permissions
      .query({ name: "geolocation" })
      .then((permissionStatus) => {
        setStatus(permissionStatus.state);

        // Watch for changes in permission state
        permissionStatus.onchange = () => {
          setStatus(permissionStatus.state);
        };

        // If permission is granted, start watching position
        if (permissionStatus.state === "granted") {
          startWatching();
        } else if (permissionStatus.state === "denied") {
          // console.error("Geolocation access is denied. Please enable it in browser settings.");
        }
      });

    // Function to start watching the geolocation
    function startWatching() {
      const watcher = geo.watchPosition(
        (position) => {
          setPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          // console.log("Location retrieved:", position.coords);
        },
        (error) => {
          console.error("Error retrieving geolocation:", error);
        }
      );

      // Cleanup the watcher when component unmounts
      return () => geo.clearWatch(watcher);
    }
  }, []);

  useEffect(() => {
    if (status === "denied") {
      // alert("Location access has been denied. Please enable location permissions in your browser.");
    } else if (status === "granted") {
      // console.log("Location access has been granted.");
    } else {
      // console.log("Awaiting user decision for location access.");
    }
  }, [status]);

  return { position, status };
}
