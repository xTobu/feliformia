import { request } from "../lib/nocodb";
import { ShiftMap } from "../helper/constant";

import repoLine from "./line.repo";
import dayjs from "dayjs";

const TABLE_ID_MAIN = process.env.NOCODB_BASEID_MEDICINE;
const TABLE_ID_NOTICE = process.env.NOCODB_BASEID_MEDICINE_NOTICE;

// ok
export const ListNotice = async (body) => {
  try {
    const { shift } = body;
    const where = `(shift,eq,both)~or(shift,eq,${shift})`;
    const response = await request.get(
      `${TABLE_ID_NOTICE}/records?where=${where}`
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = response;

    return data.list.map((record) => ({
      name: record.name,
      reason: record.reason,
      treatment: record.treatment,
      shift: record.shift,
    }));
  } catch (error) {
    console.error("Error fetching list from NocoDB:", error.message);
    throw error;
  }
};

// ok
export const Get = async (body) => {
  try {
    const { date, shift } = body;

    const where = `(date,eq,exactDate,${date})~and(shift,eq,${shift})`;
    const response = await request.get(
      `${TABLE_ID_MAIN}/records?where=${where}&limit=1`
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = response;
    return data.list.map((record) => ({
      ...record,
      Id: record.Id,
      cats: JSON.parse(record.cats),
    }));
  } catch (error) {
    console.error("Error fetching list from NocoDB:", error.message);
    throw error;
  }
};

// ok
export const Between = async (body) => {
  try {
    const { dateStart, dateEnd } = body;

    const where = `(date,ge,exactDate,${dateStart})~and(date,le,exactDate,${dateEnd})`;
    const limit = 100;
    const sort = `date`;
    const response = await request.get(
      `${TABLE_ID_MAIN}/records?where=${where}&limit=${limit}&sort=${sort}`
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = response;
    return data.list.map((record) => ({
      ...record,
      cats: JSON.parse(record.cats),
    }));
  } catch (error) {
    console.error("Error fetching list from NocoDB:", error.message);
    throw error;
  }
};

// ok
// 建立一筆初始化用的記錄
export const Create = async (body) => {
  let list = [];
  const notices = await ListNotice(body);
  notices.forEach((notice, index, array) => {
    list.push({
      ...notice,
      done: false,
    });
  });
  try {
    const { date, shift } = body;
    const response = await request.post(`${TABLE_ID_MAIN}/records`, {
      date,
      shift,
      cats: JSON.stringify(list),
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = response;
    return {
      id: data.id,
      date,
      shift,
      cats: list,
    };
  } catch (error) {
    console.error("Error fetching list from NocoDB:", error.message);
    throw error;
  }
};

// ok
export const Update = async (body) => {
  try {
    const { Id, date, shift, cats, note, member } = body;

    const oldData = await Get({
      date,
      shift,
    });
    const { note: oldNote } = oldData[0];

    const response = await request.patch(`${TABLE_ID_MAIN}/records`, {
      Id: Id,
      shift: shift,
      date: date,
      cats: JSON.stringify(cats),
      note: note,
      member: member,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (note == "") {
      return;
    }

    if (note != oldNote) {
      const textDate = dayjs(date).format("YYYY/MM/DD");
      const textShift = ShiftMap(shift);
      const textPush = `餵藥及特殊飲食紀錄\n---------------\n日期： ${textDate}\n班別： ${textShift}\n志工： ${
        member || ""
      }\n回報：\n${note || ""}`;
      const textSite =
        process.env.DEPLOY_SITE == "feliformia"
          ? ""
          : `[${process.env.DEPLOY_SITE}]\n`;
      await repoLine.Push({ text: textSite + textPush });
    }

    return;
  } catch (error) {
    console.error("Error update medicine", error.message);
    throw error;
  }
};
