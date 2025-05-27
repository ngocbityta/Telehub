import React, { useState } from "react";
// import AddFriend from "../../components/friendpanel/AddFriend";
import FriendList from "../../components/friendpanel/FriendList";
import SearchUser from "../../components/friendpanel/SearchUser";

const Friends = () => {
    const [friends, setFriends] = useState([]);

    const handleFriendAdded = (newFriend) => {
        setFriends((prevFriends) => [...prevFriends, newFriend]);
    };

    return (
        <div className="h-auto min-w-[350px] bg-[var(--page-bg)]">
            {/* Header */}
            <div>
                <h1 className="font-bold text-blue-500 text-2xl p-3"> Friends </h1>
            </div>

            {/* Add Friend Button */}
            <div className="p-3">
                {/* <AddFriend onFriendAdded={handleFriendAdded} /> */}
                <SearchUser />
            </div>

            {/* Friend List */}
            <div className="pt-6">
                <FriendList friends={friends} />
            </div>
        </div>
    );
};

export default Friends;