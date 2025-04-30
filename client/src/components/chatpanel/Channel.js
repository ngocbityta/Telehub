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
    member => member?.user?.id !== chatContext.client.userID
  )[0];

  // console.log(otherMember)

  const totalUnreadMessages = channel.countUnread();

  const { messages } = channel.state;
  const lastMessage = messages[messages.length - 1];
  const lastMessageDate = new Date(lastMessage?.created_at);
  const currentDate = new Date();

  let lastMessageTime
  if (
    currentDate.getDate() === lastMessageDate.getDate() &&
    currentDate.getMonth() === lastMessageDate.getMonth() &&
    currentDate.getFullYear() === lastMessageDate.getFullYear()
  ) {
    lastMessageTime = lastMessageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    lastMessageTime = lastMessageDate.toLocaleString();
  }

  return (
    <div onClick={() => setActiveChannel?.(channel)} className="h-auto min-w-[300px] max-w-[350px] bg-[var(--channel-bg)]">
      <div className="py-0 flex flex-col overflow-hidden">
        <div className="overflow-auto">
          <div className="flex items-center p-4 border-b border-[var(--channel-border-color)] hover:bg-[var(--channel-hover-bg)] hover:cursor-pointer">
            <div className="mr-4">
              <div className="relative">
                <img
                  className="w-10 h-10 rounded-full object-cover "
                  src={!isGroup ? otherMember?.user?.image : channel?.data?.image}
                  alt=""
                />
                {
                  totalOnline > 1 && <span className='top-0 left-7 bg-green-400 absolute w-3.5 h-3.5 border-2 border-white dark:border-gray-800 rounded-full'
                  ></span>
                }
              </div>
            </div>
            <div className="flex-1">
              {
                isGroup && <span className="text-sm text-gray-500">{`Online: ${totalOnline}`}</span>
              }
              <div className="font-medium text-[var(--login-text-color)] opacity-90">{(isGroup ? channel.data.name : otherMember.user_id) || 'Unnamed Channel'}
              </div>
              <div className="text-xs truncate max-w-[180px] text-gray-500">{lastMessage?.text}</div>
            </div >
            <div className="text-xs flex-[0.3] text-gray-500">
              {
                chatContext.channel !== channel && totalUnreadMessages ?
                  <div className="bg-red-500 w-5 h-5 rounded-full flex justify-center items-center font-light text-white">
                    {totalUnreadMessages}
                  </div> :
                  <span>{lastMessageTime !== 'Invalid Date' && lastMessageTime}</span>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomChannel;