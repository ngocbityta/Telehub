import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import { FaComments, FaPhone, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useChatContext } from 'stream-chat-react';

const FriendList = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const navigate = useNavigate();
    const { client, setActiveChannel } = useChatContext();

    const fetchFriends = async () => {
        try {
            setLoading(true);
            const response = await axiosPrivate.post('/api/friend/get-friend-list', {
                userId: auth.userId
            });
            
            if (response.data) {
                setFriends(response.data);
            }
        } catch (err) {
            console.error("Error fetching friends:", err);
            setError("Không thể tải danh sách bạn bè. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFriend = async (friendId) => {
        try {
            await axiosPrivate.post('/api/friend/delete-friend', {
                userId: auth.userId,
                friendId: friendId
            });
            // Cập nhật lại danh sách sau khi xóa bạn
            fetchFriends();
        } catch (err) {
            console.error("Error deleting friend:", err);
            setError("Không thể xóa bạn bè. Vui lòng thử lại.");
        }
    };

    const handleMessage = async (friendId, friendUsername) => {
        try {
            // Tìm kênh chat đã tồn tại với người bạn
            const channels = await client.queryChannels({
                members: { $in: [auth.username, friendId] },
                type: 'messaging'
            });

            let channel;
            if (channels.length > 0) {
                // Nếu đã có kênh chat, sử dụng kênh đầu tiên
                channel = channels[0];
            } else {
                // Nếu chưa có kênh chat, tạo mới
                channel = client.channel('messaging', {
                    image: `https://getstream.io/random_png/?name=${friendUsername}`,
                    name: friendUsername,
                    members: [auth.username, friendId],
                });
            }
            
            // Chuyển đến kênh chat
            await setActiveChannel(channel);
            navigate('/');
        } catch (err) {
            console.error("Error handling chat channel:", err);
            setError("Không thể mở kênh chat. Vui lòng thử lại.");
        }
    };

    const handleCall = (friendId) => {
        // TODO: Implement call functionality
        console.log('Call friend:', friendId);
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    const displayedFriends = showAll ? friends : friends.slice(0, 5);

    return (
        <div className="friend-list">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">
                    Bạn bè <span className="text-gray-500 text-sm font-normal">({friends.length})</span>
                </h2>
                {friends.length > 5 && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                        {showAll ? 'Thu gọn' : `Xem tất cả (${friends.length})`}
                    </button>
                )}
            </div>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            {loading ? (
                <p className="text-gray-500 text-sm">Đang tải...</p>
            ) : (
                <div className="space-y-1">
                    {displayedFriends.map((friend) => (
                        <div
                            key={friend.id}
                            className="bg-white p-2 rounded-lg shadow hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center space-x-2">
                                <img 
                                    src={friend.avatar || `https://getstream.io/random_svg/?id=${friend.username}`} 
                                    alt={`${friend.username}'s avatar`}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-grow">
                                    <p className="font-medium text-sm">{friend.username}</p>
                                    <div className="flex space-x-1 mt-1">
                                        <button
                                            onClick={() => handleMessage(friend.id, friend.username)}
                                            className="bg-blue-500 text-white p-1.5 rounded hover:bg-blue-600"
                                            title="Nhắn tin"
                                        >
                                            <FaComments className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() => handleCall(friend.id)}
                                            className="bg-green-500 text-white p-1.5 rounded hover:bg-green-600"
                                            title="Gọi điện"
                                        >
                                            <FaPhone className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteFriend(friend.id)}
                                            className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600"
                                            title="Xóa bạn"
                                        >
                                            <FaTrash className="w-3 h-3" />
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

export default FriendList;