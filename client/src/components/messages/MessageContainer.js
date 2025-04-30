import {
  Channel, MessageInput, MessageList, Thread, Window, useChatContext,
} from 'stream-chat-react';
import { IoIosVideocam, IoIosCall, IoIosMenu } from 'react-icons/io';
import Tippy from "@tippyjs/react";
import { MdDeleteOutline } from "react-icons/md";
import { CgLogOut } from "react-icons/cg";
import { confirmAlert } from 'react-confirm-alert';
import { EmojiPicker } from 'stream-chat-react/emojis';
import { init, SearchIndex } from 'emoji-mart';
import data from '@emoji-mart/data';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useSocket from '../../hooks/useSocket';
import useAuth from '../../hooks/useAuth';

init({ data });

const ChannelHeader = ({ channelData, members, memberIds, handleStartCall }) => {

  const { client, setActiveChannel } = useChatContext();

  const isGroup = channelData?.isGroup;

  const finalMemberIds = memberIds?.length ? memberIds : channelData?.members;

  const index = finalMemberIds.findIndex(id => id !== client.userID);

  const otherUser = members[Object.keys(members)[index]];

  const axiosPrivate = useAxiosPrivate();

  const deleteConversation = async () => {
    try {
      await axiosPrivate.put(`/api/chat/delete/${channelData?.cid}`)
    } catch (error) {
      console.log(error);
    }
  }

  const leaveGroup = async () => {
    axiosPrivate.put(`/api/group/leave/${channelData?.cid}`).then(() => {
      setActiveChannel(null);
    }).catch(error => {
      console.log(error);
    });
  }

  const actionConfirm = ({ action }) => {
    confirmAlert({
      closeOnEscape: true,
      closeOnClickOutside: true,
      customUI: ({ onClose }) => {
        return (
          <div className="bg-[rgba(39,38,38,0.1)] fixed inset-0 flex items-center justify-center ">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h1 className="text-xl text-black font-bold mb-4">{action === "Delete" ? 'Delete conversation' : 'Leave group'}</h1>
              {
                action === "Delete" ?
                  <p className="text-gray-600 mb-6">Every messages, files, audios in the conversation will be deleted.
                    <br></br>Action not reversible!</p>
                  : <p className="text-gray-600 mb-6">You will no longer have access to the chat.
                    <br></br>Action not reversible!</p>
              }
              <div className="flex justify-end">
                <button
                  className="mr-2 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 text-white"
                  onClick={onClose}
                >
                  No
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => {
                    if (action === 'Delete')
                      deleteConversation();
                    else {
                      leaveGroup();
                    }
                    onClose();
                  }}
                >
                  {action === "Delete" ? 'Yes, confirm delete' : 'Yes, confirm leave'}
                </button>
              </div>
            </div>
          </div >
        );
      },
    });
  }

  const chatOptions = () => {
    return (
      <div className="w-auto h-auto flex flex-col gap-0">
        {
          (!isGroup || (isGroup && channelData?.created_by?.id === client.userID)) && (
            <div
              onClick={() => actionConfirm({ action: 'Delete' })}
              className="flex cursor-pointer space-x-2 text-red-500 text-base hover:bg-gray-200 font-medium text-center p-1"
            >
              <MdDeleteOutline size={24} />
              <span className='select-none'>Delete conversation</span>
            </div>
          )
        }
        {
          (isGroup && channelData?.created_by?.id !== client.userID) && (
            <div
              onClick={() => actionConfirm({ action: 'Leave' })}
              className="flex cursor-pointer space-x-2 text-red-500 text-base hover:bg-gray-200 font-medium text-center p-1"
            >
              <CgLogOut size={24} />
              <span className='select-none'>Leave group</span>
            </div>
          )
        }
      </div>
    );
  }


  return (
    <div className='str-chat__header-livestream'>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="str-chat__avatar str-chat__avatar--rounded str-chat__message-sender-avatar">
          <img
            alt="K"
            className="str-chat__avatar-image str-chat__avatar-image--loaded"
            data-testid="avatar-img"
            src={isGroup ? channelData?.image :
              (otherUser?.user?.image || `https://getstream.io/random_svg/?id=oliver&name=${finalMemberIds[index]}`)}
          />
        </div>
        <div className="str-chat__header-livestream-left str-chat__channel-header-end">
          <p className="str-chat__header-livestream-left--title str-chat__channel-header-title">{isGroup ? channelData?.name : finalMemberIds[index]}</p>
        </div>
      </div>
      <div className='flex flex-row space-x-3'>
        <button className="call-button" onClick={() => handleStartCall('audio')}>
          <IoIosCall size={30} color='#007bff' />
        </button>
        <button className="call-button" onClick={() => handleStartCall('video')}>
          <IoIosVideocam size={30} color='#007bff' />
        </button>
        <Tippy
          content={chatOptions()}
          animation="scale"
          placement="bottom-end"
          interactive={true}
          theme={"light"}
          trigger='click'
        >
          <button className="call-button" >
            <IoIosMenu size={30} color='#007bff' />
          </button>
        </Tippy>
      </div>
    </div>
  );
};

const MessageContainer = () => {
  const { channel } = useChatContext();
  const { auth } = useAuth();
  const { socket } = useSocket();
  const members = channel?.state?.members;
  const memberIds = Object.keys(members || []);
  const axiosPrivate = useAxiosPrivate();

  const handleStartCall = async (callType) => {
    const callId = await axiosPrivate.get(`/api/call?cid=${channel?.data?.cid}`);
    if (callId?.data?.cid) {
      socket.emit('calling', {
        image: auth.image,
        callType: callType,
        isGroup: channel?.data?.isGroup,
        name: channel?.data?.name,
        memberIds: JSON.stringify(memberIds),
        callId: callId?.data?.cid
      });
      window.open(`/call/${callType}/${callId?.data?.cid}`, '_blank', 'width=1280,height=720');
    }
    else {
      alert('Error');
    }
  };

  return (
    <Channel EmojiPicker={EmojiPicker} emojiSearchIndex={SearchIndex} >
      <Window>
        <ChannelHeader channelData={channel?.data} members={members} memberIds={memberIds} handleStartCall={handleStartCall} />
        <MessageList closeReactionSelectorOnClick
          disableDateSeparator onlySenderCanEdit showUnreadNotificationAlways={false} />
        <MessageInput focus audioRecordingEnabled />
      </Window>
      <Thread />
    </Channel>
  );
};

export default MessageContainer;
