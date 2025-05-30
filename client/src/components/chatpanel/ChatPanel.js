import React from "react";
import { ChannelList, useChatContext } from "stream-chat-react";

import CustomChannel from "./Channel";
import CustomSearchResult from "./SearchResult";

const ChatPanel = () => {

  const { client } = useChatContext();
  const filters = { members: { $in: [client.user.id] }, type: 'messaging' };
  const options = { presence: true, state: true };
  const sort = { last_message_at: -1 };

  return (
    <div className='w-[349px] bg-[var(--page-bg)]'>
      <h1 className="font-bold text-green-700 text-2xl p-3">Chats</h1>
      <div className="divider mt-0" style={{ margin: '0 0 0 0' }}></div>
      <ChannelList Preview={CustomChannel} sort={sort} filters={filters} options={options}
        showChannelSearch additionalChannelSearchProps={{
          searchForChannels: false,
          SearchResultItem: CustomSearchResult,
        }} />
    </div>
  );
};

export default ChatPanel;
