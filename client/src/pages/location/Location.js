import { useEffect, useRef } from "react";
import goongjs from "@goongmaps/goong-js";
import "@goongmaps/goong-js/dist/goong-js.css";
import axios from "axios";
import useAuth from "../../hooks/useAuth.js";

const GOONG_MAP_KEY = "XP1k6rTp4DX90uWQNiL1rDgxa5XFQTYoQoIOdBXz";

const Location = () => {
  const mapContainerRef = useRef(null);
  const { auth } = useAuth();

  useEffect(() => {
    if (!GOONG_MAP_KEY) {
      console.error("Missing GOONG_MAP_KEY");
      return;
    }

    goongjs.accessToken = GOONG_MAP_KEY;

    const map = new goongjs.Map({
      container: mapContainerRef.current,
      style: "https://tiles.goong.io/assets/goong_map_web.json",
      center: [105.8544441, 21.028511], // default to Hanoi
      zoom: 14,
    });

    // Lấy vị trí hiện tại của người dùng
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.setCenter([longitude, latitude]);

        new goongjs.Marker({ color: "blue" }) // marker của chính mình
          .setLngLat([longitude, latitude])
          .setPopup(
            new goongjs.Popup().setHTML("<h4>Vị trí hiện tại của bạn</h4>")
          )
          .addTo(map);
      },
      (error) => {
        console.error("Lỗi khi lấy vị trí: ", error.message);
      },
      { enableHighAccuracy: true }
    );

    // Gọi API lấy danh sách bạn bè và thêm vào bản đồ
    axios
      .post("/api/friend/get-friend-list", {
        userId: auth.userId,
      })
      .then((res) => {
        const friends = res.data;

        friends.forEach((friend) => {
          const { username, avatar, latitude, longitude } = friend;
          new goongjs.Marker()
            .setLngLat([longitude, latitude])
            .setPopup(
              new goongjs.Popup().setHTML(`
                <div style="text-align: center;">
                  <img src="${avatar}" alt="${username}" width="50" height="50" style="border-radius: 50%;" />
                  <h4>${username}</h4>
                </div>
              `)
            )
            .addTo(map);
        });
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API bạn bè:", err);
      });

    return () => map.remove();
  }, []);

  return (
    <div className="w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

export default Location;
