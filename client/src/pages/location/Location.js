import { useEffect, useRef } from "react";
import goongjs from "@goongmaps/goong-js";
import "@goongmaps/goong-js/dist/goong-js.css";

const GOONG_MAP_KEY = "GdC8Piou6WPreAe2WIedy2IQeg1uV06g8GZ5Htth";
const GOONG_API_KEY = "GdC8Piou6WPreAe2WIedy2IQeg1uV06g8GZ5Htth";

export default function Location() {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!GOONG_MAP_KEY) {
      console.error("Missing GOONG_API_KEY in .env file");
      return;
    }

    // Initialize the map
    goongjs.accessToken = GOONG_MAP_KEY;
    const map = new goongjs.Map({
      container: mapContainerRef.current,
      style: "https://tiles.goong.io/assets/goong_map_web.json",
      center: [105.8544441, 21.028511], // default to Hanoi
      zoom: 14,
    });

    // Get current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.setCenter([longitude, latitude]);

        new goongjs.Marker()
          .setLngLat([longitude, latitude])
          .setPopup(new goongjs.Popup().setHTML("<h4>Vị trí hiện tại của bạn</h4>"))
          .addTo(map);
      },
      (error) => {
        console.error("Lỗi khi lấy vị trí: ", error.message);
      },
      { enableHighAccuracy: true }
    );

    // Cleanup
    return () => map.remove();
  }, []);

  return (
    <div className="w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
