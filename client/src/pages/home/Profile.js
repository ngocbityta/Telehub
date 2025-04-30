import React from "react";
import OnlineStatus from "../../components/profilepanel/OnlineStatus";
import useAuth from "../../hooks/useAuth";

const Profile = () => {
  const { auth } = useAuth();

  return (
    <div className="h-auto min-w-[350px] bg-[var(--page-bg)]">
      {/* Header */}
      <h1 className="p-3 text-2xl font-bold flex items-center text-blue-500 mb-0">
        Profile
      </h1>
      <div className="divider mt-0"></div>
      {/* Infos section */}
      <div className="flex flex-col items-center gap-2 mt-8">
        <div className="avatar flex items-center justify-center">
          <div className="w-[7rem] rounded-full">
            <img src={auth.image} alt="" />
          </div>
        </div>
        <OnlineStatus />
        <div className="mt-2 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-black">{auth.username}</h2>
          <h2 className="text-md text-gray-500">{auth.email}</h2>
        </div>
      </div>
    </div>
  );
};

export default Profile;
