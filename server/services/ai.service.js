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
    `Bạn là một trợ lý hữu ích trong một cuộc trò chuyện nhóm nhiều người, hoặc cuộc đối thoại giữa hai người. Tôi là ${username} trong cuộc hội thoại này. ` +
    `Vui lòng trả lời như một người tham gia dựa trên ngữ cảnh hiện tại. Không đưa ra ý kiến cá nhân hoặc thông tin riêng tư. ` +
    `Hãy đưa câu trả lời một cách tự nhiên, sáng tạo. Dưới đây là các tin nhắn:\n\n` +
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
