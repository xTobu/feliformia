import { request } from "../lib/nocodb";
import { ShiftMap } from "../helper/constant";

import repoCat from "./cat.repo.noco";
import repoLine from "./line.repo";
import dayjs from "dayjs";

const TABLE_ID_MAIN = process.env.NOCODB_BASEID_REGULAR;

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

// 建立一筆初始化用的記錄
export const Create = async (body) => {
  let list = [];
  const cats = await repoCat.List();
  cats.forEach((cat, index, array) => {
    list.push({
      cat: cat,
      name: cat.name,
      feed: true,
      feed_detail: 0,
      can: false,
      can_detail: 0,
      feces: false,
      feces_warning: null,
      urine: false,
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

// 更新資料
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

    if (note != oldNote) {
      const textDate = dayjs(date).format("YYYY/MM/DD");
      const textShift = ShiftMap(shift);
      const textPush = `飲食及如廁紀錄\n------------\n日期： ${textDate}\n班別： ${textShift}\n志工： ${
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
    throw error;
  }
};
