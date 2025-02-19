import { useEffect, useRef, useState } from "react";
import leaflet from "leaflet";
import useLocalStorage from "../hooks/useLocalStorage";
import useGeolocation from "../hooks/useGeolocation";

export default function Map({ lat =0  , long = 0,  onLocationSelect }) {

  
  const mapRef = useRef();
  const userMarkerRef = useRef();
  const {position} = useGeolocation();
  // const [userPosition, setUserPosition] = useState(()=>{
  //   if(lat !== 0 && long !==0){
  //     return {lat,long}
  //   }
  //   else return position
  // });
  const initialPosition = lat !== 0 && long !== 0 ? { latitude: lat, longitude: long } : position;

  // const [nearbyMarkers, setNearbyMarkers] = useLocalStorage(
  //   "NEARBY_MARKERS",
  //   []
  // );


  
  useEffect(() => {
    // Initialize Map
    mapRef.current = leaflet
      .map("map")
      .setView([initialPosition.latitude , initialPosition.longitude ], 15);

    // Add Tile Layer
    leaflet
      .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      })
      .addTo(mapRef.current);

    // Add Existing Markers
    // nearbyMarkers.forEach(({ latitude, longitude }) => {
    //   leaflet
    //     .marker([latitude, longitude])
    //     .addTo(mapRef.current)
    //     .bindPopup(`lat: ${latitude.toFixed(2)}, long: ${longitude.toFixed(2)}`);
    // });
    let singleMarker; // Store a reference to the single marker

    // Add Click Event Listener
    mapRef.current.addEventListener("click", (e) => {
      const { lat: latitude, lng: longitude } = e.latlng;

      // Call the callback to update the form
      if (onLocationSelect) {
        onLocationSelect({ latitude, longitude });
      }
      if (singleMarker) {
        mapRef.current.removeLayer(singleMarker);
      }
      // Add Marker
      singleMarker = leaflet
        .marker([latitude, longitude])
        .addTo(mapRef.current)
        .bindPopup(`lat: ${latitude.toFixed(2)}, long: ${longitude.toFixed(2)}`)
        .openPopup()

      // Save Nearby Markers
    //   setNearbyMarkers((prevMarkers) => [
    //     ...prevMarkers,
    //     { latitude, longitude },
    //   ]);
    });
  }, []);

  useEffect(() => {
    // Update User Position
    // setUserPosition({ ...userPosition });
    const currentPostion = lat !== 0 && long !== 0 ? { latitude: lat, longitude: long } : position;

    if (userMarkerRef.current) {
      mapRef.current.removeLayer(userMarkerRef.current);
    }

    // Add User Marker
    userMarkerRef.current = leaflet
      .marker([currentPostion.latitude, currentPostion.longitude])
      .addTo(mapRef.current)
      .bindPopup("my position User");

    const el = userMarkerRef.current.getElement();
    if (el) {
      el.style.filter = "hue-rotate(120deg)";
    }

    // Update Map View
    mapRef.current.setView([currentPostion.latitude, currentPostion.longitude]);
  }, [position , lat ,  long]);

  return <div id="map" className="bottom-0 w-full h-[50vh] z-0"></div>;
}


// import { useEffect, useRef } from "react";
// import leaflet from "leaflet";
// import useLocalStorage from "../hooks/useLocalStorage";
// import useGeolocation from "../hooks/useGeolocation";

// export default function Map() {
//   const mapRef = useRef();
//   const userMarkerRef = useRef();

//   const [userPosition, setUserPosition] = useLocalStorage("USER_MARKER", {
//     latitude: 0,
//     longitude: 0,
//   });

//   const [nearbyMarkers, setNearbyMarkers] = useLocalStorage(
//     "NEARBY_MARKERS",
//     []
//   );

//   const location = useGeolocation();

//   useEffect(() => {
//     mapRef.current = leaflet
//       .map("map")
//       .setView([userPosition.latitude, userPosition.longitude], 13);

//     leaflet
//       .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         maxZoom: 19,
//         attribution:
//           '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//       })
//       .addTo(mapRef.current);

//     nearbyMarkers.forEach(({ latitude, longitude }) => {
//       leaflet
//         .marker([latitude, longitude])
//         .addTo(mapRef.current)
//         .bindPopup(
//           `lat: ${latitude.toFixed(2)}, long: ${longitude.toFixed(2)}`
//         );
//     });

//     mapRef.current.addEventListener("click", (e) => {
//       const { lat: latitude, lng: longitude } = e.latlng;
//       leaflet
//         .marker([latitude, longitude])
//         .addTo(mapRef.current)
//         .bindPopup(
//           `lat: ${latitude.toFixed(2)}, long: ${longitude.toFixed(2)}`
//         );

//       setNearbyMarkers((prevMarkers) => [
//         ...prevMarkers,
//         { latitude, longitude },
//       ]);
//     });
//   }, []);

//   useEffect(() => {
//     setUserPosition({ ...userPosition });

//     if (userMarkerRef.current) {
//       mapRef.current.removeLayer(userMarkerRef.current);
//     }

//     userMarkerRef.current = leaflet
//       .marker([location.latitude, location.longitude])
//       .addTo(mapRef.current)
//       .bindPopup("User");

//     const el = userMarkerRef.current.getElement();
//     if (el) {
//       el.style.filter = "hue-rotate(120deg)";
//     }

//     mapRef.current.setView([location.latitude, location.longitude]);
//   }, [location, userPosition.latitude, userPosition.longitude]);
//   return <div id="map" className="bottom-0 w-full h-[50vh] z-0" ref={mapRef}></div>;
// }