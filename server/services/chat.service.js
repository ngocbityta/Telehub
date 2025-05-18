import streamServer from "../stream.js";

const hardDeleteConversation = async (cid, username) => {
  const filter = { cid: { $eq: cid } };
  const channels = await streamServer.queryChannels(filter);
  const channel = channels[0];

  if (!channel) {
    throw new Error(`Channel with cid ${cid} not found`);
  }

  await channel.truncate({
    hard_delete: true,
    skip_push: false,
    message: {
      text: `${username} deleted the conversation.`,
      user_id: username,
    },
  });
};

export { hardDeleteConversation };
