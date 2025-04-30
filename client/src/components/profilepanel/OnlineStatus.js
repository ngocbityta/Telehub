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
      <div className="w-[150px] h-[85px] flex flex-col gap-0">
        <div
          onClick={() => handleOnlineStatusChange("Online")}
          className="cursor-pointer text-green-500 hover:bg-gray-200 font-medium text-center p-1">
          Online
        </div>
        <div
          onClick={() => handleOnlineStatusChange("Offline")}
          className="cursor-pointer text-gray-500 hover:bg-gray-200 font-medium text-center p-1">
          Offline
        </div>
        <div
          onClick={() => handleOnlineStatusChange("Busy")}
          className="cursor-pointer text-red-500 hover:bg-gray-200 font-medium text-center p-1">
          Busy
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
      >
        <div className="flex flex-row items-center gap-0">
          <span
            className={`inline-block hover:cursor-pointer px-2 py-1 rounded-md text-sm font-bold ${onlineStatus === "Online"
              ? "text-green-500"
              : onlineStatus === "Offline"
                ? "text-gray-500"
                : "text-red-500 "
              }`}
          >
            {onlineStatus}
          </span>
          <GoTriangleDown />
        </div>
      </Tippy>
    </div>
  );
};

export default OnlineStatus;
