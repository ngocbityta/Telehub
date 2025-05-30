import React, { useState } from "react";
// import AddFriend from "../../components/friendpanel/AddFriend";
import FriendList from "../../components/friendpanel/FriendList";
import SearchUser from "../../components/friendpanel/SearchUser";
import FriendRequestList from "../../components/friendpanel/FriendRequestList";

const Friends = () => {
    const [friends, setFriends] = useState([]);

    const handleFriendAdded = (newFriend) => {
        setFriends((prevFriends) => [...prevFriends, newFriend]);
    };

    return (
        <div className="h-auto min-w-[350px] bg-[var(--page-bg)]">
            {/* Header */}
            <div>
                <h1 className="font-bold text-green-700 text-2xl p-3"> Friends </h1>
            </div>
            <div className="divider mt-0"></div>
            {/* Add Friend Button */}
            <div className="p-3">
                {/* <AddFriend onFriendAdded={handleFriendAdded} /> */}
                <SearchUser />
            </div>

            {/* Friend Request */}
            <div className="pt-6" style={{padding: "0px 10px "}}>
                <FriendRequestList />
            </div>
            {/* Friend List */}
            <div className="pt-6" style={{padding: "0px 10px"}}>
                <FriendList friends={friends} />
            </div>
            
        </div>
    );
};

export default Friends;