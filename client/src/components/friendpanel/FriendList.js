import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useUserData from '../../hooks/useUserData';
import useAuth from '../../hooks/useAuth';

const userId = "68124fe82edd14add7ba029c";

const FriendList = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const { userId } = useUserData();
    const { auth } = useAuth();

    
    console.log(userId);
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                setLoading(true);
                const response = await axiosPrivate.post('/api/friend/get-friend-list', {
                    userId: auth._id
                });
                console.log(userId);
                setFriends(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching friends:', err);
                setError('Không thể tải danh sách bạn bè. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchFriends();
        }
    }, [userId, axiosPrivate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 p-4 text-center">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {friends.length === 0 ? (
                <div className="text-gray-500 text-center p-4">
                    Bạn chưa có bạn bè nào
                </div>
            ) : (
                friends.map((friend) => (
                    <div
                        key={friend.userId}
                        className="flex items-center p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {friend.avatar ? (
                                <img
                                    src={friend.avatar}
                                    alt={friend.username}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-500 text-lg">
                                    {friend.username.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="ml-3">
                            <h3 className="font-medium text-gray-900">{friend.username}</h3>
                            <p className="text-sm text-gray-500">{friend.fullName || 'Chưa cập nhật tên'}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default FriendList;