import { useChatContext } from "stream-chat-react";

const CustomChannel = (props) => {
  const { channel, setActiveChannel } = props;
  const chatContext = useChatContext();

  const chatMembers = channel.state.members;
  const isGroup = channel.data?.isGroup;

  const totalOnline = Object.values(chatMembers).reduce(
    (total, member) => total + !!member?.user?.online,
    0
  );

  const otherMember = Object.values(chatMembers).filter(
    (member) => member?.user?.id !== chatContext.client.userID
  )[0];

  const totalUnreadMessages = channel.countUnread();

  const { messages } = channel.state;
  const lastMessage = messages[messages.length - 1];
  const lastMessageDate = new Date(lastMessage?.created_at);
  const currentDate = new Date();

  let lastMessageTime;
  if (
    currentDate.getDate() === lastMessageDate.getDate() &&
    currentDate.getMonth() === lastMessageDate.getMonth() &&
    currentDate.getFullYear() === lastMessageDate.getFullYear()
  ) {
    lastMessageTime = lastMessageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    lastMessageTime = lastMessageDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div
  onClick={() => setActiveChannel?.(channel)}
  className={`cursor-pointer w-full max-w-[500px] rounded-md transition-colors duration-200
    ${chatContext.channel === channel ? 'bg-green-100' : 'bg-white hover:bg-green-50'}
    border border-gray-200 shadow-sm px-3 py-2`}
>
  <div className="flex items-center gap-3">
    {/* Avatar */}
    <div className="relative flex-shrink-0">
      <img
        className="w-10 h-10 rounded-md object-cover border border-green-400"
        src={!isGroup ? otherMember?.user?.image : channel?.data?.image || `https://ui-avatars.com/api/?name=${channel?.data?.name || 'G'}`}
        alt={isGroup ? channel?.data?.name : otherMember?.user?.name}
      />
      {/* Online dot */}
      {(isGroup && totalOnline > 1) || (!isGroup && otherMember?.user?.online) ? (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
      ) : null}
    </div>

    {/* Text Info */}
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center">
        <h4 className={`truncate text-sm font-semibold ${isGroup ? 'text-green-700' : 'text-gray-900'}`}>
          {isGroup ? channel.data.name : otherMember?.user?.name || 'Unnamed'}
        </h4>
        <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
          {lastMessageTime}
        </span>
      </div>
      {isGroup && (
        <div className="text-[10px] text-green-600 font-medium">
          {totalOnline} {totalOnline > 1 ? 'online' : 'online'}
        </div>
      )}
      <p className="text-xs truncate text-gray-600 max-w-full">
        {lastMessage?.text || (lastMessage?.attachments?.length ? '📎 Attachment' : 'No messages yet')}
      </p>
    </div>

    {/* Unread badge */}
    <div className="flex-shrink-0 ml-2">
      {chatContext.channel !== channel && totalUnreadMessages > 0 ? (
        <div className="bg-green-600 text-white text-[10px] min-w-[18px] h-5 rounded-full flex items-center justify-center shadow">
          {totalUnreadMessages > 9 ? '9+' : totalUnreadMessages}
        </div>
      ) : null}
    </div>
  </div>
</div>

  );
};

export default CustomChannel;
