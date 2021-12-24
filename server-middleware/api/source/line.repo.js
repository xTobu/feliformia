import {
  client as lineClient,
  groupIdMain as lineGroupIdMain,
  groupIdPartner as lineGroupIdPartner,
} from "../lib/line";

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
    if (process.env.DEPLOY_SITE == "feliformia") {
      await lineClient.pushMessage(lineGroupIdMain, messages);
    }
    await lineClient.pushMessage(lineGroupIdPartner, messages);

    return;
  } catch (error) {
    throw error;
  }
};

export default { Push };
