// components/friends/AddFriend.jsx
import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const AddFriend = ({ onFriendAdded }) => {
  const [friendUsername, setFriendUsername] = useState("");
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const handleAddFriend = async (e) => {
    e.preventDefault();
    setError(null);
    if (!friendUsername.trim()) {
      setError("Vui lòng nhập username của bạn bè.");
      return;
    }

    try {
      // Lưu ý: bỏ dấu '/' cuối nếu backend không require
      const response = await axiosPrivate.post("/api/friend/edit-friend-list", {
        action: "add",
        friendUsername: friendUsername.trim(),
      });
      // Giả sử response.data là object của friend mới
      onFriendAdded(response.data);
      setFriendUsername("");
    } catch (err) {
      console.error("Error adding friend:", err);
      setError(
        err.response?.data?.message ||
          "Thêm bạn thất bại. Vui lòng thử lại sau."
      );
    }
  };

  return (
    <form
      onSubmit={handleAddFriend}
      className="add-friend flex items-center space-x-2 mb-4"
    >
      <input
        type="text"
        value={friendUsername}
        onChange={(e) => setFriendUsername(e.target.value)}
        placeholder="Nhập username bạn bè"
        className="border p-2 rounded flex-grow"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Thêm bạn
      </button>
      {error && <p className="text-red-500 w-full mt-1">{error}</p>}
    </form>
  );
};

export default AddFriend;
