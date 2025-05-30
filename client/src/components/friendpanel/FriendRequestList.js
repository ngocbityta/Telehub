import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';

const FriendRequestList = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await axiosPrivate.post('/api/friend/get-friend-request-list', {
                userId: auth.userId
            });
            
            if (response.data) {
                // Lọc ra chỉ những lời mời kết bạn mà người khác gửi cho mình
                const incomingRequests = response.data.filter(request => request.userId !== auth.userId);
                setRequests(incomingRequests);
            }
        } catch (err) {
            console.error("Error fetching friend requests:", err);
            setError("Không thể tải danh sách lời mời kết bạn. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async (friendRequestId) => {
        try {
            await axiosPrivate.post('/api/friend/response-friend-request', {
                friendRequestId: friendRequestId,
                type: 'accept'
            });
            // Cập nhật lại danh sách sau khi chấp nhận
            fetchRequests();
        } catch (err) {
            console.error("Error accepting friend request:", err);
            console.error("Error response:", err.response?.data);
            console.error("Error status:", err.response?.status);
            setError(
                err.response?.data?.message ||
                "Không thể chấp nhận lời mời kết bạn. Vui lòng thử lại."
            );
        }
    };

    const handleDeclineRequest = async (friendRequestId) => {
        try {
            await axiosPrivate.post('/api/friend/response-friend-request', {
                friendRequestId: friendRequestId,
                type: 'decline'
            });
            // Cập nhật lại danh sách sau khi từ chối
            fetchRequests();
        } catch (err) {
            console.error("Error declining friend request:", err);
            console.error("Error response:", err.response?.data);
            console.error("Error status:", err.response?.status);
            setError(
                err.response?.data?.message ||
                "Không thể từ chối lời mời kết bạn. Vui lòng thử lại."
            );
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const displayedRequests = showAll ? requests : requests.slice(0, 5);

    return (
        <div className="friend-request-list">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">
                    Lời mời kết bạn <span className="text-gray-500 text-sm font-normal">({requests.length})</span>
                </h2>
                {requests.length > 5 && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                        {showAll ? 'Thu gọn' : `Xem tất cả (${requests.length})`}
                    </button>
                )}
            </div>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            {loading ? (
                <p className="text-gray-500 text-sm">Đang tải...</p>
            ) : (
                <div className="space-y-1">
                    {displayedRequests.map((request) => (
                        <div
                            key={request.id}
                            className="bg-white p-2 rounded-lg shadow hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center space-x-2">
                                <img 
                                    src={request.avatar || `https://getstream.io/random_svg/?id=${request.username}`} 
                                    alt={`${request.username}'s avatar`}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-grow">
                                    <p className="font-medium text-sm">{request.username}</p>
                                    <div className="flex space-x-1 mt-1">
                                        <button
                                            onClick={() => handleAcceptRequest(request._id)}
                                            className="bg-green-500 text-white px-2 py-0.5 text-xs rounded hover:bg-green-600"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleDeclineRequest(request._id)}
                                            className="bg-red-500 text-white px-2 py-0.5 text-xs rounded hover:bg-red-600"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FriendRequestList; 