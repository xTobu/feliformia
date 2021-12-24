const line = require("@line/bot-sdk");

export const client = new line.Client({
  channelAccessToken: process.env.LINE_CHANEL_ACCESS_TOKEN,
});

export const groupIdMain = process.env.LINE_GROUPID_FELIFORMIA_MAIN;
export const groupIdPartner = process.env.LINE_GROUPID_FELIFORMIA_PARTNER;
