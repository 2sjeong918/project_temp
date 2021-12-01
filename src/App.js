import * as React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
// import {render} from 'react-dom';
import MapGL, {
  Marker,
  NavigationControl,
  GeolocateControl,
} from "react-map-gl";

import ControlPanel from "./control-panel";
import Pin from "./pin";

function App() {
  const [viewport, setViewport] = useState({
    latitude: 37.507099445499136,
    longitude: 127.0594819999993,
    zoom: 0,
    bearing: 0,
    pitch: 0,
  });
  const [marker, setMarker] = useState({
    latitude: 37.500395960824875,
    longitude: 127.05166896502038,
  });
  const [events, logEvents] = useState({});

  const onMarkerDragStart = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragStart: event.lngLat }));
  }, []);

  const onMarkerDrag = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDrag: event.lngLat }));
  }, []);

  const onMarkerDragEnd = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragEnd: event.lngLat }));
    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
    });
  }, []);

  const positionOptions = { enableHighAccuracy: true };
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const mapRef = useRef(null);
  useEffect(() => {
    if (navigator.geolocation) {
      // GPS를 지원하면
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // position 객체 내부에 timestamp(현재 시간)와 coords 객체
          const time = new Date(position.timestamp);
          // console.log(position);
          // console.log(`현재시간 : ${time}`);
          // console.log(`latitude 위도 : ${position.coords.latitude}`);
          // console.log(`longitude 경도 : ${position.coords.longitude}`);
          // console.log(`altitude 고도 : ${position.coords.altitude}`);
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          // setMarker({
          //   latitude: position.coords.latitude,
          //   longitude: position.coords.longitude,
          // });
        },
        (error) => {
          console.error(error);
        },
        {
          enableHighAccuracy: false,
          maximumAge: 0,
          timeout: Infinity,
        }
      );
    } else {
      alert("GPS를 지원하지 않습니다");
    }
  }, []);
  useEffect(() => {
    console.log("marker :>> ", marker);
    console.log("mapRef :>> ", mapRef);
    const bounds = mapRef.current.getMap().getBounds();
    console.log("bounds :>> ", bounds);
  }, [marker]);

  return (
    <>
      <MapGL
        {...viewport}
        width="100vw"
        height="100vh"
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={setViewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        ref={mapRef}
      >
        {latitude}
        {longitude}
        <GeolocateControl
          style={geolocateStyle}
          positionOptions={positionOptions}
          trackUserLocation
          auto
        />
        <Marker
          longitude={marker.longitude}
          latitude={marker.latitude}
          offsetTop={-20}
          offsetLeft={-10}
          draggable
          onDragStart={onMarkerDragStart}
          onDrag={onMarkerDrag}
          onDragEnd={onMarkerDragEnd}
        >
          <Pin size={20} />
        </Marker>

        <div className="nav" style={navStyle}>
          <NavigationControl />
        </div>
      </MapGL>
      <ControlPanel events={events} />
    </>
  );
}

export default App;

const navStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  padding: "10px",
};
const geolocateStyle = {
  top: 0,
  left: 0,
  margin: 10,
};

// export function renderToDom(container) {
//   render(<App />, container);
// }
