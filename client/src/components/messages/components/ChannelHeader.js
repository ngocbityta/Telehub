import { useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import { IoIosVideocam, IoIosCall, IoIosMenu, IoIosImages, IoIosDocument } from 'react-icons/io';
import { MdDeleteOutline, MdSearch } from "react-icons/md";
import { CgLogOut } from "react-icons/cg";
import Tippy from "@tippyjs/react";
import { confirmAlert } from 'react-confirm-alert';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import SearchModal from './SearchModal';
import MediaModal from './MediaModal';
import FileModal from './FileModal';

const ChannelHeader = ({ channelData, members, memberIds, handleStartCall }) => {
  const { client, setActiveChannel } = useChatContext();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

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
        {/* Search option */}
        { 
          (!isGroup || (isGroup && channelData?.created_by?.id === client.userID)) && (
            <div
              onClick={() => setIsSearchModalOpen(true)}
              className="flex cursor-pointer space-x-2 text-base hover:bg-gray-200 font-medium text-center p-1"
            >
              <MdSearch size={24} />
              <span className='select-none'>Search</span>
            </div>
          )
        }

        {/* Media option */}
        {
          (!isGroup || (isGroup && channelData?.created_by?.id === client.userID)) && (
            <div
              onClick={() => setIsMediaModalOpen(true)}
              className="flex cursor-pointer space-x-2 text-base hover:bg-gray-200 font-medium text-center p-1"
            >
              <IoIosImages size={24} />
              <span className='select-none'>Media</span>
            </div>
          )
        }

        {/* File option */}
        {
          (!isGroup || (isGroup && channelData?.created_by?.id === client.userID)) && (
            <div
              onClick={() => setIsFileModalOpen(true)}
              className="flex cursor-pointer space-x-2 text-base hover:bg-gray-200 font-medium text-center p-1"
            >
              <IoIosDocument size={24} />
              <span className='select-none'>Files</span>
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
        {/* Delete option */}
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
      </div>
    );
  }

  return (
    <>
      <div className='str-chat__header-livestream' style={{ padding: '6.5px 50px 6.5px 20px' }}>
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
            <IoIosCall size={30} color='#3a7d3a' />
          </button>
          <button className="call-button" onClick={() => handleStartCall('video')}>
            <IoIosVideocam size={30} color='#3a7d3a' />
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
              <IoIosMenu size={30} color='#3a7d3a' />
            </button>
          </Tippy>
        </div>
      </div>
      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        channelId={channelData?.cid}
      />
      <MediaModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        channelId={channelData?.cid}
      />
      <FileModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        channelId={channelData?.cid}
      />
    </>
  );
};

export default ChannelHeader; 