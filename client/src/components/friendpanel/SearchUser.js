import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

const SearchUser = () => {
  const [username, setUsername] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(new Set());
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setSearchResults([]);
    
    if (!username.trim()) {
      setError("Vui lòng nhập tên người dùng.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosPrivate.post('/api/friend/search-friends', {
        userId: auth._id,
        username: username.trim()
      });
      
      // Sắp xếp kết quả theo thứ tự: friend request -> friend -> stranger
      const sortedResults = response.data.sort((a, b) => {
        const order = { 'friend request': 0, 'friend': 1, 'stranger': 2 };
        return order[a.relationship] - order[b.relationship];
      });
      
      setSearchResults(sortedResults);
    } catch (err) {
      console.error("Error searching users:", err);
      setError(
        err.response?.data?.message ||
          "Không tìm thấy người dùng. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      await axiosPrivate.post('/api/friend/accept-request', {
        userId: auth.userId,
        friendId: userId
      });
      // Cập nhật lại danh sách sau khi chấp nhận
      handleSearch({ preventDefault: () => {} });
    } catch (err) {
      console.error("Error accepting friend request:", err);
      setError("Không thể chấp nhận lời mời kết bạn. Vui lòng thử lại.");
    }
  };

  const handleDeclineRequest = async (userId) => {
    try {
      await axiosPrivate.post('/api/friend/decline-request', {
        userId: auth._id,
        friendId: userId
      });
      // Cập nhật lại danh sách sau khi từ chối
      handleSearch({ preventDefault: () => {} });
    } catch (err) {
      console.error("Error declining friend request:", err);
      setError("Không thể từ chối lời mời kết bạn. Vui lòng thử lại.");
    }
  };

  const handleDeleteFriend = async (userId) => {
    try {
      await axiosPrivate.post('/api/friend/delete-friend', {
        userId: auth._id,
        friendId: userId
      });
      // Cập nhật lại danh sách sau khi xóa bạn
      handleSearch({ preventDefault: () => {} });
    } catch (err) {
      console.error("Error deleting friend:", err);
      setError("Không thể xóa bạn bè. Vui lòng thử lại.");
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      console.log('Auth object:', auth);
      console.log('Auth ID:', auth._id);
      console.log('Friend ID:', userId);
      const response = await axiosPrivate.post('/api/friend/create-friend-request', {
        userId: auth.userId,
        friendId: userId
      });
      console.log('Friend request response:', response.data);
      // Thêm userId vào danh sách pending
      setPendingRequests(prev => new Set([...prev, userId]));
      // Cập nhật lại danh sách sau khi gửi lời mời
      handleSearch({ preventDefault: () => {} });
    } catch (err) {
      console.error("Error adding friend:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      setError(
        err.response?.data?.message || 
        "Không thể gửi lời mời kết bạn. Vui lòng thử lại."
      );
    }
  };

  const renderActionButtons = (user) => {
    // Nếu đang trong trạng thái pending
    if (pendingRequests.has(user.id)) {
      return (
        <div className="mt-2">
          <span className="text-yellow-600 font-medium">Pending...</span>
        </div>
      );
    }

    switch (user.relationship) {
      case 'friend request':
        return (
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => handleAcceptRequest(user.id)}
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
            >
              Accept
            </button>
            <button
              onClick={() => handleDeclineRequest(user.id)}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Decline
            </button>
          </div>
        );
      case 'friend':
        return (
          <button
            onClick={() => handleDeleteFriend(user.id)}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 mt-2"
          >
            Delete
          </button>
        );
      case 'stranger':
        return (
          <button
            onClick={() => handleAddFriend(user.id)}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 mt-2"
          >
            Add
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="search-user">
      <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nhập tên người dùng"
          className="border p-2 rounded flex-grow bg-white"
          style={{borderRadius: '10px'}}
        />
        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={loading}
          style={{borderRadius: '10px'}}
        >
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {searchResults.length > 0 && (
        <div className="space-y-2">
          {searchResults.map((user) => (
            <div
              key={user.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <img 
                  src={user.avatar || `https://getstream.io/random_svg/?id=${user.username}`} 
                  alt={`${user.username}'s avatar`}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-grow">
                  <p className="font-medium text-lg">{user.username}</p>
                  <p className="text-sm text-gray-500">
                    {user.relationship === 'friend' ? 'Bạn bè' : 
                     user.relationship === 'friend request' ? 'Lời mời kết bạn' :
                     user.relationship === 'stranger' ? 'Chưa kết bạn' : ''}
                  </p>
                  {renderActionButtons(user)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchUser; 