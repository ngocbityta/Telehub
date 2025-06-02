import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';

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
      // Push a new state when opening modal
      window.history.pushState({ modal: 'file' }, '');
    }
  }, [isOpen, channelId]);

  useEffect(() => {
    const handlePopState = (event) => {
      if (isOpen) {
        onClose();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

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
                      className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
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

export default FileModal; 