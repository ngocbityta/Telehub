import React, { useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import "tippy.js/themes/light.css";
import { GoTriangleDown } from "react-icons/go";

const OnlineStatus = () => {

  const [onlineStatus, setOnlineStatus] = useState("Online");

  // Handle Change on the online status
  const handleOnlineStatusChange = (status) => {
    setOnlineStatus(status);
  };

  // Determine tooltip content based on online status
  const statusOptions = () => {
    return (
      <div className="w-[180px] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="py-1">
          <div
            onClick={() => handleOnlineStatusChange("Online")}
            className="cursor-pointer text-green-500 hover:bg-gray-100 font-medium px-4 py-2 transition-colors duration-200 flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            Online
          </div>
          <div
            onClick={() => handleOnlineStatusChange("Offline")}
            className="cursor-pointer text-gray-500 hover:bg-gray-100 font-medium px-4 py-2 transition-colors duration-200 flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            Offline
          </div>
          <div
            onClick={() => handleOnlineStatusChange("Busy")}
            className="cursor-pointer text-red-500 hover:bg-gray-100 font-medium px-4 py-2 transition-colors duration-200 flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            Busy
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Tippy section for online status */}
      <Tippy
        content={statusOptions()}
        animation="scale"
        placement="bottom"
        interactive={true}
        theme={"light"}
        arrow={true}
        offset={[0, 8]}
      >
        <div className="flex flex-row items-center gap-1 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-1.5 transition-colors duration-200 cursor-pointer">
          <div className={`w-2 h-2 rounded-full ${
            onlineStatus === "Online"
              ? "bg-green-500"
              : onlineStatus === "Offline"
                ? "bg-gray-500"
                : "bg-red-500"
          }`}></div>
          <span
            className={`text-sm font-medium ${
              onlineStatus === "Online"
                ? "text-green-500"
                : onlineStatus === "Offline"
                  ? "text-gray-500"
                  : "text-red-500"
            }`}
          >
            {onlineStatus}
          </span>
          <GoTriangleDown className="text-gray-400" />
        </div>
      </Tippy>
    </div>
  );
};

export default OnlineStatus;
