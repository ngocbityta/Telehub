import React, { useState } from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import ChangeInfoForm from "../../components/settingpanel/ChangeInfoForm";
import ChangePasswordForm from "../../components/settingpanel/ChangePasswordForm";
import SystemSettings from "../../components/settingpanel/SystemSettings";

const Settings = () => {
  const [showChangeInfo, setShowChangeInfo] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showSystemSettings, setShowSystemSettings] = useState(false);

  const toggleChangeInfo = () => {
    setShowChangeInfo(!showChangeInfo);
    setShowChangePassword(false);
    setShowSystemSettings(false);
  };
  
  const toggleChangePassword = () => {
    setShowChangePassword(!showChangePassword);
    setShowChangeInfo(false);
    setShowSystemSettings(false);
  };
  const toggleSystemSettings = () => {
    setShowSystemSettings(!showSystemSettings);
    setShowChangePassword(false);
    setShowChangeInfo(false);
  };

  return (
    <div className="h-auto min-w-[350px] bg-[var(--page-bg)]">
      {/* Header */}
      <h1 className="p-3 text-2xl font-bold flex items-center text-green-700 mb-0">
        Settings
      </h1>
      <div className="divider mt-0"></div>
      <div className="flex flex-col gap-4">
        <div className="bg-[var(--settings-box-bg)] rounded h-auto shadow mx-3" style={{borderRadius: "10px"}}>
          <div
            onClick={toggleChangeInfo}
            className="p-5 rounded flex items-center justify-between font-semibold text-md text-[var(--login-text-color)]
            bg-[var(--settings-box-bg)]"
            style={{borderRadius: "10px"}}
          >
            Change Information
            {showChangeInfo ? (
              <span className="text-green-700 text-xl">
                <FaMinusCircle />
              </span>
            ) : (
              <span className="text-green-700 text-xl">
                <FaPlusCircle />
              </span>
            )}
          </div>
          <div>{showChangeInfo && <ChangeInfoForm />}</div>
        </div>
        <div className="bg-[var(--settings-box-bg)] rounded h-auto shadow mx-3" style={{borderRadius: "10px"}}>
          <div
            onClick={toggleChangePassword}
            className="p-5 rounded flex items-center justify-between  font-semibold text-md text-[var(--login-text-color)]
            bg-[var(--settings-box-bg)]"
            style={{borderRadius: "10px"}}
          >
            Change Password
            {showChangePassword ? (
              <span className="text-green-700 text-xl">
                <FaMinusCircle />
              </span>
            ) : (
              <span className="text-green-700 text-xl">
                <FaPlusCircle />
              </span>
            )}
          </div>
          {showChangePassword && <ChangePasswordForm />}
        </div>
        <div className="bg-[var(--settings-box-bg)] rounded h-auto shadow mx-3" style={{borderRadius: "10px"}}>
          <div
            onClick={toggleSystemSettings}
            className="p-5 rounded flex items-center justify-between  font-semibold text-md text-[var(--login-text-color)]
            bg-[var(--settings-box-bg)]"
            style={{borderRadius: "10px"}}
          >
            System settings
            {showSystemSettings ? (
              <span className="text-green-700 text-xl">
                <FaMinusCircle />
              </span>
            ) : (
              <span className="text-green-700 text-xl">
                <FaPlusCircle />
              </span>
            )}
          </div>
          {showSystemSettings && <SystemSettings />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
