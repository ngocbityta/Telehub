import { useChatContext } from "stream-chat-react";
import useAuth from "../../hooks/useAuth";

const CustomSearchResult = ({ result, index, focusedUser }) => {
  const isChannel = result.cid;

  const { client, setActiveChannel } = useChatContext();
  const { auth } = useAuth();

  async function createChat(result) {
    const channel = client.channel('messaging', {
      image: `https://getstream.io/random_png/?name=${result.name ?? result.id}`,
      name: `${result.name}`,
      members: [`${auth.username}`, result.id],
    });
    setActiveChannel(channel);
  }

  return (
    <button
      className={`search-result-item ${index === focusedUser ? 'search-result-item_focused' : ''}`}
      onClick={() => createChat(result)}
    >
      {isChannel ? (
        <>
          <span className='search-result-item__icon'>#️⃣</span>
          {result.data?.name}
        </>
      ) : (
        <div className="flex items-center justify-start h-14 px-6 py-5 ml-2">
          <img className="w-9 h-9 rounded-full mr-2" alt="result" src={result.image} />
          <span className="font-medium text-black opacity-90">{result.name ?? result.id}</span>
        </div>
      )}
    </button>
  );
};

export default CustomSearchResult;