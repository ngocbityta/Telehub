import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { initSocket, getSocket } from "../socket/socket";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const [messages, setMessages] = useState(null);
  const [isMessageLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);

  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Initialize socket
  useEffect(() => {
    const newSocket = initSocket();
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Add current user to online list
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user?._id) return;

    socket.emit("addNewUser", user._id);

    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket, user]);

  // Send message
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !newMessage) return;

    const recipientId = currentChat?.members?.find((id) => id !== user?._id);

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  // Receive messages and notifications
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("newMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;
      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);
      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  // Get all users & determine potential chats
  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);

      if (response.error) {
        return console.log("Error fetching users", response);
      }

      const pChats = response.filter((u) => {
        if (user?._id === u._id) return false;

        const isChatCreated = userChats?.some((chat) =>
          chat.members.includes(u._id)
        );

        return !isChatCreated;
      });

      setPotentialChats(pChats);
      setAllUsers(response);
    };

    getUsers();
  }, [userChats]);

  // Get user chats
  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await getRequest(`${baseUrl}/chats/${user._id}`);

        setIsUserChatsLoading(false);
        if (response.error) {
          return setUserChatsError(response);
        }

        setUserChats(response);
      }
    };

    getUserChats();
  }, [user, notifications]);

  // Get messages for current chat
  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);
      const url = `${baseUrl}/messages/${currentChat?._id}`;
      const response = await getRequest(url);

      setIsMessagesLoading(false);
      if (response.error) {
        return setMessagesError(response);
      }
      setMessages(response);
    };

    if (currentChat?._id) {
      getMessages();
    }
  }, [currentChat]);

  // Send text message logic
  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextmessage) => {
      if (!textMessage) return console.log("Must type something...");

      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
        })
      );

      if (response.error) {
        return setSendTextMessageError(response);
      }

      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextmessage("");
    },
    []
  );

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({ firstId, secondId })
    );

    if (response.error) {
      return console.log("Error creating chat", response);
    }

    setUserChats((prev) => [...prev, response]);
  }, []);

  const markAllNotificationsAdRead = useCallback((notifications) => {
    const mNotifications = notifications.map((n) => ({
      ...n,
      isRead: true,
    }));

    setNotifications(mNotifications);
  }, []);

  const markNotificationsAdRead = useCallback(
    (n, userChats, user, notifications) => {
      const desireChat = userChats.find((chat) => {
        const chatMembers = [user._id, n.senderId];
        return chat?.members.every((member) => chatMembers.includes(member));
      });

      const mNotifications = notifications.map((el) =>
        n.senderId === el.senderId ? { ...n, isRead: true } : el
      );

      updateCurrentChat(desireChat);
      setNotifications(mNotifications);
    },
    []
  );

  const markThisUserNotificationsAsRead = useCallback(
    (thisUserNotifications, notifications) => {
      const mNotifications = notifications.map((el) => {
        const matched = thisUserNotifications.find(
          (n) => n.senderId === el.senderId
        );
        return matched ? { ...matched, isRead: true } : el;
      });

      setNotifications(mNotifications);
    },
    []
  );

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        currentChat,
        messages,
        isMessageLoading,
        messagesError,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationsAdRead,
        markNotificationsAdRead,
        markThisUserNotificationsAsRead,
        socket,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
