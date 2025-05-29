import _ from "lodash";
import ai from "../gemini.js";

const getGeminiResponseFromMessages = async (username, messages) => {
  if (_.isEmpty(messages) || messages.length === 0 || messages.length > 10) {
    return "Xin lỗi, tôi không thể phản hồi ngay bây giờ.";
  }

  const messagesInString = _.map(messages, (message) => {
    return `${message.username}: ${message.text}`;
  }).join("\n");

  const contents =
    `You are a helpful assistant in a multi-person chat. I am ${username} in this conversation. ` +
    `Please reply as a participant based on the context. Do not include personal opinions or information. ` +
    `Keep the response concise and focused. Here are the messages:\n\n` +
    messagesInString;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
    });

    return {
      result: response.text,
    };
  } catch (error) {
    console.error("Error generating content:", error);
    return "Xin lỗi, tôi không thể phản hồi ngay bây giờ.";
  }
};

export default {
  getGeminiResponseFromMessages,
};
