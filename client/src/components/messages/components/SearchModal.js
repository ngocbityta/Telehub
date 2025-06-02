import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';

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

  useEffect(() => {
    if (isOpen) {
      // Push a new state when opening modal
      window.history.pushState({ modal: 'search' }, '');
    }
  }, [isOpen]);

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
              fontFamily: 'Quicksand, sans-serif',
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-blue-600"
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

export default SearchModal; 