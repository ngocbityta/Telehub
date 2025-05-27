import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

const SearchUser = () => {
  const [userId, setUserId] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  console.log(auth._id);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setUserInfo(null);
    setFriendRequestSent(false);
    
    if (!userId.trim()) {
      setError("Vui lòng nhập ID người dùng.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosPrivate.get(`/api/user/${userId}`);
      setUserInfo(response.data);
    } catch (err) {
      console.error("Error searching user:", err);
      setError(
        err.response?.data?.message ||
          "Không tìm thấy người dùng. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async () => {
    try {
      await axiosPrivate.post('/api/friend/editFriendList', {
        userId: auth._id,
        userFriend: {
            id: userInfo._id,
            username: userInfo.username,
            fullname: userInfo.fullname,
            image: userInfo.image,
            email: userInfo.email,
        }
      });
      setFriendRequestSent(true);
    } catch (err) {
      console.error("Error adding friend:", err);
      setError(
        err.response?.data?.message ||
          "Không thể gửi lời mời kết bạn. Vui lòng thử lại."
      );
    }
  };

  return (
    <div className="search-user">
      <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Nhập ID người dùng"
          className="border p-2 rounded flex-grow"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {userInfo && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Thông tin người dùng</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-4 mb-4">
              <img 
                src={userInfo.image || `https://getstream.io/random_svg/?id=${userInfo.username}`} 
                alt={`${userInfo.username}'s avatar`}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p><span className="font-medium">Fullname:</span> {userInfo.fullname}</p>
                <p><span className="font-medium">Username:</span> {userInfo.username}</p>
                <p><span className="font-medium">Email:</span> {userInfo.email}</p>
              </div>
            </div>
            {userInfo._id !== auth._id && (
              <button
                onClick={handleAddFriend}
                disabled={friendRequestSent}
                className={`w-full py-2 px-4 rounded ${
                  friendRequestSent 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {friendRequestSent ? 'Đã gửi lời mời kết bạn' : 'Thêm bạn bè'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchUser; 