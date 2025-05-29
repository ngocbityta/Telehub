import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';

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

export default MediaModal; 