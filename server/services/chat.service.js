import _ from "lodash";
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

const getMediaFromConservation = async (cid) => {
  const filter = { cid: { $eq: cid } };

  const result = await streamServer.search(filter, {
    attachments: {
      $exists: true,
    },
  });

  const messages = _.map(result.results, (messageResponse) => {
    return messageResponse.message;
  });

  const media = [];

  _.forEach(messages, (message) => {
    if (!_.isEmpty(message.attachments)) {
      const attachmentsWithMedia = _.filter(
        message.attachments,
        (attachment) => {
          return (
            (attachment.type === "image" && attachment.image_url) ||
            (attachment.type === "video" && attachment.asset_url)
          );
        }
      );
      if (!_.isEmpty(attachmentsWithMedia)) {
        media.push(...attachmentsWithMedia);
      }
    }
  });

  return media;
};

const getFilesFromConversation = async (cid) => {
  const filter = { cid: { $eq: cid } };

  const result = await streamServer.search(filter, {
    attachments: {
      $exists: true,
    },
  });

  const messages = _.map(result.results, (messageResponse) => {
    return messageResponse.message;
  });

  const assets = [];

  _.forEach(messages, (message) => {
    if (!_.isEmpty(message.attachments)) {
      const attachmentsWithFile = _.filter(
        message.attachments,
        (attachment) => {
          return attachment.type === "file" && attachment.asset_url;
        }
      );
      if (!_.isEmpty(attachmentsWithFile)) {
        assets.push(...attachmentsWithFile);
      }
    }
  });

  return assets;
};

const searchMessageFromConversation = async (cid, searchText) => {
  const filter = { cid: { $eq: cid } };
  if (!searchText) {
    return [];
  } 

  const result = await streamServer.search(filter, {
    text: {
      $autocomplete: searchText,
    },
  });

  const messages = _.map(result.results, (messageResponse) => {
    return {
      text: messageResponse.message.text,
      html: messageResponse.message.html,
      user: {
        id: messageResponse.message.user.id,
        name: messageResponse.message.user.name,
        image: messageResponse.message.user.image,
      },
      createdAt: messageResponse.message.createdAt,
    }
  });

  return messages;
};

export default {
  hardDeleteConversation,
  getMediaFromConservation,
  getFilesFromConversation,
  searchMessageFromConversation,
};
