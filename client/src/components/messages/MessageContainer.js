import {
  Channel,
  MessageInput,
  MessageList,
  Thread,
  Window,
  useChatContext,
} from "stream-chat-react";
import { IoIosLocate } from "react-icons/io";
import { MdSmartToy } from "react-icons/md";
import { EmojiPicker } from "stream-chat-react/emojis";
import { init, SearchIndex } from "emoji-mart";
import data from "@emoji-mart/data";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useSocket from "../../hooks/useSocket";
import useAuth from "../../hooks/useAuth";
import { useState, useRef } from "react";
import ChannelHeader from "./components/ChannelHeader";
import _ from "lodash";

init({ data });

const MessageContainer = () => {
  const { channel } = useChatContext();
  const { auth } = useAuth();
  const { socket } = useSocket();
  const members = channel?.state?.members;
  const memberIds = Object.keys(members || []);
  const axiosPrivate = useAxiosPrivate();
  const [aiResult, setAiResult] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const messageInputRef = useRef(null);

  const handleStartCall = async (callType) => {
    const callId = await axiosPrivate.get(
      `/api/call?cid=${channel?.data?.cid}`
    );
    if (callId?.data?.cid) {
      socket.emit("calling", {
        image: auth.image,
        callType: callType,
        isGroup: channel?.data?.isGroup,
        name: channel?.data?.name,
        memberIds: JSON.stringify(memberIds),
        callId: callId?.data?.cid,
      });
      window.open(
        `/call/${callType}/${callId?.data?.cid}`,
        "_blank",
        "width=1280,height=720"
      );
    } else {
      alert("Error");
    }
  };

  const handleAiAssistant = async () => {
    try {
      setIsAiLoading(true);
      // Lấy tin nhắn gần đây
      const recentMessages = await axiosPrivate.get(
        `/api/chat/recent/${channel?.data?.cid}`
      );

      // Gửi tin nhắn đến AI để xử lý
      const aiResponse = await axiosPrivate.post("/api/ai/reply", {
        username: auth.username,
        messages: recentMessages.data.map((msg) => ({
          username: msg.user.name,
          text: msg.text,
        })),
      });

      setAiResult(aiResponse.data.result);
    } catch (error) {
      console.error("Error with AI assistant:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiResultClick = async () => {
    if (aiResult) {
      try {
        // Loại bỏ ký tự \n khi copy
        const cleanText = aiResult.replace(/\\n/g, " ");
        await navigator.clipboard.writeText(cleanText);
        // Thay đổi style tạm thời để thông báo đã copy
        const resultElement = document.querySelector(".ai-result-text");
        if (resultElement) {
          resultElement.classList.add("bg-green-50");
          setTimeout(() => {
            resultElement.classList.remove("bg-green-50");
          }, 500);
        }
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  const handleSendLocation = async () => {
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        const locationMessage = `📍 My current location: https://www.google.com/maps?q=${latitude},${longitude}`;

        // Send the location message
        await channel.sendMessage({
          text: locationMessage,
          user: { id: auth.userId },
        });

        const chatMemberNames = _.map(channel.state.members, (member) => {
          return member.user_id;
        });

        const chatMemberData = await axiosPrivate.post(`api/user/get-users`, {
          usernames: chatMemberNames,
        });

        const chatMemberIds = _.map(chatMemberData.data, (member) => {
          return member._id.toString();
        });

        console.log(chatMemberIds);

        await axiosPrivate.post(`api/friend/update-location-with-friends`, {
          userId: auth.userId,
          friendIds: chatMemberIds,
          latitude,
          longitude,
        });
      } catch (error) {
        console.error("Error getting location:", error);
        alert(
          "Unable to get your location. Please make sure location services are enabled."
        );
      }
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  return (
    <Channel EmojiPicker={EmojiPicker} emojiSearchIndex={SearchIndex}>
      <Window>
        <ChannelHeader
          channelData={channel?.data}
          members={members}
          memberIds={memberIds}
          handleStartCall={handleStartCall}
        />
        <MessageList
          closeReactionSelectorOnClick
          disableDateSeparator
          onlySenderCanEdit
          showUnreadNotificationAlways={false}
        />
        <div ref={messageInputRef} className="relative">
          <MessageInput focus audioRecordingEnabled />
        </div>
        <div
          style={{
            backgroundColor: "transparent",
            height: "auto",
            position: "absolute",
            bottom: "60px",
            left: "0",
            pointerEvents: "none",
            zIndex: 1,
          }}
          className="flex py-0.2 ml-4"
        >
          <div className="flex items-center gap-2">
            <button
              className="bg-green-700 text-white hover:bg-green-500 transition-colors duration-200 flex items-center justify-center"
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                pointerEvents: "auto",
              }}
              title="Send Location"
              onClick={handleSendLocation}
            >
              <IoIosLocate size={16} />
            </button>
            <button
              className="bg-green-700 text-white hover:bg-green-500 transition-colors duration-200 flex items-center justify-center"
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                pointerEvents: "auto",
              }}
              title="AI Assistant"
              onClick={handleAiAssistant}
            >
              <MdSmartToy size={16} />
            </button>
            {isAiLoading && (
              <div className="bg-white rounded-lg p-2 shadow-md pointer-events-auto">
                <div className="animate-pulse flex space-x-2">
                  <div className="h-2 w-2 bg-green-700 rounded-full"></div>
                  <div className="h-2 w-2 bg-green-700 rounded-full"></div>
                  <div className="h-2 w-2 bg-green-700 rounded-full"></div>
                </div>
              </div>
            )}
            {aiResult && !isAiLoading && (
              <div
                className="bg-white rounded-lg p-2 shadow-md max-w-xs pointer-events-auto cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                onClick={handleAiResultClick}
              >
                <p className="text-sm text-gray-700 ai-result-text">
                  {aiResult}
                </p>
              </div>
            )}
          </div>
        </div>
      </Window>
      <Thread />
    </Channel>
  );
};

export default MessageContainer;
