import { table } from "../lib/airtable";
import { ShiftMap } from "../helper/constant";
import repoCat from "./cat.repo.noco";
import repoLine from "./line.repo";
import dayjs from "dayjs";

export const Get = async (body) => {
  const { date, shift } = body;
  const selector = table.regular.select({
    view: "Grid view",
    maxRecords: 1,
    filterByFormula: `AND(IS_SAME(date,'${date}'),shift='${shift}')`,
  });

  const records = await selector.firstPage();
  return records.map((record) => {
    return {
      ...record.fields,
      recordId: record.id,
      cats: JSON.parse(record.fields.cats),
    };
  });
};

export const Between = async (body) => {
  const { dateStart, dateEnd } = body;
  const selector = table.regular.select({
    view: "Grid view",
    maxRecords: 100,
    sort: [
      { field: "date", direction: "asc" },
      { field: "shift", direction: "asc" },
    ],
    filterByFormula: `AND(IS_AFTER(date,DATEADD('${dateStart}', -1, "days")),IS_BEFORE(date,DATEADD('${dateEnd}', 1, "days")))`,
  });

  const records = await selector.firstPage();
  return records.map((record) => {
    return {
      ...record.fields,
      recordId: record.id,
      cats: JSON.parse(record.fields.cats),
    };
  });
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

  const { date, shift } = body;
  const records = await table.regular.create([
    {
      fields: {
        date,
        shift,
        cats: JSON.stringify(list),
      },
    },
  ]);

  return {
    ...records[0].fields,
    recordId: records[0].id,
    cats: JSON.parse(records[0].fields.cats),
  };
};

// 更新資料
export const Update = async (body) => {
  const { recordId, date, shift, cats, note, member } = body;
  try {
    const oldData = await Get({
      date: dayjs(date).format("YYYY-MM-DD"),
      shift,
    });
    const { note: oldNote } = oldData[0];

    const updates = await table.regular.update([
      {
        id: recordId,
        fields: {
          shift: shift,
          date: date,
          cats: JSON.stringify(cats),
          note: note,
          member: member,
        },
      },
    ]);

    const {
      fields: { note: newNote },
    } = updates[0];

    if (newNote != oldNote) {
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
  } catch (error) {
    throw error;
  }

  return "";
};
