import { client as lineClient, groupId as lineGroupId } from "../lib/line";

// Send line push message
export const Push = async (body) => {
  const { text } = body;
  try {
    const messages = [
      {
        type: "text",
        text,
      },
    ];
    await lineClient.pushMessage(lineGroupId, messages);
    return;
  } catch (error) {
    throw error;
  }
};

export default { Push };