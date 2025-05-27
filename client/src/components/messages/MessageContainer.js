import {
  Channel, MessageInput, MessageList, Thread, Window, useChatContext,
} from 'stream-chat-react';
import { IoIosVideocam, IoIosCall, IoIosMenu, IoIosImages, IoIosDocument } from 'react-icons/io';
import Tippy from "@tippyjs/react";
import { MdDeleteOutline, MdSearch } from "react-icons/md";
import { CgLogOut } from "react-icons/cg";
import { confirmAlert } from 'react-confirm-alert';
import { EmojiPicker } from 'stream-chat-react/emojis';
import { init, SearchIndex } from 'emoji-mart';
import data from '@emoji-mart/data';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useSocket from '../../hooks/useSocket';
import useAuth from '../../hooks/useAuth';
import { useState, useEffect } from 'react';

init({ data });

const SearchModal = ({ isOpen, onClose, onSearch, channelId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await axiosPrivate.post(`/api/chat/search/${channelId}`, {
        searchText: searchQuery
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Search Messages</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter search query..."
            className="flex-1 p-2 border rounded-md"
            style={{
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              width: '100%',
              boxSizing: 'border-box',
              backgroundColor: 'white',
              color: 'black',
              fontSize: '16px',
              fontFamily: 'Arial, sans-serif',
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            searchResults.map((message, index) => (
              <div key={index} className="p-3 border-b hover:bg-gray-50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{message.sender}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700">{message.text}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">
              {isLoading ? 'Searching...' : 'No messages found'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const MediaModal = ({ isOpen, onClose, channelId }) => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching media for channel:', channelId);
      const response = await axiosPrivate.get(`/api/chat/media/${channelId}`);
      console.log('Media response:', response.data);
      setMediaFiles(response.data);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, channelId]);

  const renderMediaPreview = (media) => {
    if (media.type === 'image') {
      return (
        <img
          src={media.image_url}
          alt={`Media ${media.id}`}
          className="w-full h-full object-cover rounded-lg"
        />
      );
    } else if (media.type === 'video') {
      return (
        <div className="relative w-full h-full">
          <video
            src={media.asset_url}
            className="w-full h-full object-cover rounded-lg"
            controls
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black bg-opacity-50 rounded-full p-2">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderSelectedMedia = (media) => {
    if (media.type === 'image') {
      return (
        <img
          src={media.image_url}
          alt="Selected media"
          className="max-w-full max-h-[90vh] object-contain"
        />
      );
    } else if (media.type === 'video') {
      return (
        <video
          src={media.asset_url}
          controls
          className="max-w-full max-h-[90vh]"
          autoPlay
        />
      );
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Media Files</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading media...</p>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-2 overflow-y-auto flex-1">
            {mediaFiles && mediaFiles.length > 0 ? (
              mediaFiles.map((media, index) => (
                <div
                  key={index}
                  className="relative aspect-square cursor-pointer hover:opacity-90 w-32 h-32 border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                  onClick={() => setSelectedMedia(media)}
                >
                  {renderMediaPreview(media)}
                </div>
              ))
            ) : (
              <p className="col-span-5 text-center text-gray-500 py-4">
                No media files found
              </p>
            )}
          </div>
        )}

        {/* Media Preview Modal */}
        {selectedMedia && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative max-w-4xl max-h-[90vh]">
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                ✕
              </button>
              {renderSelectedMedia(selectedMedia)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FileModal = ({ isOpen, onClose, channelId }) => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching files for channel:', channelId);
      const response = await axiosPrivate.get(`/api/chat/files/${channelId}`);
      console.log('Files response:', response.data);
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFiles();
    }
  }, [isOpen, channelId]);

  const getFileIcon = (fileType) => {
    // Add more file types as needed
    const fileIcons = {
      'pdf': '📄',
      'doc': '📝',
      'docx': '📝',
      'xls': '📊',
      'xlsx': '📊',
      'ppt': '📑',
      'pptx': '📑',
      'txt': '📄',
      'zip': '🗜️',
      'rar': '🗜️',
      'default': '📎'
    };
    return fileIcons[fileType] || fileIcons.default;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Files</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading files...</p>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1">
            {files && files.length > 0 ? (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="text-2xl mr-3">
                      {getFileIcon(file.title.trim().split('.').pop())}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{file.title}</div>
                      <div className="text-sm text-gray-500">
                        {formatFileSize(file.file_size)}
                      </div>
                    </div>
                    <a
                      href={file.asset_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No files found
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

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
      </div>
    );
  }

  return (
    <>
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
